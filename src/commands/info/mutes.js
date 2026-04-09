const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mutes')
        .setDescription('Commande mutes de la catégorie info.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande mutes')
            .setDescription('La commande **mutes** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
