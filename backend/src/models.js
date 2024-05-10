import mongoose from "mongoose";

const Player = mongoose.model("gamer", {
  secretWord: String,
  allTheGuesses: Array,
  name: String,
  timeTaken: Number,
  wordLength: Number,
  allowDuplicates: Boolean,
});

export { Player };
