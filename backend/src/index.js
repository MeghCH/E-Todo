const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth/auth.js");
const userRoutes = require("./routes/user/user.js");
const usersRoutes = require("./routes/users/users.js");
const todoRoutes = require("./routes/todos/todos.js");
const timerRoutes = require("./routes/timer/timer.js");
const notFound = require("./middleware/notFound.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/api/auth", authRoutes);

app.use("/", userRoutes);
app.use("/", usersRoutes);
app.use("/api", userRoutes);
app.use("/api", usersRoutes);

app.use("/", todoRoutes);
app.use("/api", todoRoutes);

app.use("/", timerRoutes);
app.use("/api", timerRoutes);

app.use(notFound);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
