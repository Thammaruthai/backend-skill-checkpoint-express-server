import connectionPool from "../utils/db.mjs";
import { Router } from "express";
import { formatAnswer } from "../utils/formatGETAnswer.mjs";
import validateAnswer from "../middleware/validateAnswer.mjs";

const answerRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: API answering the question.
 */

//------------------------------- POST -------------------------------
// Create an answer for a question
/**
 * @swagger
 * /questions/{questionId}/answers:
 *   post:
 *     summary: Create an answer for a specific question
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the answer
 *             example:
 *               content: "The capital of France is Paris."
 *     responses:
 *       201:
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Answer created successfully."
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data."
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
 *         description: Unable to create answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to create answers."
 */

answerRouter.post("/:questionId/answers", validateAnswer, async (req, res) => {
  const { content } = req.body;
  const { questionId } = req.params;
  try {
    // Insert ข้อมูลตาม Table ใน DB
    const result = await connectionPool.query(
      `INSERT INTO answers (question_id, content)
       VALUES ($1, $2)
       RETURNING *;`,
      [questionId, content]
    );

    res.status(201).json({
      message: "Question created successfully.",
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Unable to create question." });
  }
});

//------------------------------- GET -------------------------------
// Get All answer follow questionID
/**
 * @swagger
 * /questions/{questionId}/answers:
 *   get:
 *     summary: Get all answers for a specific question
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to retrieve answers for
 *     responses:
 *       200:
 *         description: A list of answers for the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: "The capital of France is Paris."
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
 *         description: Unable to fetch answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to fetch answers."
 */

answerRouter.get("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    const result = await connectionPool.query(
      `
      SELECT * FROM answers WHERE question_id = $1
    `,
      [questionId]
    );
    // ถ้าไม่มีข้อมูลส่ง 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const formattedData = result.rows.map(formatAnswer);

    res.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Unable to fetch answers." });
  }
});


//------------------------------- DELETE -------------------------------
// Delete answers for a question
/**
 * @swagger
 * /questions/{questionId}/answers:
 *   delete:
 *     summary: Delete all answers for a specific question
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question whose answers are to be deleted
 *     responses:
 *       200:
 *         description: All answers for the question have been deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All answers for the question have been deleted successfully."
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
 *         description: Unable to delete answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to delete answers."
 */

answerRouter.delete("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    // ลบ answer_votes ทั้งหมดด ที่เชื่อมกับ answers นี้
    await connectionPool.query(
      `DELETE FROM answer_votes 
       WHERE answer_id IN (
         SELECT id FROM answers WHERE question_id = $1
       );`,
      [questionId]
    );

    // ลบ answers ตาม params
    const result = await connectionPool.query(
      `DELETE FROM answers
       WHERE question_id = $1
       RETURNING *;`,
      [questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });


  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Unable to delete answers." });
  }
});

export default answerRouter;
