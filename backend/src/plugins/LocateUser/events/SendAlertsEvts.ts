import { Snowflake } from "discord.js";
import { locateUserEvt } from "../types.js";
import { sendAlerts } from "../utils/sendAlerts.js";

export const VoiceStateUpdateAlertEvt = locateUserEvt({
  event: "voiceStateUpdate",

  async listener(meta) {
    const memberId = meta.args.oldState.member?.id ?? meta.args.newState.member?.id;
    if (!memberId) {
      return;
    }

    if (meta.args.newState.channel != null) {
      if (meta.pluginData.state.usersWithAlerts.includes(memberId)) {
        sendAlerts(meta.pluginData, memberId);
      }
    } else {
      const triggeredAlerts = await meta.pluginData.state.alerts.getAlertsByUserId(memberId);
      const voiceChannel = meta.args.oldState.channel!;

      triggeredAlerts.forEach((alert) => {
        const txtChannel = meta.pluginData.guild.channels.resolve(alert.channel_id as Snowflake);
        if (txtChannel?.isTextBased()) {
          txtChannel.send({
            content: `🔴 <@!${alert.requestor_id}> the user <@!${alert.user_id}> disconnected out of \`${voiceChannel.name}\``,
            allowedMentions: { users: [alert.requestor_id as Snowflake] },
          });
        }
      });
    }
  },
});
