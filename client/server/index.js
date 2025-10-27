const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
app.get('/health', (_req,res)=>res.json({ok:true, service:'server', port:PORT}));
app.listen(PORT, () => console.log('Server listening on', PORT));
