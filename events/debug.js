const client = require('../index');

client.on("debug", (info) => {
    console.log(info);
});