import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import validateVote from "../middleware/validateVote.mjs";

const voteRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Votes
 *   description: API for voting on questions and answers
 */

//------------------------------- POST -------------------------------
// Vote for Question
/**
 * @swagger
 * /questions/{questionId}/vote:
 *   post:
 *     summary: Vote on a question
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question to vote on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: integer
 *                 enum: [1, -1]
 *                 description: Vote value, 1 for upvote, -1 for downvote
 *             example:
 *               vote: 1
 *     responses:
 *       200:
 *         description: Vote on the question has been recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote on the question has been recorded successfully."
 *       400:
 *         description: Invalid vote value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid vote value."
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question not found."
 *       500:
 *         description: Unable to vote on the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to vote question."
 */

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
/**
 * @swagger
 * /answer/{answerId}/vote:
 *   post:
 *     summary: Vote on an answer
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the answer to vote on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: integer
 *                 enum: [1, -1]
 *                 description: Vote value, 1 for upvote, -1 for downvote
 *             example:
 *               vote: -1
 *     responses:
 *       200:
 *         description: Vote on the answer has been recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote on the answer has been recorded successfully."
 *       400:
 *         description: Invalid vote value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid vote value."
 *       404:
 *         description: Answer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Answer not found."
 *       500:
 *         description: Unable to vote on the answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to vote answer."
 */

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
