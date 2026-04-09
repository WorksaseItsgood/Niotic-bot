const config = require('../config');
const { EmbedBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit()) return;
        
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
                await interaction.reply({ content: `🛡️ Anti-Raid ${!isEnabled ? "activé" : "désactivé"}.`, ephemeral: true });
            }
            
            else if (interaction.customId === 'raid_thresholds') {
                const guildConfig = config.getGuildConfig(guildId);
                const { channels, bans, kicks, spam } = guildConfig.antiRaid.thresholds;

                const modal = new ModalBuilder()
                    .setCustomId('modal_raid_thresholds')
                    .setTitle('Régler les Seuils (en 10s)');

                const inputChannels = new TextInputBuilder().setCustomId('th_channels').setLabel("Canaux créés").setStyle(TextInputStyle.Short).setValue(channels.toString());
                const inputBans = new TextInputBuilder().setCustomId('th_bans').setLabel("Bannissements").setStyle(TextInputStyle.Short).setValue(bans.toString());
                const inputKicks = new TextInputBuilder().setCustomId('th_kicks').setLabel("Expulsions").setStyle(TextInputStyle.Short).setValue(kicks.toString());
                const inputSpam = new TextInputBuilder().setCustomId('th_spam').setLabel("Spam messages").setStyle(TextInputStyle.Short).setValue(spam.toString());

                modal.addComponents(
                    new ActionRowBuilder().addComponents(inputChannels),
                    new ActionRowBuilder().addComponents(inputBans),
                    new ActionRowBuilder().addComponents(inputKicks),
                    new ActionRowBuilder().addComponents(inputSpam)
                );

                await interaction.showModal(modal);
            }
            
            else if (interaction.customId === 'raid_whitelist') {
                await interaction.reply({ content: "Gestion de la whitelist: Utilisez /whitelist-add, /whitelist-remove, /whitelist-list.", ephemeral: true });
            }

            else if (interaction.customId === 'raid_antibot') {
                const guildConfig = config.getGuildConfig(guildId);
                const current = guildConfig.antiRaid.antiBot !== undefined ? guildConfig.antiRaid.antiBot : true;
                config.updateAntiRaid(guildId, 'antiBot', !current);
                await interaction.reply({ content: `🤖 Anti-Bot ${!current ? "activé" : "désactivé"}.`, ephemeral: true });
            }
        }
        else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'modal_raid_thresholds') {
                const channels = parseInt(interaction.fields.getTextInputValue('th_channels'));
                const bans = parseInt(interaction.fields.getTextInputValue('th_bans'));
                const kicks = parseInt(interaction.fields.getTextInputValue('th_kicks'));
                const spam = parseInt(interaction.fields.getTextInputValue('th_spam'));
                
                if (isNaN(channels) || isNaN(bans) || isNaN(kicks) || isNaN(spam)) {
                    return interaction.reply({ content: "Veuillez entrer uniquement des nombres.", ephemeral: true });
                }

                const guildId = interaction.guild.id;
                const guildConfig = config.getGuildConfig(guildId);
                guildConfig.antiRaid.thresholds = { channels, bans, kicks, spam };
                config._saveDB(); // Or updateAntiRaid('thresholds', { ... })

                await interaction.reply({ content: "✅ Les seuils Anti-Raid ont été mis à jour.", ephemeral: true });
            }
        }
    },
};
