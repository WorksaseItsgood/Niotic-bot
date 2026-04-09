const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Commande uptime de la catégorie utility.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande uptime')
            .setDescription('La commande **uptime** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
