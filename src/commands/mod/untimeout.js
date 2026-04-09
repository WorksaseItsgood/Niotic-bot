const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Commande untimeout de la catégorie mod.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande untimeout')
            .setDescription('La commande **untimeout** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
