const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dbgfpa4go',
  api_key: '562393991281431',
  api_secret: '7vasvnIzLaY_-_sm9fcSzCZAPjM',
});
const fileupload = require('express-fileupload');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const app = express();
dotenv.config();
require('express-async-errors');

//routes
const authRouter = require('./routes/auth');
const commentRouter = require('./routes/comments');
const userRouter = require('./routes/users');
const videoRouter = require('./routes/videos');

//middlewares
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(fileupload({ useTempFiles: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI);
  console.log('DB is connected!');
};

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
