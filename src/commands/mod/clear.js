const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Commande clear de la catégorie mod.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande clear')
            .setDescription('La commande **clear** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
