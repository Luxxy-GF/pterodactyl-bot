const Discord = require("discord.js");
const axios = require("axios");


module.exports = {
    name: "list",
    description: "List all servers in the panel",

    run: async (client, message, args) => {
        let userid = 1;
        var arr = [];

        axios({
            method: 'get',
            url: `${client.config.panel.panelurl}/api/application/users/${userid}?include=servers`,
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': `Bearer ${client.config.panel.panelapikey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            const preoutput = response.data.attributes.relationships.servers.data
            arr.push(...preoutput)
            var clean = arr.map(e => "Server Name: `" + e.attributes.name + "`, Server ID: `" + e.attributes.identifier + "`\n");
            const embed = new Discord.MessageEmbed()
                        .addField('__**Your Servers:**__', clean)
            message.channel.send({ embeds: [embed] }).catch(e => {
                const embed = new Discord.MessageEmbed()
                    .addField('ERROR', 'Your server list is too long so here is a abstracted version!')
                    .addField('__**Your Servers:**__', arr.map(e => "`" + e.attributes.identifier + "`"))
                 message.channel.send({ embeds: [embed] });
            });
        }).catch(err => {
            message.channel.send(`Error: ${err}`);
        })
    }
}