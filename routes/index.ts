import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.get('/:formId/filteredResponses', (req: Request, res: Response) => {
  console.log('req', req);
  res.send('filteredResponses');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
