import express from "express";
import dotenv from "dotenv";
import router from "./Routes/auth.route.js";


dotenv.config();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use ("/api/auth",  router)
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

