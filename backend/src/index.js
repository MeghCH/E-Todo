require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth/auth');
const userRoutes = require('./routes/user/user');
const usersRoutes = require('./routes/users/users');
const todoRoutes = require('./routes/todos/todos');
const timerRoutes = require('./routes/timer/timer');
const notFound = require('./middleware/notFound');

const app = express();

app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/timer', timerRoutes);

app.use(notFound);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
