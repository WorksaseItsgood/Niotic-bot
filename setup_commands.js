const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, 'src', 'commands');

const commandsStructure = {
    'mod': ['ban', 'kick', 'mute', 'unmute', 'warn', 'unwarn', 'timeout', 'untimeout', 'clear', 'lock', 'unlock', 'slowmode', 'freeze', 'unfreeze', 'nick'],
    'config': ['raid', 'logs-level', 'whitelist-add', 'whitelist-remove', 'whitelist-list', 'alert-channel', 'log-channel', 'derank-delay', 'prefix', 'settings', 'reset-config', 'status'],
    'info': ['user-info', 'server-info', 'bot-stats', 'logs', 'warnings', 'bans', 'mutes', 'modqueue', 'help', 'about'],
    'utility': ['ping', 'uptime', 'report', 'suggest', 'invite', 'avatar', 'server-icon', 'role-info', 'channel-info', 'member-count', 'created-at', 'joined-at', 'test']
};

if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath, { recursive: true });
}

for (const [category, commands] of Object.entries(commandsStructure)) {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true });
    }

    for (const cmd of commands) {
        const filePath = path.join(categoryPath, `${cmd}.js`);
        if (!fs.existsSync(filePath)) {
            const template = `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('${cmd}')
        .setDescription('Commande ${cmd} de la catégorie ${category}.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commande ${cmd}')
            .setDescription('La commande **${cmd}** a été exécutée avec succès.')
            .setColor('Blue');

        await interaction.reply({ embeds: [embed] });
    },
};
`;
            fs.writeFileSync(filePath, template, 'utf-8');
            console.log(`Created ${filePath}`);
        }
    }
}

console.log("All commands scaffolded successfully!");
