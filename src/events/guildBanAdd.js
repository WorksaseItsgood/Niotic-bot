const antiRaid = require('../utils/antiRaid');
const config = require('../config');

module.exports = {
    name: 'guildBanAdd',
    async execute(ban, client) {
        const guildConfig = config.getGuildConfig(ban.guild.id);
        if (guildConfig.antiRaid.enabled) {
            await antiRaid.checkThreshold(client, ban.guild, 'bans', guildConfig.antiRaid.thresholds.bans);
        }
    },
};
