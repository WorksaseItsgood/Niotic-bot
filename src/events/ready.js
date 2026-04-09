const { REST, Routes } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`[BOT READY] Logged in as ${client.user.tag}`);
        client.user.setActivity('Protection Système | /help');
        
        if (process.env.DISCORD_TOKEN) {
            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
            try {
                console.log(`Started refreshing ${client.commandArray.length} application (/) commands.`);
                const data = await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: client.commandArray },
                );
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        }
    },
};
