const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Commande mute de la catégorie mod.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande mute')
            .setDescription('La commande **mute** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
