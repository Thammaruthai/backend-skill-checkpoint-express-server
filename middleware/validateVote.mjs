// middleware/validateQuestion สำหรับ POST และ PUT

const validateVote = (req, res, next) => {
  const { vote } = req.body;
  const messageonFailed = { message: "Invalid vote value." };

  // ตรวจสอบ vote
  if (
    vote == undefined ||
    typeof vote !== "number" ||
    (vote !== 1 && vote !== -1)
  ) {
    return res.status(400).json(messageonFailed);
  }


  next();
};

export default validateVote;
