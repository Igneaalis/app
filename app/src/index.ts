import express, { Request, Response } from 'express';
import 'dotenv/config';
import booksRouter from './routes/books';
import usersRouter from './routes/users';

const app = express();
app.use(express.json());

const port = 8080;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello, TypeScript Express!');
});

app.use('/', booksRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});