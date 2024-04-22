import express from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { router } from './src/Routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(router);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
