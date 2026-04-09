const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Commande help de la catégorie info.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande help')
            .setDescription('La commande **help** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
