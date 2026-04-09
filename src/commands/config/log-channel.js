const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-channel')
        .setDescription('Définit un canal pour les logs.')
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Le type de logs à définir.')
                .setRequired(true)
                .addChoices(
                    { name: 'Modération Logs', value: 'mod-logs' },
                    { name: 'Utilisateur Logs', value: 'user-logs' },
                    { name: 'Serveur Logs', value: 'server-logs' },
                    { name: 'Messages Logs', value: 'message-logs' },
                    { name: 'Canaux Logs', value: 'channel-logs' },
                    { name: 'Rôles Logs', value: 'role-logs' },
                    { name: 'Raid Logs', value: 'raid-logs' }
                ))
        .addChannelOption(option => 
            option.setName('canal')
                .setDescription('Le canal où envoyer ces logs.')
                .setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: "Vous n'avez pas la permission.", ephemeral: true });
        }

        const type = interaction.options.getString('type');
        const channel = interaction.options.getChannel('canal');

        const success = config.setLogChannel(interaction.guild.id, type, channel.id);

        const embed = new EmbedBuilder()
            .setTitle('📝 Configuration des Logs')
            .setColor(success ? 'Green' : 'Red');

        if (success) {
            embed.setDescription(`✅ Le canal de logs **${type}** a été défini sur <#${channel.id}>.`);
        } else {
            embed.setDescription(`❌ Type de logs invalide (Erreur Configuration).`);
        }

        await interaction.reply({ embeds: [embed] });
    },
};
