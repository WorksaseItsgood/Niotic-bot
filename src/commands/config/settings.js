const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Commande settings de la catégorie config.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande settings')
            .setDescription('La commande **settings** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
