const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Commande warnings de la catégorie info.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande warnings')
            .setDescription('La commande **warnings** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
