// ver ใหม่เปลี่ยนเป็น String
// ทำมาเผื่อ API doc เก่า เลยแก้ ใช้อันนี้
// For ใช้จัดการข้อมูล ของ GET ของ question

export const formatAnswer = (answer) => {
  return {
    id: answer.id,
    content: answer.content,
  };
};
