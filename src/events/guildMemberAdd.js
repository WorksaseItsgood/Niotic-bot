const antiRaid = require('../utils/antiRaid');
const config = require('../config');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        // Anti-Raid bot handling
        await antiRaid.handleBotAdd(member);
    },
};
