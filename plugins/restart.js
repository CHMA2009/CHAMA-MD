const { cmd, commands } = require("../command");
const { sleep } = require("../lib/functions");

cmd({
    pattern: "restart",
    alias: ["re"],
    desc: "Restart the bot ",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {
        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("Only the bot owner can use this command.");
        }

        const { exec } = require("child_process");

        // Initial reply before restarting
        const initialMessage = await reply("🔄 *Restarting the chama-md bot...* _Please wait..._");
        
        // Sleep for a short delay before restarting the bot
        await sleep(1500);

        // Restart the bot with pm2
        exec("pm2 restart all", (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                return initialMessage.edit(`❌ *Error restarting the bot:* ${error.message}`);
            }
            if (stderr) {
                console.error(stderr);
                return initialMessage.edit(`❌ *Error during restart:* ${stderr}`);
            }

            // Edit the message to indicate that the restart was successful
            initialMessage.edit("✅ *CHAMA-MD Bot restarted successfully!* 🎉");
        });

    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});
