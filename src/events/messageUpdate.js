const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (!oldMessage.guild || oldMessage.author?.bot) return;
        if (oldMessage.content === newMessage.content) return; // Ignore embeds loading

        const embed = new EmbedBuilder()
            .setTitle('✏️ Message Modifié')
            .setColor('Orange')
            .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL() })
            .addFields(
                { name: 'Auteur', value: \`<@\${oldMessage.author.id}>\`, inline: true },
                { name: 'Canal', value: \`<#\${oldMessage.channel.id}>\`, inline: true },
                { name: 'Avant', value: oldMessage.content || '*Vide*', inline: false },
                { name: 'Après', value: newMessage.content || '*Vide*', inline: false }
            )
            .setTimestamp();

        await logger.log(client, oldMessage.guild.id, 'message-logs', embed);
    },
};
