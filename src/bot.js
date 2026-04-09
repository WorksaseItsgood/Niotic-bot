const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ],
});

client.commands = new Collection();
client.commandArray = [];

// Load system modules
const config = require('./config');

const loadCommands = async () => {
    const foldersPath = path.join(__dirname, 'commands');
    if (!fs.existsSync(foldersPath)) {
        console.log("No commands folder found");
        return;
    }
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        if(!fs.lstatSync(commandsPath).isDirectory()) continue;
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
};

const loadEvents = async () => {
    const eventsPath = path.join(__dirname, 'events');
    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath, { recursive: true });
        // Create default interactionCreate event
        const interactionEvent = `
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
                    await interaction.followUp({ content: 'Une erreur est survenue lors de l\\'exécution de cette commande!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Une erreur est survenue lors de l\\'exécution de cette commande!', ephemeral: true });
                }
            }
        }
    },
};`;
        const readyEvent = `
const { REST, Routes } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(\`Ready! Logged in as \${client.user.tag}\`);
        
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        try {
            console.log(\`Started refreshing \${client.commandArray.length} application (/) commands.\`);
            const data = await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: client.commandArray },
            );
            console.log(\`Successfully reloaded \${data.length} application (/) commands.\`);
        } catch (error) {
            console.error(error);
        }
    },
};`;
        fs.writeFileSync(path.join(eventsPath, 'interactionCreate.js'), interactionEvent);
        fs.writeFileSync(path.join(eventsPath, 'ready.js'), readyEvent);
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
};

client.configDB = config;

(async () => {
    await loadCommands();
    await loadEvents();
    client.login(process.env.DISCORD_TOKEN);
})();
