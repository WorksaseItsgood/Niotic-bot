const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Commande logs de la catégorie info.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande logs')
            .setDescription('La commande **logs** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
