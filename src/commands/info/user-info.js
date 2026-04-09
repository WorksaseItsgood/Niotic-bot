const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Commande user-info de la catégorie info.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande user-info')
            .setDescription('La commande **user-info** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
