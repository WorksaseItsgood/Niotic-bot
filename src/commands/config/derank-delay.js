const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('derank-delay')
        .setDescription('Commande derank-delay de la catégorie config.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande derank-delay')
            .setDescription('La commande **derank-delay** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
