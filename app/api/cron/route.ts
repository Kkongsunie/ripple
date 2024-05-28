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

async function sendEmail({ email, salutation, message }: EmailContent) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: salutation,
    html: render(FutureMessage({ message, salutation })),
  };

  await transporter.sendMail(mailOptions);
}

function xorCipher(
  text: string,
  key: string,
  isBase64: boolean = false,
): Uint8Array {
  // Convert text to bytes if it is a string
  let textBytes: Uint8Array;
  if (isBase64) {
    textBytes = new Uint8Array(Buffer.from(text, "base64"));
  } else {
    textBytes = new TextEncoder().encode(text);
  }

  // Convert key to bytes
  const keyBytes = new TextEncoder().encode(key);

  // Ensure the key is at least as long as the text
  const extendedKeyBytes = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    extendedKeyBytes[i] = keyBytes[i % keyBytes.length];
  }

  // XOR each byte of the text with the corresponding byte of the key
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

  const messages = await Message.find(today);

  for (const message of messages) {
    const decryptedSalutationBytes = xorCipher(
      message.salutation,
      "ripple",
      true,
    );
    const decryptedSalutation = new TextDecoder().decode(
      decryptedSalutationBytes,
    );

    const decryptedMessageBytes = xorCipher(message.message, "ripple", true);
    const decryptedMessage = new TextDecoder().decode(decryptedMessageBytes);

    console.log("Decrypted Salutation:", decryptedSalutation);
    console.log("Decrypted Message:", decryptedMessage);

    await sendEmail({
      email: message.email,
      salutation: decryptedSalutation,
      message: decryptedMessage,
    });

    await Message.findByIdAndDelete(message._id);
  }

  const result = "Emails sent successfully";

  return NextResponse.json({ data: result });
}
