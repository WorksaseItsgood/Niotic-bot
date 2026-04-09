const antiRaid = require('../utils/antiRaid');
const config = require('../config');

module.exports = {
    name: 'channelCreate',
    async execute(channel, client) {
        if (!channel.guild) return;
        const guildConfig = config.getGuildConfig(channel.guild.id);
        if (guildConfig.antiRaid.enabled) {
            await antiRaid.checkThreshold(client, channel.guild, 'channels', guildConfig.antiRaid.thresholds.channels);
        }
    },
};
