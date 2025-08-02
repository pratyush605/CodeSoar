const express = require('express');
const db = require('./Utils/database.js');
const homeRoutes = require('./routes/homeRoutes.js');
const authRoutes = require('./Routes/authRoute.js');
const taskRoutes = require('./routes/taskRoutes.js');
const roleRoutes = require('./routes/roleRoutes.js');
const userRoutes = require('./routes/userRouters.js');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', homeRoutes);
app.use('/role', roleRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/task', taskRoutes);

const startServer = async () => {
  try {
    await db.sync();
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server error:', error);
  }
};

startServer();