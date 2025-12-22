import type { ToolRegistration } from "../../types";
import { makeJsonSchema } from "../../utils/makeJsonSchema";
import { evolutionApi } from "../../utils/evolutionApi";
import { findMessagesSchema, type FindMessagesSchema } from "./schema";

export const findMessages = async (params: FindMessagesSchema) => {
  try {
    // Get messages from Evolution API
    const result = await evolutionApi.findMessages(
      params.instanceName,
      params.remoteJid
    );

    return result;
  } catch (error) {
    console.error("Error in findMessages:", error);
    throw new Error(`Failed to find messages: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const findMessagesTool: ToolRegistration<FindMessagesSchema> = {
  name: "find_messages",
  description: "Find message history for a specific WhatsApp contact by their remoteJid",
  inputSchema: makeJsonSchema(findMessagesSchema),
  handler: async (args: FindMessagesSchema) => {
    try {
      const parsedArgs = findMessagesSchema.parse(args);
      const result = await findMessages(parsedArgs);

      // Format the results for display
      const messageCount = result.messages?.length || 0;
      const resultJson = JSON.stringify(result, null, 2);

      return {
        content: [
          {
            type: "text",
            text: `Found ${messageCount} messages for contact ${parsedArgs.remoteJid} in instance ${parsedArgs.instanceName}\n\n${resultJson}`,
          },
        ],
      };
    } catch (error) {
      console.error("Error in findMessagesTool handler:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
};
