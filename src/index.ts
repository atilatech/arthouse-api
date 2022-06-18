import express, { Express, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import { createNFT } from './create-nft';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());

const port = process.env.PORT || 8008;

app.post('/api/v1/nft', 
body('destination_address').isEthereumAddress(),
body('chain_id').isLength({ min: 1 }),
async (req: Request, res: Response) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const createNftRequest = req.body;
    const nftResult = await createNFT(createNftRequest);
    res.json(nftResult);
  } catch (error) {
    res.json({error});
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send("Welcome to the Arthouse API. For more instructions on how to use this API see: https://github.com/atilatech/arthouse-server.");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});