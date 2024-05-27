import { z } from "zod";

export const messageSchemaZod = z.object({
  salutation: z
    .string()
    .min(4, {
      message: 'Enter a Salutation like "Dear Aiah" or "To my friend"',
    })
    .trim(),
  message: z.string().min(10, { message: "Please put a message :)" }).trim(),
  year: z.string({ required_error: "Select a Year" }),
  month: z.string({ required_error: "Select a Month" }),
  day: z.string({ required_error: "Select a Day" }),
  email: z
    .string()
    .min(1, { message: "Email is required " })
    .email({ message: "Must be a valid email " }),
});

export type MessageSchemaType = z.infer<typeof messageSchemaZod>;
