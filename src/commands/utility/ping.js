const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Commande ping de la catégorie utility.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande ping')
            .setDescription('La commande **ping** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
