const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Commande status de la catégorie config.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande status')
            .setDescription('La commande **status** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
