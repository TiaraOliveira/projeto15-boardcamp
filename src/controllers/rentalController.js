import connection from '../dbStrategy/postgres.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function getRental(req, res){
    try {
       const {rows:rental} = await connection.query(
           `
           SELECT r.*,
              
                     jsonb_build_object(
                            'id', c.id,
                            'name', c.name 
                            ) AS customer,
                     jsonb_build_object(
                        'id', g.id,
                        'name', g.name,
                        'categoryId', g."categoryId"
                       
                       
                    ) AS game
                
                FROM rentals r
                 join games g on g.id = r."gameId"
                 join customers c on c.id = r."customerId"
                
           `)
       res.send(rental);
       console.log(rental)

    
    } catch (error) {
        console.log(error)
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