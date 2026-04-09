const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Commande test de la catégorie utility.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande test')
            .setDescription('La commande **test** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
