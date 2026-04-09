const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
        const { enabled, thresholds, antiBot } = guildConfig.antiRaid;
        const antibotEnabled = antiBot !== undefined ? antiBot : true;

        const embed = new EmbedBuilder()
            .setTitle('🛡️ Dashboard Avancé Anti-Raid')
            .setDescription('**Protégez votre serveur contre les attaques de bot et le spam.**\nUtilisez les boutons ci-dessous pour configurer les systèmes.')
            .setColor(enabled ? '#00FF00' : '#FF0000') // Plus joli Hex
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '╭・Statut Global', value: \`╰ \${enabled ? '🟢 **Actif**' : '🔴 **Inactif**'}\`, inline: true },
                { name: '╭・Anti-Bot', value: \`╰ \${antibotEnabled ? '🟢 **Actif**' : '🔴 **Inactif**'}\`, inline: true },
                { name: '\\u200B', value: '\\u200B', inline: false }, // Spacer
                { name: '📊 Seuils de Tolérance (10s)', value: \`
> 📝 **Canaux créés :** \${thresholds.channels} max
> ⛔ **Bans :** \${thresholds.bans} max
> 👢 **Kicks :** \${thresholds.kicks} max
> 📩 **Spam :** \${thresholds.spam} msgs\`, inline: false }
            )
            .setFooter({ text: 'Niotic Bot - Module de Sécurité', iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('raid_toggle')
                .setLabel(enabled ? '🛡️ Désactiver Anti-Raid' : '🛡️ Activer Anti-Raid')
                .setStyle(enabled ? ButtonStyle.Danger : ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('raid_thresholds')
                .setLabel('⚙️ Régler les Seuils')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('raid_whitelist')
                .setLabel('👥 Whitelist')
                .setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('raid_antibot')
                .setLabel(antibotEnabled ? '🤖 Désactiver Anti-Bot' : '🤖 Activer Anti-Bot')
                .setStyle(antibotEnabled ? ButtonStyle.Danger : ButtonStyle.Success)
        );

        await interaction.reply({ embeds: [embed], components: [row1, row2], ephemeral: true });
    },
};
