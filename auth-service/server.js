import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`Auth service running on ${PORT}`)
});