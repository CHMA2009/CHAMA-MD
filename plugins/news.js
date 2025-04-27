const axios = require('axios');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "hirucheck",
    alias: ["hirunews","news","hirulk"],
    react: "📖",
    category: "search hiru news",
    desc: "Fetch the latest news from the SUHAS API in Hiru API.",
    use: "",
    filename: __filename,
},
    async (conn, mek, m, {
        from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber,
        botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName,
        participants, groupAdmins, isBotAdmins, isAdmins, reply
    }) => {
        try {
            const apiUrl = `https://suhas-bro-apii.vercel.app/hiru`;
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data || !data.newsURL || !data.title || !data.image || !data.text) {
                return reply(`*No News Available At This Moment* ❗`);
            }

            const { newsURL, title, image, text, videoURL, timestamp, videoStart, videoEnd } = data;

            // Check if the news was posted within the last 10 minutes
            const currentTime = new Date();
            const newsTime = new Date(timestamp);
            const timeDifference = (currentTime - newsTime) / (1000 * 60); // Difference in minutes

            if (timeDifference > 10) {
                return reply(`*Sorry, the news is older than 10 minutes.*`);
            }

            let newsInfo = " 𝐇𝐢𝐫𝐮 𝐍𝐞𝐰𝐬 𝐔𝐩𝐝𝐚𝐭𝐞 📰\n\n";
            newsInfo += `✨ *Title*: ${title}\n\n`;
            newsInfo += `📑 *Description*:\n${text}\n\n`;
            newsInfo += `⛓️‍💥 *Url*: ${newsURL}\n\n`;

            // Check if videoURL is available and if the video part (start-end) is specified
            if (videoURL) {
                let videoInfo = `🎥 *Video URL*: ${videoURL}\n`;

                // If video start and end times are available
                if (videoStart && videoEnd) {
                    videoInfo += `⏳ *Video Segment*: From ${videoStart} to ${videoEnd}\n`;
                }

                newsInfo += videoInfo;
            }

            newsInfo += `> ᴘᴏᴡᴇʀᴅ ʙʏ Cʜɪɴᴅᴜ  ᴍᴅ*\n\n`;

            if (image) {
                await conn.sendMessage(m.chat, {
                    image: { url: image },
                    caption: newsInfo,
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: newsInfo }, { quoted: m });
            }

        } catch (error) {
            console.error(error);
            reply(`*An Error Occurred While Fetching News At This Moment* ❗`);
        }
    }
);
