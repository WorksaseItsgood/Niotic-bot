const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Infos de\'un utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('User').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.options.getMember('user') || interaction.member;
        const embed = new EmbedBuilder()
            .setTitle(`👤 ${user.tag}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'ID', value: user.id },
                { name: 'Rejoint serveur', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Inconnu' },
                { name: 'Créé le', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` }
            );
        await interaction.reply({ embeds: [embed] });
    }
};