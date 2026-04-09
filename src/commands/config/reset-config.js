const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-config')
        .setDescription('Commande reset-config de la catégorie config.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande reset-config')
            .setDescription('La commande **reset-config** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
