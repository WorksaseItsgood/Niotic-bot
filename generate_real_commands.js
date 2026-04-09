const fs = require('fs');
const path = require('path');

const modCodes = {
    'ban.js': `const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit un utilisateur.')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(opt => opt.setName('raison').setDescription('Raison').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const raison = interaction.options.getString('raison') || 'Aucune raison fournie.';
        try {
            await interaction.guild.members.ban(user, { reason: raison });
            await interaction.reply({ content: \`✅ **\${user.tag}** a été banni.\nRaison: \${raison}\` });
        } catch { await interaction.reply({ content: 'Je ne peux pas bannir cet utilisateur.', ephemeral: true }); }
    }
};`,
    'kick.js': `const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulse un utilisateur.')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur').setRequired(true))
        .addStringOption(opt => opt.setName('raison').setDescription('Raison').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const raison = interaction.options.getString('raison') || 'Aucune raison fournie.';
        if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true});
        try {
            await member.kick(raison);
            await interaction.reply({ content: \`✅ **\${member.user.tag}** a été expulsé.\` });
        } catch { await interaction.reply({ content: 'Je ne peux pas l\\'expulser.', ephemeral: true }); }
    }
};`,
    'clear.js': `const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime des messages.')
        .addIntegerOption(opt => opt.setName('montant').setDescription('Nombre de messages (1-100)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('montant');
        if (amount < 1 || amount > 100) return interaction.reply({ content: 'Entre 1 et 100.', ephemeral: true });
        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: \`✅ \${amount} messages supprimés.\`, ephemeral: true });
    }
};`,
    'timeout.js': `const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Exclut temporairement un utilisateur.')
        .addUserOption(opt => opt.setName('user').setDescription('Utilisateur').setRequired(true))
        .addIntegerOption(opt => opt.setName('minutes').setDescription('Durée en minutes').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('user');
        const minutes = interaction.options.getInteger('minutes');
        if (!member) return interaction.reply({ content: 'Membre introuvable.', ephemeral:true });
        try {
            await member.timeout(minutes * 60 * 1000, "Timeout par modérateur");
            await interaction.reply({ content: \`✅ **\${member.user.tag}** est timeout pour \${minutes} minutes.\` });
        } catch { await interaction.reply({ content: 'Impossible de le timeout.', ephemeral: true }); }
    }
};`,
    'lock.js': `const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Verrouille le salon.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
        await interaction.reply({ content: '🔒 Ce salon a été verrouillé.' });
    }
};`,
    'unlock.js': `const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Déverrouille le salon.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null });
        await interaction.reply({ content: '🔓 Ce salon a été déverrouillé.' });
    }
};`,
    'slowmode.js': `const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Modifie le mode lent.')
        .addIntegerOption(opt => opt.setName('secondes').setDescription('Secondes').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const sec = interaction.options.getInteger('secondes');
        await interaction.channel.setRateLimitPerUser(sec);
        await interaction.reply({ content: \`⏱️ Mode lent défini sur \${sec}s.\` });
    }
};`
};

const infoCodes = {
    'server-info.js': `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('server-info').setDescription('Infos du serveur'),
    async execute(interaction) {
        const guild = interaction.guild;
        const embed = new EmbedBuilder()
            .setTitle(\`ℹ️ \${guild.name}\`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'Membres', value: \`\${guild.memberCount}\`, inline: true },
                { name: 'Créé le', value: \`<t:\${Math.floor(guild.createdTimestamp / 1000)}:R>\`, inline: true },
                { name: 'Boosts', value: \`\${guild.premiumSubscriptionCount}\`, inline: true }
            );
        await interaction.reply({ embeds: [embed] });
    }
};`,
    'user-info.js': `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Infos de\\'un utilisateur')
        .addUserOption(opt => opt.setName('user').setDescription('User').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.options.getMember('user') || interaction.member;
        const embed = new EmbedBuilder()
            .setTitle(\`👤 \${user.tag}\`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'ID', value: user.id },
                { name: 'Rejoint serveur', value: member ? \`<t:\${Math.floor(member.joinedTimestamp / 1000)}:R>\` : 'Inconnu' },
                { name: 'Créé le', value: \`<t:\${Math.floor(user.createdTimestamp / 1000)}:R>\` }
            );
        await interaction.reply({ embeds: [embed] });
    }
};`,
    'logs.js': `const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');
module.exports = {
    data: new SlashCommandBuilder().setName('logs').setDescription('Affiche le statut des logs'),
    async execute(interaction) {
        const guildConfig = config.getGuildConfig(interaction.guild.id);
        await interaction.reply({ content: \`📂 Niveau des logs actuel: **\${guildConfig.logsLevel}**\nPour configurer, utilisez /logs-level\` });
    }
};`,
    'help.js': `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Liste des commandes'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🛠️ Commandes Niotic Bot')
            .setDescription('Voici les catégories de base :\\n\\n**🛡️ Config / Anti-Raid**\\n\`/raid\`, \`/logs-level\`, \`/whitelist-add\`...\\n\\n**🔨 Modération**\\n\`/ban\`, \`/kick\`, \`/clear\`, \`/timeout\`, \`/lock\`...\\n\\n**ℹ️ Informations**\\n\`/server-info\`, \`/user-info\`, \`/logs\`...')
            .setColor('Blue');
        await interaction.reply({ embeds: [embed] });
    }
};`
};

for (const [file, content] of Object.entries(modCodes)) {
    fs.writeFileSync(path.join(__dirname, 'src', 'commands', 'mod', file), content);
}
for (const [file, content] of Object.entries(infoCodes)) {
    fs.writeFileSync(path.join(__dirname, 'src', 'commands', 'info', file), content);
}

console.log("Core functional commands implemented.");
