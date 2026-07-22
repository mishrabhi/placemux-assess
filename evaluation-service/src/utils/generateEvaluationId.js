import { v4 as uuid } from "uuid";

const generateEvaluationId = () => {
  const date = new Date();

  const yyyy = date.getFullYear();

  const mm = String(date.getMonth() + 1).padStart(2, "0");

  const dd = String(date.getDate()).padStart(2, "0");

  const random = uuid().replace(/-/g, "").substring(0, 8).toUpperCase();

  return `EVL-${yyyy}${mm}${dd}-${random}`;
};

export default generateEvaluationId;
