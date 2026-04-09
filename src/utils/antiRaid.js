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
        if (!guildConfig.antiRaid.enabled) return;

        if (member.user.bot) {
            if (!guildConfig.whitelist.includes(member.id)) {
                try {
                    await member.kick("Anti-Raid: Bot non whitelisté ajouté");
                    
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('🛡️ Anti-Raid: Bot Expulsé')
                        .setDescription(`Un bot non whitelisté (${member.user.tag}) a été automatiquement expulsé.`);
                        
                    await logger.log(member.client, member.guild.id, 'raid-logs', embed);
                } catch (e) {
                    console.error(`Failed to kick bot ${member.user.tag}`, e);
                }
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
                .setColor('Red')
                .setTitle(`🚨 ALERTE RAID: ${type.toUpperCase()}`)
                .setDescription(`Le seuil de ${limit} ${type} en 10 secondes a été atteint!\nVeuillez vérifier le serveur.`);

            await logger.log(client, guild.id, 'raid-logs', embed);
            
            try {
                const auditLogs = await guild.fetchAuditLogs({ limit: 1 });
                const entry = auditLogs.entries.first();
                if (entry) {
                    const executor = entry.executor;
                    const guildConfig = config.getGuildConfig(guild.id);
                    if (!guildConfig.whitelist.includes(executor.id)) {
                        const execMember = await guild.members.fetch(executor.id).catch(() => null);
                        if (execMember && execMember.roles.highest.position < guild.members.me.roles.highest.position) {
                            await execMember.roles.set([], "Anti-Raid: Actions abusives");
                            embed.addFields({ name: 'Action Prise', value: `Dé-rank automatique de ${executor.tag}` });
                            await logger.log(client, guild.id, 'raid-logs', embed);
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
