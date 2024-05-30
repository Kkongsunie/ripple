import Message from "@/lib/models/Message";
import { dbConnect } from "@/lib/server/dbConnect";
import { MessageSchemaType } from "@/lib/types/messageValidation";
import { NextRequest, NextResponse } from "next/server";

function xorCipher(text: string): Uint8Array {
  const key = "ripple";

  // Convert text and key to Uint8Array
  const textBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(key);

  // Ensure the key is at least as long as the text
  const extendedKeyBytes = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    extendedKeyBytes[i] = keyBytes[i % keyBytes.length];
  }

  // XOR each byte of the text with the corresponding byte of the key
  const encryptedBytes = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    encryptedBytes[i] = textBytes[i] ^ extendedKeyBytes[i];
  }

  return encryptedBytes;
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { message, salutation, email, year, day, month } =
      body as MessageSchemaType;

    // Encrypting the salutation
    const encryptedSalutationBytes = xorCipher(salutation);
    const encryptedSalutationBase64 = Buffer.from(
      encryptedSalutationBytes,
    ).toString("base64");

    // Encrypting the message
    const encryptedMessageBytes = xorCipher(message);
    const encryptedMessageBase64 = Buffer.from(encryptedMessageBytes).toString(
      "base64",
    );

    // Encrypting the email
    const encryptedEmailBytes = xorCipher(email);
    const encryptedEmailBase64 =
      Buffer.from(encryptedEmailBytes).toString("base64");

    // Saving Data to database
    const newMessage = await Message.create({
      salutation: encryptedSalutationBase64,
      message: encryptedMessageBase64,
      email: encryptedEmailBase64,
      year,
      month,
      day,
      status: "waiting",
    });

    console.log("New Message:", newMessage);

    return NextResponse.json({
      encryptedMessageBase64,
      encryptedSalutationBase64,
      encryptedEmailBase64,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      message: "Internal Server Error",
      error: error,
      success: false,
    });
  }
}
