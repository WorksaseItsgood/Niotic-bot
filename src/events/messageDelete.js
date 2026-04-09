const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        if (!message.guild || message.author?.bot) return;

        const embed = new EmbedBuilder()
            .setTitle('🗑️ Message Supprimé')
            .setColor('Red')
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .addFields(
                { name: 'Auteur', value: \`<@\${message.author.id}>\`, inline: true },
                { name: 'Canal', value: \`<#\${message.channel.id}>\`, inline: true },
                { name: 'Contenu', value: message.content || '*(Message sans texte, potentiellement un embed ou une image)*', inline: false }
            )
            .setTimestamp();

        await logger.log(client, message.guild.id, 'message-logs', embed);
    },
};
