import connection from '../dbStrategy/postgres.js';
import joi from 'joi';

export async function getGames(req, res){
    try {
       const { rows: games } = await connection.query('SELECT * FROM games');
       res.send(games);

     //- Para a rota `/games?name=ba`, deve ser retornado uma array somente com os jogos que comecem com "ba", como "Banco Imobiliário", "Batalha Naval", etc
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }
    
}

export async function postGames(req, res){
    const newGame = req.body
    const entrySchema = joi.object({
        name: joi.string().required(),
        stockTotal: joi.number().required(),
        pricePerDay: joi.number().required()
      });
      const { error } = entrySchema.validate(entry);
      if (error) {
        return res.sendStatus(400);
      }
    //- não pode ser nome que já existe
    try {
        res.sedStatus(201)
        await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryID", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay])
        res.Status(201).send("Game novo inserido")
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }

}