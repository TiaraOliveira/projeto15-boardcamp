import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categorieRouter from './routes/categorieRouters.js';
import gamesRouters from './routes/gamesRouters.js';
import customersRouter from './routes/customersRouters.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(categorieRouter);
app.use(gamesRouters)
app.use(customersRouter)


const PORT = process.env.PORT;
app.listen(PORT, () => console.log('Servidor funcionando'));