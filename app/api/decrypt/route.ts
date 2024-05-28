import { dbConnect } from "@/lib/server/dbConnect";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { message } = body;
    const key = "ripple";

    // Decrypt the message (assuming it's in base64 format)
    const decryptedSalutationByes = xorCipher(message, key, true);
    const decryptedSalutation = new TextDecoder().decode(
      decryptedSalutationByes,
    );
    // Decrypt the message (assuming it's in base64 format)
    const decryptedMessageBytes = xorCipher(message, key, true);
    const decryptedMessage = new TextDecoder().decode(decryptedMessageBytes);

    console.log("Encrypted Base64:", message);
    console.log("Decrypted Message:", decryptedMessage);

    return NextResponse.json({
      decryptedMessage,
      decryptedSalutation,
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
