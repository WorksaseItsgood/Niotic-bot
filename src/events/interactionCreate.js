const config = require('../config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isStringSelectMenu()) return;
        
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: "Une erreur est survenue lors de l'exécution de cette commande!", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Une erreur est survenue lors de l'exécution de cette commande!", ephemeral: true });
                }
            }
        } else if (interaction.isButton()) {
            if (!interaction.member.permissions.has('Administrator')) {
                return interaction.reply({ content: "Vous n'avez pas la permission.", ephemeral: true });
            }

            const guildId = interaction.guild.id;
            
            if (interaction.customId.startsWith('logs_')) {
                const level = interaction.customId.split('_')[1];
                config.updateConfig(guildId, 'logsLevel', level);
                await interaction.reply({ content: `✅ Niveau de logs défini sur **${level}**.`, ephemeral: true });
            }
            
            else if (interaction.customId === 'raid_toggle') {
                const guildConfig = config.getGuildConfig(guildId);
                const isEnabled = guildConfig.antiRaid.enabled;
                config.updateAntiRaid(guildId, 'enabled', !isEnabled);
                await interaction.reply({ content: `🛡️ Anti-Raid ${!isEnabled ? "activé" : "désactivé"}.`, ephemeral: true });
            }
            
            else if (interaction.customId === 'raid_thresholds') {
                await interaction.reply({ content: "L'édition des seuils via bouton sera gérée par une modale (en développement). Utilisez les commandes / pour le moment.", ephemeral: true });
            }
            
            else if (interaction.customId === 'raid_whitelist') {
                await interaction.reply({ content: "Gestion de la whitelist: Utilisez /whitelist-add, /whitelist-remove, /whitelist-list.", ephemeral: true });
            }
        }
    },
};
