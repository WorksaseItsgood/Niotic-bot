const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist-list')
        .setDescription('Commande whitelist-list de la catégorie config.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande whitelist-list')
            .setDescription('La commande **whitelist-list** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
