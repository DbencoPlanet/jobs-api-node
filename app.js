require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

//routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100,
    message: {
      status: 429,
      error: 'Too Many Requests',
    },
  })
);

// middleware
app.use;
app.use(express.json());
//middleware
app.use(helmet());
app.use(cors());
app.use(xss());
// rate limiting
// const limiter = rateLimiter({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 100,
// });
// app.use(limiter);

// extra packages

app.get('/', (req, res) => {
  res.send('Jobs API is running...');
});
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
