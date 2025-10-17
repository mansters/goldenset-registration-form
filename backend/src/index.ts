import express, { Express } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
