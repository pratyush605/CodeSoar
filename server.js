const express = require('express');
const db = require('./Utils/database.js');
const userRoutes = require('./Routes/userRoute.js');
const authRoutes = require('./Routes/authRoute.js');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', userRoutes);
app.use('/auth', authRoutes);

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