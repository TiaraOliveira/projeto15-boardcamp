import connection from '../dbStrategy/postgres.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function getRental(req, res){
    try {
       const { rows: games } = await connection.query('SELECT * FROM rentals');
       res.send(games);

     //- Para a rota `/games?name=ba`, deve ser retornado uma array somente com os jogos que comecem com "ba", como "Banco Imobiliário", "Batalha Naval", etc
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }
}

export async function postRental(req, res){
    const newRental = req.body
    const rentalSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.string().required()
      });
     const { error } = rentalSchema.validate(newRental);
      if (error) {
        return res.sendStatus(400);
      }
      const day = dayjs().format("YYYY-MM-DD");
    //   const{ rows: priceGame } = await connection.query(`SELECT games.pricePerDay FROM games`)
    //   console.log(priceGame.pricePerDay)
    //   const priceRental = (parseInt(priceGame.pricePerDay) * parseInt(newRental.daysRented))
    //   console.log(priceRental)
  
    try {
        const teste = await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ('${newRental.customerId}', '${newRental.gameId}', '${day}', '${newRental.daysRented}', 1000)`)
       
        res.status(201).send("Game novo inserido")
    } catch (error) {
        console.log(error)
        res.status(500).send("Erro no servidor")
    }

}

export async function deleteRental(req, res){
    const {id} = req.params;
    const rental = await connection.query(`SELECT id FROM rentals`)
    
        const rentalId = rental.rows.map(e => e.id)
        console.log(rentalId)
        const existGame = rentalId.find(e => e = id)
        console.log(existGame)
        if(existGame){
            await connection.query(`DELETE FROM rentals WHERE id = ${id};`)
        }
}