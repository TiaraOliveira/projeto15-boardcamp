import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categorieRouter from './routes/categorieRouters.js';
import gamesRouters from './routes/gamesRouters.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(categorieRouter);
app.use(gamesRouters)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Servidor funcionando'));