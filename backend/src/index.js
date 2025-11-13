const express = require("express");
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

app.use(express.json());

app.use(authRoutes);

app.use("/user", userRoutes);

app.use("/users", usersRoutes);

app.use("/todos", todoRoutes);

app.use("/timer", timerRoutes);

app.use(notFound);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
