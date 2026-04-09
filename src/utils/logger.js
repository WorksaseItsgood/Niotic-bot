const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class Logger {
    constructor() {}

    /**
     * Send log based on type
     * @param {Client} client 
     * @param {string} guildId 
     * @param {string} type - e.g. "mod-logs", "user-logs", etc.
     * @param {EmbedBuilder} embed 
     */
    async log(client, guildId, type, embed) {
        const guildConfig = config.getGuildConfig(guildId);
        
        // Check if logs are enabled for this type depending on logsLevel
        const logsLevel = guildConfig.logsLevel || "normal";
        const allowedLogs = this.getAllowedLogs(logsLevel);

        if (!allowedLogs.includes(type)) return;

        const channelId = guildConfig.logChannels[type];
        if (!channelId) return;

        try {
            const guild = client.guilds.cache.get(guildId);
            if (!guild) return;

            const channel = guild.channels.cache.get(channelId);
            if (!channel) return; // Maybe removed

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Failed to send log to ${channelId} (${type}):`, error);
        }
    }

    getAllowedLogs(level) {
        const normal = ["mod-logs", "user-logs", "server-logs"];
        const moyen = [...normal, "message-logs", "channel-logs"];
        const extreme = [...moyen, "role-logs", "raid-logs"];

        if (level === "extreme") return extreme;
        if (level === "moyen") return moyen;
        return normal;
    }
}

module.exports = new Logger();
