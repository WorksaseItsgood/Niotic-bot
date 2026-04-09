const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid')
        .setDescription("Ouvre le dashboard de configuration de l'Anti-Raid."),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: "Vous n'avez pas la permission.", ephemeral: true });
        }

        const guildConfig = config.getGuildConfig(interaction.guild.id);
        const { enabled, thresholds } = guildConfig.antiRaid;

        const embed = new EmbedBuilder()
            .setTitle('🛡️ Dashboard Anti-Raid')
            .setDescription('Configurez les paramètres de protection de votre serveur.')
            .setColor(enabled ? 'Green' : 'Red')
            .addFields(
                { name: 'Statut', value: enabled ? '✅ Activé' : '❌ Désactivé', inline: true },
                { name: 'Seuils Actuels', value: `Canaux: ${thresholds.channels}/10s\nBans: ${thresholds.bans}/10s\nKicks: ${thresholds.kicks}/10s\nSpam: ${thresholds.spam} msgs`, inline: false }
            );

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('raid_toggle')
                .setLabel(enabled ? 'Désactiver' : 'Activer')
                .setStyle(enabled ? ButtonStyle.Danger : ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('raid_thresholds')
                .setLabel('Modifier les Seuils')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('raid_whitelist')
                .setLabel('Gérer Whitelist')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [embed], components: [row1], ephemeral: true });
    },
};
