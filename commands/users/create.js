const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'create',
    description: 'Create a new user',

    run: async (client, message, args) => {

        let getPassword = () => {

            const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var password = "";
            while (password.length < 10) {
                password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
            }
            return password;
        };



        const data = {
            "username": `${message.author.username}`,
            "email": `changeme@here.com`,
            "first_name": `${message.author.id}`,
            "last_name": ".",
            "password": getPassword(),
            "root_admin": false,
            "language": "en"
        }

        axios({
            method: 'post',
            url: `${client.config.panel.panelurl}/api/application/users`,
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': `Bearer ${client.config.panel.panelapikey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: data,
        }).then(user => {
            // will create a database here
            message.channel.send(`User created!`);
            message.channel.send(`{username: ${message.author.username}, password: ${data.password}}`);
        }).catch(err => {
            message.channel.send(`Error: ${err}`);
        });
    }
}