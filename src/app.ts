import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';

import AppError from './utils/appError';

import globalErrHandler from './controllers/errorController';
import userRoutes from './routes/user';
import indexRoutes from './routes/index';
import authRoutes from './routes/auth';
import consultationRoutes from './routes/consultations';
import devRoutes from './routes/dev';
import radioRoutes from './routes/radio';
import dataRouter from './routes/data';

import { useGoogleStrategy, useLocalStrategy } from './configs/passport.config';

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        // store: MongoStore.create({ mongoUrl: process.env.MONGO_URI_SESSION }),
        resave: false,
        saveUninitialized: false,
    })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//     cookieSession({
//         maxAge: 24 * 60 * 60 * 7000, // 7 dni
//         keys: [process.env.SESSION_SECRET as string], // Użyj swojego własnego klucza cookie
//     })
// );

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('tiny'));

// Allow Cross-Origin requests
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://konsultacje.zs14.tech',
            'https://admin.zs14.tech',
        ],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);

app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
// const limiter = rateLimit({
//     max: 150,
//     windowMs: 60 * 60 * 1000,
//     message: {
//         status: 'fail',
//         message: 'Too many requests from this IP, please try again in an hour!',
//     },
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
    express.json({
        limit: '15kb',
    })
);

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// useGoogleStrategy();
useLocalStrategy();

// Routes
app.use('/', indexRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/consultations', consultationRoutes);
app.use('/api/v1/dev', devRoutes);
app.use('/api/v1/radio', radioRoutes);
app.use('/api/v1/data', dataRouter);

// handle undefined Routes
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    next(err);
});

app.use(globalErrHandler);

export default app;
