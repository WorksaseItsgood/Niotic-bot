const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('server-info').setDescription('Infos du serveur'),
    async execute(interaction) {
        const guild = interaction.guild;
        const embed = new EmbedBuilder()
            .setTitle(`ℹ️ ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'Membres', value: `${guild.memberCount}`, inline: true },
                { name: 'Créé le', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true }
            );
        await interaction.reply({ embeds: [embed] });
    }
};