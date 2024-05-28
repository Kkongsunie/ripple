import Message from "@/lib/models/Message";
import { dbConnect } from "@/lib/server/dbConnect";
import { MessageSchemaType } from "@/lib/types/messageValidation";
import { NextRequest, NextResponse } from "next/server";

function xorCipher(text: string, key: string): Uint8Array {
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
    const key = "ripple";

    // Encrypt the salutation
    const encryptedSalutationBytes = xorCipher(salutation, key);
    const encryptedSalutationBase64 = Buffer.from(
      encryptedSalutationBytes,
    ).toString("base64");

    // Encrypt the message
    const encryptedMessageBytes = xorCipher(message, key);
    const encryptedMessageBase64 = Buffer.from(encryptedMessageBytes).toString(
      "base64",
    );

    // Create a new message document
    const newMessage = await Message.create({
      salutation: encryptedSalutationBase64,
      message: encryptedMessageBase64,
      email,
      year,
      month,
      day,
    });

    console.log("New Message:", newMessage);

    console.log("Encrypted Message Base64:", encryptedMessageBase64);

    return NextResponse.json({
      encryptedMessageBase64,
      encryptedSalutationBase64,
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
