const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Commande suggest de la catégorie utility.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande suggest')
            .setDescription('La commande **suggest** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
