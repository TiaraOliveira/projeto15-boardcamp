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
export async function getCostumersbyId(req, res){
    const {id} = req.params;
    try {
        const { rows: customer } = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        console.log(customer)
    res.send(customer);
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }
    
}

export async function postCostumers(req, res){
    const newClients = req.body
    const clientsSchema = joi.object({
        name: joi.string().required(),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
        birthday: joi.date().required()
      });
      const { error } = clientsSchema.validate(newClients);
      if (error) {
        return res.sendStatus(400);
      }
    try {
        const customers = await connection.query(`SELECT cpf FROM customers`)
        const customersCPF = customers.rows.map(e => e.cpf)
        const existCPF = customersCPF.find(e => e == newClients.cpf)
        if(existCPF){
            return res.status(409).send("CPF já existe")
        }
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${newClients.name}', '${newClients.phone}', '${newClients.cpf}', '${newClients.birthday}')`)
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send("Erro no servidor") 
    }

}