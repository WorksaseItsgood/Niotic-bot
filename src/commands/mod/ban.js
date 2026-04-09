const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Commande ban de la catégorie mod.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande ban')
            .setDescription('La commande **ban** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
