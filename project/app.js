const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const authRouter = require('./middlewares/authMiddleware');
const refreshTokenMiddleware = require('./middlewares/refreshAccessToken');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use('/auth', authRouter); // Ensure this is a valid middleware function
app.use('/refreshToken', refreshTokenMiddleware); // Ensure this is a valid middleware function

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route
const indexRouter = require('./routes/index');
const sampleRouter = require('./routes/sample');
const route3Router = require('./routes/route3');
app.use('/', indexRouter);
app.use('/', sampleRouter);
app.use('/', route3Router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
