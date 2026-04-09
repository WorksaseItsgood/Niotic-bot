const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit un utilisateur.')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(opt => opt.setName('raison').setDescription('Raison').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const raison = interaction.options.getString('raison') || 'Aucune raison fournie.';
        try {
            await interaction.guild.members.ban(user, { reason: raison });
            await interaction.reply({ content: `✅ **${user.tag}** a été banni.
Raison: ${raison}` });
        } catch { await interaction.reply({ content: 'Je ne peux pas bannir cet utilisateur.', ephemeral: true }); }
    }
};