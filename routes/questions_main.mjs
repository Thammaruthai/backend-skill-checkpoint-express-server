import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import validateQuestion from "../middleware/validateQuestion.mjs"; //middleware สำหรับ POST question
import { formatQuestion } from "../utils/formatGETQuestion.mjs"; // format API
import answerRouter from "./questions_answer.mjs";

const questionsRouter = Router();

// แยก route ย่อย question เพื่อหา answer ตาม Question
questionsRouter.use("/", answerRouter);

//------------------------------- POST -------------------------------
// Create a new question
questionsRouter.post("/", validateQuestion, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    // Insert ข้อมูลตาม Table ใน DB
    const result = await connectionPool.query(
      `INSERT INTO questions (title, description, category)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [title, description, category]
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
// GET all questions
questionsRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(`
      SELECT * FROM questions ORDER BY id ASC 
    `);
    // ถ้าไม่มีข้อมูลส่ง 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const formattedData = result.rows.map(formatQuestion);

    res.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// GET a question by ID
questionsRouter.get("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  try {
    const result = await connectionPool.query(
      `SELECT * FROM questions WHERE id = $1`,
      [questionId]
    );
    // ถ้าไม่มีข้อมูลส่ง 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: `Question not found.` });
    }

    // ใช้ฟังก์ชัน format ข้อมูลตาม API
    const formattedData = formatQuestion(result.rows[0]);

    res.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching question by id:", error);
    res.status(500).json({ message: "Unable to fetch question." });
  }
});

// GET Search questions by title or category
questionsRouter.get("/search", async (req, res) => {
  const { title, category } = req.query;
  let query = `SELECT * FROM questions WHERE 1=1`;
  const values = [];

  //เงื่อนไข title และ category
  if (title) {
    query += ` AND title ILIKE $${values.length + 1}`;
    values.push(`%${title}%`);
  }
  if (category) {
    query += ` AND category ILIKE $${values.length + 1}`;
    values.push(`%${category}%`);
  }

  try {
    const result = await connectionPool.query(query, values);

    // ถ้าไม่มีข้อมูลส่ง 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: `No questions found.` });
    }

    // ใช้ฟังก์ชัน format ข้อมูลตาม API
    const formattedData = result.rows.map(formatQuestion);

    res.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching questions by query:", error);
    res.status(500).json({ message: "Unable to fetch questions." });
  }
});

//------------------------------- PUT -------------------------------
//Update a question by ID
questionsRouter.put("/:questionId", validateQuestion, async (req, res) => {
  const { title, description, category } = req.body;
  const { questionId } = req.params;
  try {
    // Update ข้อมูลตาม Table ใน DB
    const result = await connectionPool.query(
      `UPDATE questions 
       SET title = $1, description = $2, category = $3 
       WHERE id = $4
       RETURNING *;`,
      [title, description, category, questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.status(200).json({
      message: "Question updated successfully.",
      data: result.rows[0], // ส่งข้อมูลที่ถูกอัปเดตกลับไป
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Unable to update question." });
  }
});

//------------------------------- DELETE -------------------------------
//Delete a question by ID
questionsRouter.delete("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  try {
    // ลบข้อมูลที่เกี่ยวข้องกับ question นี้ในทุก table

    // ลบ answer_votes ที่เชื่อมกับ answers ของคำถามนี้
    await connectionPool.query(
      `DELETE FROM answer_votes 
       WHERE answer_id IN (
         SELECT id FROM answers WHERE question_id = $1
       );`,
      [questionId]
    );

    // ลบ answers ที่เชื่อมกับคำถามนี้
    await connectionPool.query(`DELETE FROM answers WHERE question_id = $1;`, [
      questionId,
    ]);

    // ลบ question_votes ที่เชื่อมกับคำถามนี้
    await connectionPool.query(
      `DELETE FROM question_votes WHERE question_id = $1;`,
      [questionId]
    );

    // ลบ question เองจากตาราง questions
    const result = await connectionPool.query(
      `DELETE FROM questions
       WHERE id = $1
       RETURNING *;`,
      [questionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.status(200).json({
      message: "Question and related data have been deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting question and related data:", error);
    res
      .status(500)
      .json({ message: "Unable to delete question and related data." });
  }
});

export default questionsRouter;
