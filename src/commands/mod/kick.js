const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulse un utilisateur.')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(opt => opt.setName('raison').setDescription('Raison').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const raison = interaction.options.getString('raison') || 'Aucune raison fournie.';
        if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true});
        try {
            await member.kick(raison);
            await interaction.reply({ content: `✅ **${member.user.tag}** a été expulsé.` });
        } catch { await interaction.reply({ content: 'Je ne peux pas l\'expulser.', ephemeral: true }); }
    }
};