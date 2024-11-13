// middleware/validateAnswer สำหรับ POST

const validateAnswer = (req, res, next) => {
  const { content } = req.body;
  const { questionId } = req.params;
  const messageonFailed = { message: "Invalid request data." };

  // ตรวจสอบ content
  if (!content || typeof content !== "string" || content.length > 300) {
    console.log("ตรวจสอบ content");
    return res.status(400).json(messageonFailed);
  }

  // ตรวจสอบ questionId
  // หาก questionId เป็น "123abc", Number(questionId) จะแปลงเป็น NaN
  if (!questionId || isNaN(Number(questionId))) {
    console.log("ตรวจสอบ questionId");
    return res.status(400).json(messageonFailed);
  }

  next();
};

export default validateAnswer;
