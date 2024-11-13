import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import validateVote from "../middleware/validateVote.mjs";

const voteRouter = Router();

//------------------------------- POST -------------------------------
// Vote for Question
voteRouter.post(
  "/questions/:questionId/vote",
  validateVote,
  async (req, res) => {
    const { vote } = req.body;
    const { questionId } = req.params;
    try {

    //เช็ค question 
      const questionCheck = await connectionPool.query(
        `SELECT * FROM questions WHERE id = $1`,
        [questionId]
      );

      // ถ้าไม่มี questionId ส่ง 404 
      if (questionCheck.rows.length === 0) {
        return res.status(404).json({ message: "Question not found." });
      }

      // Insert ข้อมูลตาม Table ใน DB
      const result = await connectionPool.query(
        `INSERT INTO question_votes (question_id, vote)
       VALUES ($1, $2)
       RETURNING *;`,
        [questionId, vote]
      );

      res.status(200).json({
        message: "Vote on the question has been recorded successfully.",
        
      });
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Unable to vote question." });
    }
  }
);


// Vote for Answer
voteRouter.post(
  "/answer/:answerId/vote",
  validateVote,
  async (req, res) => {
    const { vote } = req.body;
    const { answerId } = req.params;
    try {

    //เช็ค answer
      const answerCheck = await connectionPool.query(
        `SELECT * FROM answers WHERE id = $1`,
        [answerId]
      );

      // ถ้าไม่มี answerId ส่ง 404 
      if (answerCheck.rows.length === 0) {
        return res.status(404).json({ message: "Answer not found." });
      }

      // Insert ข้อมูลตาม Table ใน DB
      const result = await connectionPool.query(
        `INSERT INTO answer_votes (answer_id, vote)
       VALUES ($1, $2)
       RETURNING *;`,
        [answerId, vote]
      );

      res.status(200).json({
        message: "Vote on the answer has been recorded successfully.",
        
      });
    } catch (error) {
      console.error("Error voting on answer::", error);
      res.status(500).json({ message: "Unable to vote answer." });
    }
  }
);

export default voteRouter;
