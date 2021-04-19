import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connection } from './config/database/db';
import router from './router/index';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to MongoDB database
connection();

// routes
app.use('/', router);

// Home page
app.get('/', (req, res) => {
  res.send('Welcome To The Home Page.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
