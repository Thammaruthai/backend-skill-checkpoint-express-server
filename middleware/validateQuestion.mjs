// middleware/validateQuestion สำหรับ POST และ PUT

const validateQuestion = (req, res, next) => {
  const { title, description, category } = req.body;
  const messageonFailed = { message: "Invalid request data." };

  // ตรวจสอบ title
  if (!title || typeof title !== "string") {
    return res.status(400).json(messageonFailed);
  }

  // ตรวจสอบ description
  if (!description || typeof description !== "string") {
    return res.status(400).json(messageonFailed);
  }

  // ตรวจสอบ category
  if (!category || typeof category !== "string") {
    return res.status(400).json(messageonFailed);
  }

  next();
};

export default validateQuestion;
