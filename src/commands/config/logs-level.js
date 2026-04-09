const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs-level')
        .setDescription('Configure le niveau des journaux (logs) du serveur.'),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: 'Vous n\\'avez pas la permission.', ephemeral: true });
        }

        const guildConfig = config.getGuildConfig(interaction.guild.id);
        const currentLevel = guildConfig.logsLevel;

        const embed = new EmbedBuilder()
            .setTitle('📝 Niveau des Logs')
            .setDescription(\`Sélectionnez le niveau de logs souhaité.\n**Niveau Actuel:** \${currentLevel.toUpperCase()}\`)
            .setColor('Blue')
            .addFields(
                { name: '🟢 Normal', value: 'mod-logs, user-logs, server-logs' },
                { name: '🟡 Moyen', value: 'normal + message-logs, channel-logs' },
                { name: '🔴 Extrême', value: 'moyen + role-logs, raid-logs' }
            );

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

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    },
};
