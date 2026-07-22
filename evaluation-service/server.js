import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3005;

await connectDB();

app.listen(PORT, () => {
  console.log(`Evaluation Service running on ${PORT}`);
});