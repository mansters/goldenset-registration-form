import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"];

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Blocked CORS request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
