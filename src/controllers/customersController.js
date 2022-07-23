import connection from '../dbStrategy/postgres.js';
import joi from 'joi';

export async function getCostumers(req, res){
    try {
        const { rows: customers } = await connection.query('SELECT * FROM customers');
    res.send(customers);
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }
    
}

export async function postCostumers(req, res){
    const clients = req.body
    const entrySchema = joi.object({
        name: joi.string().required(),
        cpf: joi.string().length(11).required(),
        phone: joi.string().length(11).required(),
        birthday: joi.date().required()
      });
      const { error } = entrySchema.validate(entry);
      if (error) {
        return res.sendStatus(400);
      }
    //precisa verificar tbem se o CPF já não existe
    try {
        
        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [clients.name, clients.phone, clients.cpf, clients.birthday])
        res.sedStatus(201)
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }

}