const Discord = require('discord.js');
const axios = require('axios');
const pretty = require('prettysize');
const { MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: 'info',
    description: 'Get information about your server',

    run: async (client, message, args) => {
        axios({
            method: 'get',
            url: `${client.config.panel.panelurl}/api/client/servers/${args[0]}`,
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': `Bearer ${client.config.panel.panelclientapikey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        }).then(response => {
            axios({
                method: 'get',
                url: `${client.config.panel.panelurl}/api/client/servers/${args[0]}/resources`,
                followRedirect: true,
                maxRedirects: 5,
                headers: {
                    'Authorization': `Bearer ${client.config.panel.panelclientapikey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                }
            }).then(resources => {
                const embed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
                .addField('🟢 Status', resources.data.attributes.current_state, true)
                .addField('💻 CPU Usage', resources.data.attributes.resources.cpu_absolute + '%', true)
                .addField('💻 RAM Usage', pretty(resources.data.attributes.resources.memory_bytes), true)
                .addField('💾 DISK Usage', pretty(resources.data.attributes.resources.disk_bytes), true)
                .addField('📶 NET Usage', 'UPLOADED: ' + pretty(resources.data.attributes.resources.network_tx_bytes) + ', DOWNLOADED: ' + pretty(resources.data.attributes.resources.network_rx_bytes))
                .addField('💻 NODE', response.data.attributes.node)
                .setFooter('Requested By: ' + message.member.displayName + ' (' + message.author.tag + ')')

                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('poweroff')
                    .setLabel('Power Off')
                    .setStyle('DANGER'),
                    new MessageButton()
                    .setCustomId('poweron')
                    .setLabel('Power On')
                    .setStyle('SUCCESS'),
                    new MessageButton()
                    .setCustomId('restart')
                    .setLabel('Restart')
                    .setStyle('SUCCESS')
                )
                message.channel.send({ embeds: [embed], ephemeral: true, components: [row] });
            })
        }).catch(error => {
            console.log(error);
        })
        const filter = i => i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });
        const disablepoweroff = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('poweroff')
            .setLabel('Power Off')
            .setStyle('DANGER')
            .setDisabled(),
            new MessageButton()
            .setCustomId('poweron')
            .setLabel('Power On')
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('restart')
            .setLabel('Restart')
            .setStyle('SUCCESS')
        )
        const disablepoweron = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('poweroff')
            .setLabel('Power Off')
            .setStyle('DANGER'),
            new MessageButton()
            .setCustomId('poweron')
            .setLabel('Power On')
            .setStyle('SUCCESS')
            .setDisabled(),
            new MessageButton()
            .setCustomId('restart')
            .setLabel('Restart')
            .setStyle('SUCCESS')
        )
        const disablerestart = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('poweroff')
            .setLabel('Power Off')
            .setStyle('DANGER'),
            new MessageButton()
            .setCustomId('poweron')
            .setLabel('Power On')
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('restart')
            .setLabel('Restart')
            .setStyle('SUCCESS')
            .setDisabled()
        )
        collector.on('collect', async i => {
            if (i.customId === 'poweroff') {
                await axios({
                    method: 'post',
                    url: `${client.config.panel.panelurl}/api/client/servers/${args[0]}/power`,
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': `Bearer ${client.config.panel.panelclientapikey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    },
                    data: {
                        "signal": "kill"
                    },
                }).then(response => {
                    i.update({ content: 'Server have Been Power Off', components: [disablepoweroff] });
                })
            }
            if (i.customId === 'poweron') {
                await axios({
                    method: 'post',
                    url: `${client.config.panel.panelurl}/api/client/servers/${args[0]}/power`,
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': `Bearer ${client.config.panel.panelclientapikey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    },
                    data: {
                        "signal": "start"
                    },
                }).then(response => {
                    i.update({ content: 'Server have Been Power On', components: [disablepoweron] });
                })
            }
            if (i.customId === 'restart') {
                await axios({
                    method: 'post',
                    url: `${client.config.panel.panelurl}/api/client/servers/${args[0]}/power`,
                    followRedirect: true,
                    maxRedirects: 5,
                    headers: {
                        'Authorization': `Bearer ${client.config.panel.panelclientapikey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                    },
                    data: {
                        "signal": "restart"
                    },
                }).then(response => {
                    i.update({ content: 'Server have Been Restarted', components: [disablerestart] });
                })
            }
        });


    }
}