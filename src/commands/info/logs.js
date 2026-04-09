const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
    data: new SlashCommandBuilder().setName('logs').setDescription('Affiche le statut des logs'),
    async execute(interaction) {
        const guildConfig = config.getGuildConfig(interaction.guild.id);
        await interaction.reply({ content: `📂 Niveau des logs actuel: **${guildConfig.logsLevel}**
Pour configurer, utilisez /logs-level` });
    }
};