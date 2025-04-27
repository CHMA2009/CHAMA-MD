const fetch = require("node-fetch");
const { cmd } = require("../command");

cmd({
  pattern: "statue",
  alias: ["status", "st"],
  desc: "Get best TikTok status videos.",
  react: '✅',
  category: 'tools',
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  if (!args[0]) {
    return reply("🌸 *Status videos for what?*\n\n*Usage Example:*\n.statue <query>");
  }

  const query = args.join(" ");
  await store.react('⌛');
  
  try {
    reply(`🔎 Searching TikTok Status Videos for: *${query}*`);
    
    const response = await fetch(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      await store.react('❌');
      return reply("❌ No status videos found. Try a different keyword!");
    }

    // Get 10 to 20 random results
    const results = data.data.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 11) + 10);

    for (const video of results) {
      const message = `🌸 *Status Video*:\n\n`
        + `*• Title*: ${video.title}\n`
        + `*• Author*: ${video.author || 'Unknown'}\n`
        + `*• Duration*: ${video.duration || "Unknown"}\n`
        + `*• URL*: ${video.link}\n\n`;

      if (video.nowm) {
        await conn.sendMessage(from, {
          video: { url: video.nowm },
          caption: message
        }, { quoted: m });
      } else {
        reply(`❌ Failed to retrieve video for *"${video.title}"*.`);
      }
    }

    await store.react('✅');
  } catch (error) {
    console.error("Error in Statue Command:", error);
    await store.react('❌');
    reply("❌ An error occurred while searching TikTok status videos. Please try again later.");
  }
});
