import express from "express";
import { engine } from "express-handlebars";
import { Player } from "./src/models.js";
// import { loadHighScore, saveHighScore } from "./src/db.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { getRandomWord } from "./src/SecretWords.js";

mongoose.connect(process.env.DB_URL);

const app = express();
app.use(bodyParser.json());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "templates");

const MENY = [
  { page: "WORDLE", url: "/" },
  { page: "ABOUT", url: "/about" },
  { page: "HIGHSCORE", url: "/highscore" },
];

async function renderPage(res, page) {
  // const currentPath = page == "index" ? "/" : `/${page}`;
  res.render(page, {
    menuPath: MENY.map((link) => {
      return {
        label: link.page,
        link: link.url,
      };
    }),
  });
}

app.get("/", async (req, res) => {
  renderPage(res, "index");
});

app.get("/about", async (req, res) => {
  renderPage(res, "about");
});

app.get("/highscore", async (req, res) => {
  const data = await Player.find().sort({ timeTaken: +1 });
  console.log(data);
  renderPage(res, "highscore", { data });
});

app.get("/winning", async (req, res) => {
  renderPage(res, "winning");
});

app.get("/api/word/:length", async (req, res) => {
  const length = parseInt(req.params.length);
  res.send(getRandomWord(length));
});

// här skickar vi data till databas
app.post("/api/mongSkicka2", async (request, response) => {
  const skickadData = request.body;
  const newPlayer = new Player(skickadData);
  await newPlayer.save();
  response.json("värde har kommit fram");
});
// här har vi listan från MongoDBs databas
app.get("/api/testTOTAL", async (req, res) => {
  const data = await Player.find().sort({ timeTaken: +1 });
  res.json({ data });
});

app.use(express.static("./static"));

app.listen(5080);
console.log("server är igång");
