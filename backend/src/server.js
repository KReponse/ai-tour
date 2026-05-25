const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

/* ================= DATABASE ================= */

const connectDB =
  require('./config/database');

/* ================= ROUTES ================= */

const authRoutes =
  require('./routes/authRoutes');

const tourRoutes =
  require('./routes/tourRoutes');

/* ================= CONNECT DB ================= */

connectDB();

/* ================= APP ================= */

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());

/* ================= API ROUTES ================= */

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/tours',
  tourRoutes
);

/* ================= HOME ROUTE ================= */

app.get('/', (req, res) => {

  res.json({
    success: true,
    message:
      'AI Tour Backend Running',
  });

});

/* ================= SERVER ================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});