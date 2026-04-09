const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Commande report de la catégorie utility.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande report')
            .setDescription('La commande **report** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
