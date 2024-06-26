import { commandTypeHelpers as ct } from "../../../commandTypes.js";
import { sendErrorMessage, sendSuccessMessage } from "../../../pluginUtils.js";
import { postCmd } from "../types.js";
import { formatContent } from "../util/formatContent.js";

export const EditCmd = postCmd({
  trigger: "edit",
  permission: "can_post",

  signature: {
    message: ct.messageTarget(),
    content: ct.string({ catchAll: true }),
  },

  async run({ message: msg, args, pluginData }) {
    const targetMessage = await args.message.channel.messages.fetch(args.message.messageId);
    if (!targetMessage) {
      sendErrorMessage(pluginData, msg.channel, "Unknown message");
      return;
    }

    if (targetMessage.author.id !== pluginData.client.user!.id) {
      sendErrorMessage(pluginData, msg.channel, "Message wasn't posted by me");
      return;
    }

    targetMessage.channel.messages.edit(targetMessage.id, {
      content: formatContent(args.content),
    });
    sendSuccessMessage(pluginData, msg.channel, "Message edited");
  },
});
