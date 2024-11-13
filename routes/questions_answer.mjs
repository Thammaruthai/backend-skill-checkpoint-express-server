import connectionPool from "../utils/db.mjs";
import { Router } from "express";
import { formatAnswer } from "../utils/formatGETAnswer.mjs";

const answerRouter = Router();

//------------------------------- GET -------------------------------
// Get All answer follow questionID
answerRouter.get("/:questionId/answer", async (req, res) => {
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
answerRouter.delete("/:questionId/answer", async (req, res) => {
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