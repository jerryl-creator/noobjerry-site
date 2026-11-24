/*
  ================================================================
  YOUR CONTENT LIVES HERE.  This is the only file you need to edit.
  ================================================================

  - Change the text inside the quotes "like this".
  - To add a video: copy one { ... } block in `videos`, paste it at
    the TOP of the list, and change the values. Keep the comma
    between blocks.
  - youtubeId is the part after "v=" in a YouTube link:
      https://www.youtube.com/watch?v=AbC123xYz  ->  "AbC123xYz"
    For a Shorts link (youtube.com/shorts/AbC123xYz) it's the last part.
  - Or use `url` instead of youtubeId to link anywhere (TikTok, Twitch...).
  - Set featured: true on ONE video to show it big at the top.
  - New YouTube uploads appear on their own (see README), so you only
    need to add a video here to feature it, re-tag it, or show an old one.
  - Dates are YYYY-MM-DD. The older ones below are approximate.
  - To add another social link, copy the YouTube block in `socials`.
    Supported icons: youtube, tiktok, instagram, x, twitch, discord
    (anything else gets a generic link icon).
*/

window.SITE = {
  name: "NoobJerry",
  tagline: "Wuthering Waves, sim racing and whatever I'm playing.",
  bio: "Boss fights and story cutscenes from Wuthering Waves (JP + ENG subs), sim racing in iRacing, Automobilista 2 and ACC, and other games I'm into. Pick a video below or come say hi on YouTube.",
  avatar: "images/avatar.jpg",

  socials: [
    { platform: "youtube", label: "YouTube", handle: "@noobjerry", url: "https://youtube.com/@noobjerry" },
    { platform: "instagram", label: "Instagram", handle: "@noob_jerryl", url: "https://www.instagram.com/noob_jerryl" },
    { platform: "twitch", label: "Twitch", handle: "sandwichjerry", url: "https://www.twitch.tv/sandwichjerry" }
  ],

  /*
    INSTAGRAM TAB
    To add a post:
      1. Open the post on Instagram. The link looks like
         instagram.com/p/ABC123/   (photo)   or   instagram.com/reel/ABC123/   (video)
      2. Save its picture into the images/instagram folder, named ABC123.jpg
         (screenshot or "save image"; portrait 3:4 looks best).
      3. Copy a line below, put it at the top, and change code / type / date.
    The newest 12 look nicest, but you can add as many as you like.
  */
  instagram: {
    handle: "@noob_jerryl",
    url: "https://www.instagram.com/noob_jerryl",
    posts: [
      { code: "DgFa5P_AWCS", type: "reel", date: "2026-11-23", image: "images/instagram/DgFa5P_AWCS.jpg" },
      { code: "Df94_HOGXur", type: "reel", date: "2026-11-20", image: "images/instagram/Df94_HOGXur.jpg" },
      { code: "Df6dC5vGFJY", type: "post", date: "2026-11-18", image: "images/instagram/Df6dC5vGFJY.jpg" },
      { code: "Df3zFotmMSY", type: "post", date: "2026-11-17", image: "images/instagram/Df3zFotmMSY.jpg" },
      { code: "Df3xC2aGMp2", type: "post", date: "2026-11-17", image: "images/instagram/Df3xC2aGMp2.jpg" },
      { code: "Df3owU8mNFY", type: "post", date: "2026-11-17", image: "images/instagram/Df3owU8mNFY.jpg" },
      { code: "Df3aZ0yEkHA", type: "post", date: "2026-11-17", image: "images/instagram/Df3aZ0yEkHA.jpg" },
      { code: "Df1S6mmGNZS", type: "post", date: "2026-11-16", image: "images/instagram/Df1S6mmGNZS.jpg" },
      { code: "Df1NcGimL87", type: "post", date: "2026-11-16", image: "images/instagram/Df1NcGimL87.jpg" },
      { code: "Df03F4jE9lZ", type: "post", date: "2026-11-16", image: "images/instagram/Df03F4jE9lZ.jpg" },
      { code: "DfywLYtmBkp", type: "post", date: "2026-11-15", image: "images/instagram/DfywLYtmBkp.jpg" },
      { code: "Dfys_pSkuK7", type: "post", date: "2026-11-15", image: "images/instagram/Dfys_pSkuK7.jpg" }
    ]
  },

  // New uploads are added automatically to videos.js (see README).
  // Set to false to only show the videos listed below.
  autoVideos: true,

  // IDs of uploads you DON'T want on the site, e.g. ["dyNGeu6O0O0"]
  hideVideos: [],

  // Hand-picked videos. These always show, and if a video is also in the
  // automatic list, what you write here wins (title, tags, featured...).
  videos: [
    {
      title: "Battlefield 6 - 100% High CPU Utilization Fix",
      date: "2025-11-20",
      tags: ["gaming", "tips"],
      youtubeId: "lhwC96CflaA",
      description: "A quick fix for Battlefield 6 maxing out your CPU."
    },
    {
      title: "Rover vs Phrolova (with Cutscenes) - Wuthering Waves 2.5",
      date: "2025-10-20",
      tags: ["wuthering waves"],
      youtubeId: "9HppO3m3D7E"
    },
    {
      title: "Lupa VS Lady of the Sea (Mya) - Wuthering Waves 2.4",
      date: "2025-09-20",
      tags: ["wuthering waves"],
      youtubeId: "Ic_kVwK7dEs",
      description: "Lupa takes on the Lady of the Sea, with JP voices and English subtitles. The most-watched video on the channel.",
      featured: true
    },
    {
      title: "BMW M4 GT3 Hotlap on Thruxton Circuit | iRacing",
      date: "2025-08-20",
      tags: ["sim racing"],
      youtubeId: "vu9u6Ik5la8"
    },
    {
      title: "Porsche 992 GT3 RS - AMS2",
      date: "2024-11-20",
      tags: ["sim racing"],
      youtubeId: "PlHjIS3OJ68"
    },
    {
      title: "Automobilista 2 - Formula 1 Ultimate Gen 2 Gameplay with F1 2023 Skins",
      date: "2024-10-20",
      tags: ["sim racing"],
      youtubeId: "l1R4nQLcI2U"
    }
  ],

  /*
    MY SETUP section. Each group is a card; each item is ["Label", "What you use"].
    Add, remove or rename freely. Delete the whole `setup` block to hide the section.
  */
  setup: [
    {
      name: "PC", jp: "パソコン",
      items: [
        ["CPU", "AMD Ryzen 7 5700X3D"],
        ["GPU", "ASUS TUF Gaming RTX 3070 V2"],
        ["RAM", "Kingston FURY Beast RGB 32GB (2×16GB, 3600MHz)"],
        ["Motherboard", "ROG B450-F Gaming"],
        ["Cooler", "Thermalright Peerless Assassin PA120 SE"],
        ["Storage", "Samsung 970 EVO Plus 250GB · Crucial 1TB SSD · Samsung 870 QVO 2TB"],
        ["Case", "Corsair 4000D Airflow"],
        ["Monitor", "34\" Ultrawide"]
      ]
    },
    {
      name: "Sim Racing", jp: "シムレーシング",
      items: [
        ["Wheel", "Thrustmaster T300 RS GT Edition"],
        ["Pedals", "Thrustmaster T3PA (GT Edition set)"],
        ["Sims", "iRacing · Automobilista 2 · ACC"]
      ]
    }
  ],

  footer: "" // optional line at the bottom of the page, e.g. a business email
};
