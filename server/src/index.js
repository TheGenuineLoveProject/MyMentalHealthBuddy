import express from "express";
import helmet from "helmet";
import cors from "cors";
const app = express();
app.use(helmet());
app.use(cors());
app.get("/healthz", (_,res)=>res.status(200).send("ok"));
app.get("/readyz", (_,res)=>res.status(200).send("ready"));
app.listen(5000, ()=>console.log("🟢 Server running on 5000"));
