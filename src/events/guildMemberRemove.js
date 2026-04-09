const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        const embed = new EmbedBuilder()
            .setTitle('👋 Membre Quitté')
            .setColor('Red')
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(\`**\${member.user.tag}** a quitté le serveur.\`)
            .addFields(
                { name: 'ID', value: member.id, inline: true }
            )
            .setTimestamp();

        await logger.log(client, member.guild.id, 'user-logs', embed);
    },
};
