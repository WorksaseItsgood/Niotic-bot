const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs-level')
        .setDescription('Configure le niveau des journaux (logs) du serveur.'),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: "Vous n'avez pas la permission.", ephemeral: true });
        }

        const guildConfig = config.getGuildConfig(interaction.guild.id);
        const currentLevel = guildConfig.logsLevel;

        const embed = new EmbedBuilder()
            .setTitle('📝 Configuration des Logs')
            .setDescription(\`Définissez le niveau d'évènements à journaliser.\n\n**Niveau Actuel:** ✨ \${currentLevel.toUpperCase()}\`)
            .setColor('#3498db')
            .addFields(
                { name: '🟢 Normal', value: '- Modération\\n- Utilisateurs (Rejoins/Quitte)\\n- Serveur (Roles/Salons créés)' },
                { name: '🟡 Moyen', value: '- *Comprend "Normal"*\\n- Messages (Supprimés/Modifiés)\\n- Update Salons' },
                { name: '🔴 Extrême', value: '- *Comprend "Moyen"*\\n- Update Rôles profonds\\n- Alertes Anti-Raid' }
            )
            .setFooter({ text: 'Cliquez sur "Générer Canaux" pour créer les salons texte automatiquement.' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('logs_normal')
                .setLabel('Normal')
                .setStyle(currentLevel === 'normal' ? ButtonStyle.Success : ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('logs_moyen')
                .setLabel('Moyen')
                .setStyle(currentLevel === 'moyen' ? ButtonStyle.Primary : ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('logs_extreme')
                .setLabel('Extrême')
                .setStyle(currentLevel === 'extreme' ? ButtonStyle.Danger : ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('logs_generate_channels')
                .setLabel('📂 Générer les Canaux de Logs automatiquement')
                .setStyle(ButtonStyle.Success)
        );

        await interaction.reply({ embeds: [embed], components: [row, row2], ephemeral: true });
    },
};
