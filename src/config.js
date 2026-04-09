const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');

// Initialize DB if not exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}), 'utf-8');
}

class ConfigManager {
    constructor() {
        this.cache = this._readDB();
    }

    _readDB() {
        try {
            return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        } catch {
            return {};
        }
    }

    _saveDB() {
        fs.writeFileSync(dbPath, JSON.stringify(this.cache, null, 2), 'utf-8');
    }

    /**
     * Get config for a specific guild
     */
    getGuildConfig(guildId) {
        if (!this.cache[guildId]) {
            this.cache[guildId] = {
                prefix: "!",
                logsLevel: "normal", // normal, moyen, extreme
                antiRaid: {
                    enabled: false,
                    thresholds: {
                        channels: 5,
                        bans: 3,
                        kicks: 3,
                        spam: 10
                    }
                },
                whitelist: [],
                logChannels: {
                    "mod-logs": null,
                    "user-logs": null,
                    "server-logs": null,
                    "message-logs": null,
                    "channel-logs": null,
                    "role-logs": null,
                    "raid-logs": null
                }
            };
            this._saveDB();
        }
        return this.cache[guildId];
    }

    setLogChannel(guildId, type, channelId) {
        const config = this.getGuildConfig(guildId);
        if (config.logChannels[type] !== undefined) {
            config.logChannels[type] = channelId;
            this._saveDB();
            return true;
        }
        return false;
    }

    updateConfig(guildId, key, value) {
        const config = this.getGuildConfig(guildId);
        config[key] = value;
        this._saveDB();
    }

    updateAntiRaid(guildId, key, value) {
        const config = this.getGuildConfig(guildId);
        config.antiRaid[key] = value;
        this._saveDB();
    }

    addWhitelist(guildId, userId) {
        const config = this.getGuildConfig(guildId);
        if (!config.whitelist.includes(userId)) {
            config.whitelist.push(userId);
            this._saveDB();
        }
    }

    removeWhitelist(guildId, userId) {
        const config = this.getGuildConfig(guildId);
        config.whitelist = config.whitelist.filter(id => id !== userId);
        this._saveDB();
    }
}

module.exports = new ConfigManager();
