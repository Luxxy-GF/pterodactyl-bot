const { Message, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    category: "info", 
    aliases: ['p'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        var ping = Date.now() - message.createdTimestamp;
        const embed = new MessageEmbed()
        .setDescription(`Latency: **${ping}**ms \nAPI Latency: **${Math.round(client.ws.ping)}**ms`)
        .setColor(client.config.embedcolor)
        .setFooter(`${message.author.tag}`)
        .setTimestamp()
        message.reply({ embeds: [ embed ] });
    },
};