const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Commande unmute de la catégorie mod.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande unmute')
            .setDescription('La commande **unmute** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
