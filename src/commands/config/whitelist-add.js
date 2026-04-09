const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist-add')
        .setDescription("Ajoute un utilisateur à la whitelist Anti-Raid.")
        .addUserOption(option => 
            option.setName('utilisateur')
                .setDescription("L'utilisateur à ajouter à la whitelist.")
                .setRequired(true)),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has('Administrator') && interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply({ content: "Vous n'avez pas la permission.", ephemeral: true });
        }

        const user = interaction.options.getUser('utilisateur');
        config.addWhitelist(interaction.guild.id, user.id);

        const embed = new EmbedBuilder()
            .setTitle('🛡️ Whitelist Mise à Jour')
            .setDescription(`✅ L'utilisateur **${user.tag}** (${user.id}) a été ajouté à la whitelist.`)
            .setColor('Green');

        await interaction.reply({ embeds: [embed] });
    },
};
