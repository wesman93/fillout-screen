import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = "https://api.fillout.com";

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.get('/:formId/filteredResponses', (req: Request, res: Response) => {
  const formId = req.params.formId;

  axios.get(`${BASE_URL}/v1/api/forms/${formId}/submissions`, { ...req.params, headers: {"Authorization" : `${req.headers.authorization}`} })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
          res.send(error);
      });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
