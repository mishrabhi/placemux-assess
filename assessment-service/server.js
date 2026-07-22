import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3004;

await connectDB();

app.listen(PORT, () => {
  console.log(`Assessment Service running on ${PORT}`);
});