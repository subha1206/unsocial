import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import httpStatus from 'http-status';
import morgan from './utils/morgan';
import ApiError from './utils/ApiError';
import logger from './utils/logger';
import { errorConverter, errorHandler } from './middlewares/error';
require('dotenv').config();

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// enable cors
app.use(cors());
app.options('*', cors());

app.get('/', function (req, res) {
  res.send('hello');
});

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
