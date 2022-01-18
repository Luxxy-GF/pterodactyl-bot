const client = require("../index");

client.on("ready", async () => {
    console.log(`${client.user.tag} is up and ready to go!`)
    client.user.setActivity(`${client.config.panel.panelurl}`, { type: "WATCHING" })

    let usersCount = 0;
    for (const guild of client.guilds.cache) {
    usersCount += (await guild[1].members.fetch()).size
    }
    await console.log(`${client.user.tag} is now conneted to Discord Cached ${usersCount} Users`);
});