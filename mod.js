let blogspot_data = [
  {
    "id": "soul-money",
    "timestamp": 1278374400,
    "title": "Soul Money",
  },
  {
    "id": "interrogative-remarks-followed-by",
    "timestamp": 1259107200,
    "title": "Interrogative remarks followed by statements that involve various forms of punctuation.",
  },
  {
    "id": "shirtsprints",
    "timestamp": 1250640000,
    "title": "Homestuck shirts/prints",
  },
  {
    "id": "fan-art-penny-arcade",
    "timestamp": 1247270400,
    "title": "Fan Art: The Penny Arcade",
  },
  {
    "id": "old-blog-redux-internet-adventures",
    "timestamp": 1247097600,
    "title": "Old blog redux: Internet Adventures",
  },
  {
    "id": "flash-is-hard",
    "timestamp": 1239753600,
    "title": "FLASH IS HARD",
  },
  {
    "id": "getting-ready-for-next-adventure",
    "timestamp": 1239235200,
    "title": "Getting ready for the next adventure!",
  },
  {
    "id": "corporate-pranksterism",
    "timestamp": 1238457600,
    "title": "Corporate Pranksterism!",
  },
  {
    "id": "wcwe-addendum",
    "timestamp": 1237766400,
    "title": "WCWE Addendum",
  },
  {
    "id": "webcomics-weekend-09",
    "timestamp": 1237766400,
    "title": "Webcomics Weekend 09",
  },
  {
    "id": "pot-of-gold-at-end-of-cultural-rainbow",
    "timestamp": 1236988800,
    "title": "The pot of gold at the end of the cultural rainbow...",
  },
  {
    "id": "end-of-problem-sleuth",
    "timestamp": 1236643200,
    "title": "THE END OF PROBLEM SLEUTH",
  },
  {
    "id": "if-you-drew-comic-called-super-frog-at",
    "timestamp": 1235174400,
    "title": "If you drew a comic called Super Frog at age 11",
  },
  {
    "id": "blog-redux-bon-voyage-tim-and-george",
    "timestamp": 1234483200,
    "title": "REDUX: Bon Voyage, Tim and George",
  },
  {
    "id": "how-do-i-prank-thee-let-me-qwantz-ways",
    "timestamp": 1234137600,
    "title": "How do I prank thee? Let me qwantz the ways",
  },
  {
    "id": "star-trek-edits",
    "timestamp": 1233619200,
    "title": "Star Trek Edits",
  },
  {
    "id": "need-for-steed",
    "timestamp": 1231286400,
    "title": "Need for the Steed",
  },
  {
    "id": "fancy-santas-are-stupid-imposters",
    "timestamp": 1229990400,
    "title": "Fancy-Santas are Stupid Imposters",
  },
  {
    "id": "ms-paint-adventures-suggestion-box",
    "timestamp": 1229472000,
    "title": "The MS Paint Adventures Suggestion Box",
  }
];

let notes = []

module.exports = {
  title: "Social Links",
  summary: "Adds newsposts and links to Andrew Hussie's public social media posts about Problem Sleuth and Homestuck.",
  description: "Shows the news posts that were present below each page when the page was originally posted on mspaintadventures.com. Also displays links to the contemporary latest posts on Andrew Hussie's public fan-focused social media. This mod is open source and licensed under the GPLv3.",

  author: "wheals",
  version: 0.1,

  styles: [
    {
      source: "./news.scss"
    }
  ],

  edit(archive) {
    const SOCIAL = archive.social
    const NEWS = archive.news
    const STORY = archive.mspa.story

    let news = {}
    for (let pageNum in STORY) {
      const page = STORY[pageNum]
      const flags = ["ENDOFHS", "GAMEOVER", "DOTA", "SHES8ACK", "FULLSCREEN", "ECHIDNA"]
      if (!flags.some(flag => page.flag.includes(flag))) {
        let yesterday = page.timestamp * 1 - 60 * 60 * 24
        let prevNewsposts = []
        for (let year in NEWS)
          for (let post of NEWS[year])
            if (yesterday > post.timestamp)
              prevNewsposts.push(post)
        prevNewsposts.sort((a, b) => b.timestamp - a.timestamp)
        prevNewsposts = prevNewsposts.slice(0, 4)
        prevNewsposts = prevNewsposts.map(newspost => newspost.html)
        let newsHTML = prevNewsposts.reduce((prev, cur) => prev + cur, "")
        newsHTML = newsHTML.replace(/src="\/archive/g, 'src="assets://archive')
        newsHTML = newsHTML.replace(/src='\/archive/g, "src='assets://archive")
        newsHTML = '<img id="newslogo"> </img>' + newsHTML

        let latestpost = null;
        for (let post of SOCIAL.tumblr)
          if (post.timestamp < yesterday && !(latestpost && latestpost.timestamp > post.timestamp))
            latestpost = post
        let tumblrtext = ""
        if (latestpost)
          tumblrtext = `<div>Latest Tumblr post: <a href="tumblr/${latestpost.id}">${new Date(latestpost.timestamp * 1000).toDateString()}</a></div>`

        latestpost = null
        for (let account in SOCIAL.formspring)
          for (let post of SOCIAL.formspring[account])
            if (post.timestamp < yesterday && !(latestpost && latestpost.timestamp > post.timestamp))
              latestpost = post
        let formspringtext = ""
        if (latestpost)
          formspringtext = `<div>Latest Formspring post: <a href="formspring/${latestpost.id}">${new Date(latestpost.timestamp * 1000).toDateString()}</a></div>`

        let blogtext = "";
        for (let blog of blogspot_data)
          if (blog.timestamp < yesterday)
          {
            blogtext = `<div>Latest Blogspot post: <a href="/blogspot/${blog.id}">${blog.title}</a></div>`
            break;
          }

        news[pageNum] = [
          { "content": tumblrtext
                       + formspringtext
                       + blogtext },
          { "content": newsHTML,
            "class": "news", },
        ]
      }
    }
    notes.push({
      "author": "",
      "story": news,
    })
  },

  footnotes: notes,

  routes: {
    'assets://images/retro_news.gif': './retro_news.gif',
    'assets://images/pxs_news.png': './pxs_news.png'
  },
}
