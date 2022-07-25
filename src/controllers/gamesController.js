import connection from '../dbStrategy/postgres.js';
import joi from 'joi';

export async function getGames(req, res){

    const name = req.query.name;

    if (name){
        name = name.toLowerCase()
        const { rows: games } = await connection.query(`
            SELECT games.*, categories.name as "categoryName"
            FROM games 
            JOIN categories 
            ON games."categoryId"=categories.id
            WHERE lower(games.name) LIKE $1
        `, [name +"%"])
        return res.send(games)
    }
   
    try {
       const { rows: games } = await connection.query(`
        SELECT games.*, categories.name as "categoryName"
        FROM games 
        JOIN categories 
        ON games."categoryId"=categories.id
        `);
        
        res.send(games);

     
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }
    
}

export async function postGames(req, res){
    const newGame = req.body
    const gameSchema = joi.object({
        name: joi.string().required(),
        image: joi.required(),
        stockTotal: joi.number().min(1).required(),
        pricePerDay: joi.number().integer().min(1).required(), 
        categoryId: joi.number().integer().required()
     
      });
      const { error } = gameSchema.validate(newGame);
      if (error) {
        return res.sendStatus(400);
      }
    
    try {
        const games = await connection.query(`SELECT name FROM games`)
        const gamesName = games.rows.map(e => e.name)
        const existGame = gamesName.find(e => e == newGame.name)
        if(existGame){
            return res.status(409).send("Categoria já existe")
        }
        await connection.query(`INSERT INTO games.*) VALUES ('${newGame.name}', '${newGame.image}', '${newGame.stockTotal}', '${newGame.categoryId}', '${newGame.pricePerDay}')`)
        res.sendStatus(201)
    } catch (error) {
        console.log(error)
        res.status(500).send("Erro no servidor")
    }

}