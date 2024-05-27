import { dbConnect } from "@/lib/server/dbConnect";
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
    const { message } = body;
    const key = "ripple";

    // Encrypt the message
    const encryptedBytes = xorCipher(message, key);
    const encryptedBase64 = Buffer.from(encryptedBytes).toString("base64");

    console.log("Encrypted Base64:", encryptedBase64);

    return NextResponse.json({
      encryptedBase64,
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
