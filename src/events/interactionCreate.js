const config = require('../config');
const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

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
                    await interaction.followUp({ content: "Une erreur est survenue lors de l'exécution.", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Une erreur est survenue.", ephemeral: true });
                }
            }
        } 
        else if (interaction.isButton()) {
            if (!interaction.member.permissions.has('Administrator')) {
                return interaction.reply({ content: "Vous n'avez pas la permission.", ephemeral: true });
            }

            const guildId = interaction.guild.id;
            
            // LOGS Configuration
            if (interaction.customId.startsWith('logs_')) {
                const action = interaction.customId.split('_')[1];
                
                if (action === 'generate') {
                    // logs_generate_channels
                    await interaction.reply({ content: "⏳ Génération des canaux en cours...", ephemeral: true });
                    try {
                        const guild = interaction.guild;
                        const category = await guild.channels.create({
                            name: '🔐 LOGS - NIOTIC',
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [
                                { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                                { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                            ]
                        });

                        const channelsToCreate = ["mod-logs", "user-logs", "server-logs", "message-logs", "channel-logs", "role-logs", "raid-logs"];
                        let description = "";

                        for (const ch of channelsToCreate) {
                            const newCh = await guild.channels.create({
                                name: ch,
                                type: ChannelType.GuildText,
                                parent: category.id
                            });
                            // Automatically setup in config
                            config.setLogChannel(guild.id, ch, newCh.id);
                            description += `✅ <#${newCh.id}> défini pour **${ch}**\n`;
                        }

                        const embed = new EmbedBuilder()
                            .setTitle('📂 Canaux de Logs générés!')
                            .setDescription(description)
                            .setColor('Green');
                            
                        await interaction.editReply({ content: "", embeds: [embed] });
                    } catch (e) {
                        console.error(e);
                        await interaction.editReply({ content: '❌ Erreur de génération des canaux (vérifiez mes permissions "Gérer les canaux").' });
                    }
                } else {
                    const level = action; // normal, moyen, extreme
                    config.updateConfig(guildId, 'logsLevel', level);
                    await interaction.reply({ content: `✅ Niveau de logs défini sur **${level}**.`, ephemeral: true });
                }
            }
            
            // ANTI-RAID Configuration
            else if (interaction.customId === 'raid_toggle') {
                const guildConfig = config.getGuildConfig(guildId);
                const isEnabled = guildConfig.antiRaid.enabled;
                config.updateAntiRaid(guildId, 'enabled', !isEnabled);
                await interaction.reply({ content: `🛡️ Anti-Raid ${!isEnabled ? "activé" : "désactivé"}. Note: L'anti-bot est lié à ce paramètre.`, ephemeral: true });
            }
            
            else if (interaction.customId === 'raid_thresholds') {
                await interaction.reply({ content: "L'édition des seuils via bouton sera gérée par une modale (en développement). Utilisez les commandes / pour le moment.", ephemeral: true });
            }
            
            else if (interaction.customId === 'raid_whitelist') {
                await interaction.reply({ content: "Gestion de la whitelist: Utilisez /whitelist-add, /whitelist-remove, /whitelist-list.", ephemeral: true });
            }

            else if (interaction.customId === 'raid_antibot') {
                // Not needed because already handled but user can test global anti-raid toggle
            }
        }
    },
};
