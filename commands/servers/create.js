const Discord = require('discord.js');
const axios = require('axios');
const moment = require('moment');
const gaming = [1]
module.exports = {
    name: 'createserver',
    description: 'Create a new server',
    
    run: async (client, message, args) => {
        message.channel.send("creating minecraft servers");

        const data = ({
            "name": `${args[0]}`,
            "user": '1',
            "nest": 1,
            "egg": 3,
            "docker_image": "quay.io/pterodactyl/core:java-11",
            "startup": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -Dterminal.jline=false -Dterminal.ansi=true -jar {{SERVER_JARFILE}}",
            "limits": {
                "memory": 2048,
                "swap": 0,
                "disk": 10240,
                "io": 500,
                "cpu": 0
            },
            "environment": {
                "MINECRAFT_VERSION": "latest",
                "SERVER_JARFILE": "server.jar",
                "DL_PATH": "https://papermc.io/api/v2/projects/paper/versions/1.16.5/builds/503/downloads/paper-1.16.5-503.jar",
                "BUILD_NUMBER": "latest"
            },
            "feature_limits": {
                "databases": 2,
                "allocations": 1,
                "backups": 10
            },
            "deploy": {
                "locations": gaming,
                "dedicated_ip": false,
                "port_range": []
            },
            "start_on_completion": false,
            "oom_disabled": false
        })

        axios({
            url: `${client.config.panel.panelurl}/api/application/servers`,
            method: 'post',
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': `Bearer ${client.config.panel.panelapikey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: data,
        }).then(response => {
            const embed = new Discord.MessageEmbed()
            .setTitle("Server Created")
            .setDescription(`Server created!`)
            .setColor("#00ff00")
            .addField("Server Name", `${args[0]}`, true)
            .addField("Server ID", `${response.data.attributes.id}`, true)
            .addField('Server UUID', `${response.data.attributes.uuid}`, true)
            .addField('Server Identifier', `${response.data.attributes.identifier}`, true)
            .addField('Server Status', `${response.data.attributes.status}`, true)
            .addField('Server Link', `${client.config.panel.panelurl}/server/${response.data.attributes.identifier}`, true)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL({ dynamic: true, format: 'png', size: 1024 }));
            message.channel.send({ embeds: [embed] });
            console.log(response.data);
        })
    }
}