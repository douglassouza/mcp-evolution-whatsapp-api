import { z } from "zod";

export const findMessagesSchema = z.object({
  instanceName: z.string().describe("Name of the Evolution API instance"),
  remoteJid: z.string().describe("WhatsApp contact ID (format: 5511999999999@s.whatsapp.net)")
});

export type FindMessagesSchema = z.infer<typeof findMessagesSchema>;
