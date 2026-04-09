const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime des messages.')
        .addIntegerOption(opt => opt.setName('montant').setDescription('Nombre de messages (1-100)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('montant');
        if (amount < 1 || amount > 100) return interaction.reply({ content: 'Entre 1 et 100.', ephemeral: true });
        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `✅ ${amount} messages supprimés.`, ephemeral: true });
    }
};