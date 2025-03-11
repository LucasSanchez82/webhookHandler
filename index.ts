import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import Log from "./utils/Log";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/manwebv2", (req: Request, res: Response) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  if (event === "push" && payload.ref === "refs/heads/prod") {
    console.log("Received a push event for the prod branch");
    Log.add("Received a push event for the prod branch");
  } else Log.add("Received an other event than the prod branch");

  res.status(200).send("Webhook received");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
