const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Exclut temporairement un utilisateur.')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur').setRequired(true))
        .addIntegerOption(opt => opt.setName('minutes').setDescription('Durée en minutes').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const minutes = interaction.options.getInteger('minutes');
        if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral:true });
        try {
            await member.timeout(minutes * 60 * 1000, "Timeout par modérateur");
            await interaction.reply({ content: `✅ **${member.user.tag}** est timeout pour ${minutes} minutes.` });
        } catch { await interaction.reply({ content: 'Impossible de le timeout.', ephemeral: true }); }
    }
};