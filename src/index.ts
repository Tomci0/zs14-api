import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
    path: './config.env',
});

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

import app from './app';

const database = process.env.MONGO_URI;

// Connect the database
if (!database) {
    throw new Error('Database is not defined');
}

mongoose.connect(database).then((con) => {
    console.log('DB connection Successfully!');
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application is running on  http://localhost:${port}`);
});

process.on('unhandledRejection', (err: Error) => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    process.exit(1);
});
