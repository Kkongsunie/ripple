import { NextResponse } from "next/server";
import Message from "@/lib/models/Message";
import nodemailer from "nodemailer";
import { FutureMessage } from "@/emails/index";
import { dbConnect } from "@/lib/server/dbConnect";
import { render } from "@react-email/components";

interface EmailContent {
  email: string;
  salutation: string;
  message: string;
}

async function sendEmail({
  email,
  salutation,
  message,
}: EmailContent): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
    secure: true,
    requireTLS: true,
  });

  const mailOptions = {
    from: `<${process.env.EMAIL_USER!}>`,
    to: email,
    subject: "A Message from the future has arrived.",
    html: render(FutureMessage({ message, salutation })),
    headers: {
      "X-Priority": "3",
      "X-Mailer": "NodeMailer",
      "List-Unsubscribe": `<mailto:unsubscribe@yourdomain.com?subject=unsubscribe>`,
      Precedence: "bulk",
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    return false;
  }
}

function xorCipher(text: string): Uint8Array {
  let textBytes: Uint8Array;
  textBytes = new Uint8Array(Buffer.from(text, "base64"));

  const key = "ripple";
  const keyBytes = new TextEncoder().encode(key);
  const extendedKeyBytes = new Uint8Array(textBytes.length);

  for (let i = 0; i < textBytes.length; i++) {
    extendedKeyBytes[i] = keyBytes[i % keyBytes.length];
  }

  const resultBytes = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    resultBytes[i] = textBytes[i] ^ extendedKeyBytes[i];
  }

  return resultBytes;
}

export async function GET() {
  await dbConnect();

  const now = new Date();
  const today = {
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString(),
    day: now.getDate().toString(),
  };

  const messages = await Message.find({
    year: today.year,
    month: today.month,
    day: today.day,
    status: "waiting",
  });

  for (const message of messages) {
    const decryptedSalutationBytes = xorCipher(message.salutation);
    const decryptedSalutation = new TextDecoder().decode(
      decryptedSalutationBytes,
    );
    const decryptedMessageBytes = xorCipher(message.message);
    const decryptedMessage = new TextDecoder().decode(decryptedMessageBytes);

    const decryptedEmailBytes = xorCipher(message.email);
    const decryptedEmail = new TextDecoder().decode(decryptedEmailBytes);

    console.log("Decrypted Salutation:", decryptedSalutation);
    console.log("Decrypted Message:", decryptedMessage);
    console.log("Decrypted Email:", decryptedEmail);

    const emailSent = await sendEmail({
      email: decryptedEmail,
      salutation: decryptedSalutation,
      message: decryptedMessage,
    });

    if (emailSent) {
      await Message.updateOne({ _id: message._id }, { status: "sent" });
    }
  }

  const result = "Emails sent successfully";

  return NextResponse.json({ data: result });
}
