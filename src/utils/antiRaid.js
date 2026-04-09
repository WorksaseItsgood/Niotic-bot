const config = require('../config');
const logger = require('./logger');
const { EmbedBuilder } = require('discord.js');

class AntiRaid {
    constructor() {
        this.cache = new Map();
    }

    getGuildCache(guildId) {
        if (!this.cache.has(guildId)) {
            this.cache.set(guildId, {
                bans: { count: 0, timer: null },
                kicks: { count: 0, timer: null },
                channels: { count: 0, timer: null },
                messages: new Map()
            });
        }
        return this.cache.get(guildId);
    }

    async handleBotAdd(member) {
        const guildConfig = config.getGuildConfig(member.guild.id);
        
        // Always enforce Anti-bot if anti-raid globally enabled
        if (!guildConfig.antiRaid.enabled) return;

        if (member.user.bot) {
            // Anti-bot check
            // On vérifie qui a ajouté le bot. Si c'est quelqu'un qui n'est pas dans la whitelist on kick/ban.
            try {
                // Expulse instantanément le bot
                await member.guild.members.kick(member.id, "Anti-Raid: Bot non autorisé (Anti-bot)");
                
                // Fetch audit logs to see who brought the bot in
                const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 28 }); // 28 is BOT_ADD
                const entry = auditLogs.entries.first();
                let addedByText = "inconnu";
                
                if (entry) {
                    const executor = entry.executor;
                    addedByText = executor.tag;
                    
                    if (!guildConfig.whitelist.includes(executor.id)) {
                        // Kick the executor for inviting a bot
                        const execMember = await member.guild.members.fetch(executor.id).catch(() => null);
                        if (execMember && execMember.kickable) {
                            await execMember.kick("Anti-Raid: A ajouté un bot non autorisé.");
                        }
                    }
                }
                
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🛡️ Anti-Raid: Protection Anti-Bot')
                    .setDescription(`Un bot **non autorisé** a tenté de rejoindre le serveur et a été kick immédiatement.`)
                    .addFields(
                        { name: "Bot", value: `${member.user.tag}` },
                        { name: "Ajouté par", value: `${addedByText}` }
                    )
                    .setTimestamp();
                    
                await logger.log(member.client, member.guild.id, 'raid-logs', embed);
            } catch (e) {
                console.error(`Failed to execute anti-bot check for ${member.user.tag}`, e);
            }
        }
    }

    async checkThreshold(client, guild, type, limit) {
        const cache = this.getGuildCache(guild.id);
        cache[type].count++;

        if (!cache[type].timer) {
            cache[type].timer = setTimeout(() => {
                cache[type].count = 0;
                cache[type].timer = null;
            }, 10000);
        }

        if (cache[type].count >= limit) {
            const embed = new EmbedBuilder()
                .setColor('DarkRed')
                .setTitle(`🚨 ALERTE RAID: ${type.toUpperCase()}`)
                .setDescription(`Le seuil de **${limit} ${type}** en 10 secondes a été atteint.\n**Action:** Suppression des droits de l'attaquant en cours...`);

            await logger.log(client, guild.id, 'raid-logs', embed);
            
            try {
                const auditType = type === 'channels' ? 10 : (type === 'bans' ? 22 : 20);
                const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: auditType });
                const entry = auditLogs.entries.first();
                if (entry) {
                    const executor = entry.executor;
                    const guildConfig = config.getGuildConfig(guild.id);
                    if (!guildConfig.whitelist.includes(executor.id)) {
                        const execMember = await guild.members.fetch(executor.id).catch(() => null);
                        if (execMember && execMember.manageable) {
                            // Demote executor completely to isolate
                            await execMember.roles.set([], "Anti-Raid: Actions abusives massives détectées");
                            
                            const demoteEmbed = new EmbedBuilder()
                                .setColor('Orange')
                                .setTitle("⚔️ Action Anti-Raid")
                                .setDescription(`Isolé **${executor.tag}** (Rôles retirés).`);
                            await logger.log(client, guild.id, 'raid-logs', demoteEmbed);
                        }
                    }
                }
            } catch (e) {
                console.error("Could not fetch audit logs or derank:", e);
            }
        }
    }
}

module.exports = new AntiRaid();
