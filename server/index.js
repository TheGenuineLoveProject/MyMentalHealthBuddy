import express from "express";
import helmet from "helmet";
import cors from "cors";
const app = express();
app.use(helmet({contentSecurityPolicy:false}));
app.use(cors());
app.get("/healthz",(req,res)=>res.send("OK"));
const PORT=5000;
app.listen(PORT,"0.0.0.0",()=>console.log());
