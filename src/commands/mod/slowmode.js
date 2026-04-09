const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Modifie le mode lent.')
        .addIntegerOption(opt => opt.setName('secondes').setDescription('Secondes').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const sec = interaction.options.getInteger('secondes');
        await interaction.channel.setRateLimitPerUser(sec);
        await interaction.reply({ content: `⏱️ Mode lent défini sur ${sec}s.` });
    }
};