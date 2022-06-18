import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createNFT } from './create-nft';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8008;

app.get('/create-nft', async (req: Request, res: Response) => {
  const nft = await createNFT();
  
  res.send(nft);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});