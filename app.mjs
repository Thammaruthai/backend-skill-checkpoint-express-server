import express from "express";
import dotenv from "dotenv";
import questionsRouter from "./routes/questions_main.mjs";
import voteRouter from "./routes/votes_question&answer.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
//console.log(process.env.PORT);

app.use(express.json());

//Home
app.get("/", (req, res) => {
  return res.json("Server API is working 🚀");
});

//Router Question
app.use("/questions", questionsRouter);

//Router Vote ตั้งเป็น '/' เพราะมีทั้ง answer และ question
app.use("/", voteRouter);


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
