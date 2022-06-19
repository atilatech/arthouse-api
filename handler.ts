import express, { Express, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import { createNFT } from './src/create-nft';
import bodyParser from 'body-parser';
import serverless from "serverless-http";
import { ENVIRONMENT_NAME } from './src/config';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());


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

  const repoUrl = "https://github.com/atilatech/arthouse-server";
  const repoUrlHTML = `<a href="${repoUrl}" target="_blank" rel="noreferrer">${repoUrl}</a>`
  res.send(`Welcome to the Arthouse API. For more instructions on how to use this API see: ${repoUrlHTML}`);
});

export const handler = serverless(app);
/*uncomment if you want to test locally UNCCOMMENT_LINES_BELOW*/
const port = process.env.PORT || 8008;

if (ENVIRONMENT_NAME === "dev") {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}
