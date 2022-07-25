import connection from '../dbStrategy/postgres.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function getRental(req, res){
    const customerId = req.query.customerId;
    if (customerId){
        const { rows: rental } = await connection.query(`
                SELECT r.*,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name 
                    ) AS customer,
            jsonb_build_object(
                'id', g.id,
                'name', g.name,
                'categoryId', g."categoryId",
                'categoryName', cat.name
        ) AS game
        
        FROM rentals r
        JOIN games g on g.id = r."gameId"
        JOIN customers c on c.id = r."customerId"
        JOIN categories cat ON g."categoryId" = cat.id 
        WHERE r."customerId" = $1;`, [customerId]
        )
        return res.send(rental)
    }
   
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
      

    
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }
}

export async function postRental(req, res){
    const newRental = req.body
    const rentalSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.string().min(1).required()
      });
     const { error } = rentalSchema.validate(newRental);
      if (error) {
        return res.sendStatus(400);
      }
        const day = dayjs().format("YYYY-MM-DD");
        const{ rows: priceGame } = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1`, [newRental.gameId])
        const price = priceGame[0].pricePerDay
        const priceRental = (parseInt(price) * parseInt(newRental.daysRented))

        const{ rows: stockTotal } = await connection.query(`SELECT "stockTotal" FROM games WHERE id=$1`, [newRental.gameId])
        const stock = stockTotal[0].stockTotal
        console.log(stockTotal)
        if(stock===0){
            return res.sendStatus(400)
        }
    try {
        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ('${newRental.customerId}', '${newRental.gameId}', '${day}', '${newRental.daysRented}', ${priceRental})`)
        await connection.query(`UPDATE games SET "stockTotal"='${stock-1}' WHERE id=$1`, [newRental.gameId])
        res.status(201).send("Game novo inserido")
    } catch (error) {
        
        res.status(500).send("Erro no servidor")
    }

}

export async function deleteRental(req, res){
    const {id} = req.params;
    try {
      
        const {rows:returned} = await connection.query(`SELECT "returnDate" FROM rentals WHERE id=$1`, [id])
        const isReturned = returned[0].returnDate
        if(isReturned==null){
            return res.sendStatus(400)
        }
        const rental = await connection.query(`SELECT id FROM rentals`)
        const rentalId = rental.rows.map(e => e.id)
        const existGame = rentalId.find(e => e = id)
       if(existGame){
                await connection.query(`DELETE FROM rentals WHERE id=$1`, [id])
   
       }
        res.sendStatus(200)
    } catch (error) {
        
        res.sendStatus(500)
    }
    
}


export async function finishRentals(req, res){
    const {id} = req.params;
    const today = dayjs().format("YYYY-MM-DD");
    const idRent = await connection.query(`SELECT id FROM rentals`)
    const customersCPF = idRent.rows.map(e => e.id)
    const existsId = customersCPF.find(e => e == newClients.cpf)
    if(existsId){
        return res.sendStatus(404)
    }
    const {rows:gameId} = await connection.query(`SELECT "gameId" FROM rentals WHERE id=$1`, [id])
    const gameIdValue = gameId[0].gameId
    const{ rows: stockTotal } = await connection.query(`SELECT "stockTotal" FROM games WHERE id=$1`, [gameIdValue])
    const stock = stockTotal[0].stockTotal
   
    const convertmilisindays = 86400000
    const {rows: dayreturn} = await connection.query(`SELECT "daysRented" FROM rentals WHERE id=$1`, [id])
    const delay = dayreturn[0].daysRented
    const rentalday = dayjs().add(delay, 'day').format("YYYY-MM-DD")
    let delayDays = (dayjs(rentalday).diff(today))/convertmilisindays
    const {rows: price} = await connection.query(`SELECT "originalPrice" FROM rentals WHERE id=$1`, [id])
    const priceday = price[0].originalPrice
    const fee = delayDays * priceday

    if(delayDays > 0){
        await connection.query(`UPDATE rentals SET "delayFee"='${fee}' WHERE id=$1`, [id])
     
    }
    
        try {
            await connection.query(`UPDATE rentals SET "returnDate"='${today}' WHERE id=$1`, [id])
            await connection.query(`UPDATE games SET "stockTotal"='${stock+1}' WHERE id=$1`, [gameIdValue])
            res.sendStatus(201)
        } catch (error) {
            console.log(error)
            res.status(500).send("Erro no servidor") 
        }
}
