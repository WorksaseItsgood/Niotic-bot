const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Liste des commandes'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🛠️ Commandes Niotic Bot')
            .setDescription('Voici les catégories de base :\n\n**🛡️ Config / Anti-Raid**\n`/raid`, `/logs-level`, `/whitelist-add`...\n\n**🔨 Modération**\n`/ban`, `/kick`, `/clear`, `/timeout`, `/lock`...\n\n**ℹ️ Informations**\n`/server-info`, `/user-info`, `/logs`...')
            .setColor('Blue');
        await interaction.reply({ embeds: [embed] });
    }
};