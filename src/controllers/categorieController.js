import connection from '../dbStrategy/postgres.js';
import joi from 'joi';

export async function getCategorie(req, res){
    const { rows: categories } = await connection.query('SELECT * FROM categories');
    res.send(categories);
}

export async function postCategories(req, res){
    const body = req.body
    const entrySchema = joi.object({
        name: joi.string().required()
      });
      const { error } = entrySchema.validate(entry);
      if (error) {
        return res.sendStatus(400);
      }
    //precisa verificar tbem se o jogo já não existe
    try {
        res.sedStatus(201)
        await connection.query('INSERT INTO categories (name) VALUES (${body.name})')
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }

}