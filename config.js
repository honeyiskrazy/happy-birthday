const CONFIG = {
  name: "Sana",
  photo: "./img/sana.jpg",
  music: "./music/hbd.mp3",

  colors: {
    primary: "#D4A373",
    accent: "#C9184A",
    dark: {
      background: "#120D14",
      text: "#FAF3E0",
    },
    light: {
      background: "#FFF8F0",
      text: "#2B2D42",
    },
  },

  defaultMode: "dark",

  sections: [
    { type: "greeting", title: "Hey,", subtitle: "A small birthday note, drawn in code for your art." },
    { type: "countdown", from: 3, goText: "Gift" },
    { type: "announcement", text: "For the artist who turns letters into feeling." },
    { type: "balloons", count: 16 },
    { type: "profile", wishTitle: "Happy Birthday!", wishText: "From Team Growziq, with warm birthday wishes." },
    { type: "candle", instruction: "Make a wish, Sana, then tap the flame." },
    {
      type: "scratch",
      title: "A Birthday Gift From Growziq",
      preText: "We saved one thoughtful stroke for last...",
      discount: "Free",
      description: "DOMAIN SETUP",
      code: "GROWZIQ-DOMAIN",
      validity: "Domain, DNS, SSL and launch setup included",
      footnote: "Because beautiful art deserves a beautiful online home.",
    },
    { type: "stars", count: 36 },
    {
      type: "quote",
      text: "You turn ink into emotion. Today, we wrapped a little code around that magic.",
      author: "Team Growziq",
    },
    { type: "fireworks", count: 18 },
    {
      type: "closing",
      text: "Here's to another year of ink, elegance, and beautiful creations. - Team Growziq",
      replayText: "Replay the birthday note",
    },
  ],
};
