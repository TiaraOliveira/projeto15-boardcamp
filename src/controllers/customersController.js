import connection from '../dbStrategy/postgres.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function getCostumers(req, res){

    const cpf = req.query.cpf;
    console.log(cpf)

    if (cpf){
       
        const { rows: customers } = await connection.query(`
            SELECT * FROM customers 
            WHERE customers.cpf) LIKE $1
        `, [cpf +"%"])
        return res.send(customers)
    }
   
    try {
        const { rows: customers } = await connection.query('SELECT * FROM customers');
    res.send(customers);
    } catch (error) {
        res.status(500).send("Erro no servidor")
    }
}
export async function getCostumersbyId(req, res){
    const id = parseInt(req.params.id);
    try {
        const customersById = await connection.query(`SELECT * FROM customers WHERE customers.id = $1`, [id])
        const customerById = customersById.rows[0];
        if(!customerById) return res.sendStatus(404);
        res.send(customerById);
     } catch (error) {
        res.status(500).send("Erro no servidor")
    }
}

export async function postCostumers(req, res){
    const newClients = req.body
    const day = dayjs().format("YYYY-MM-DD");
    
    const clientsSchema = joi.object({
        name: joi.string().required(),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
        birthday: joi.date().iso().less(day).required()
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

export async function setCostumers(req, res){
    const id = req.params.id;
    const newClients = req.body
    const clientsSchema = joi.object({
        name: joi.string().required(),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
        birthday: joi.date().raw().required()
      });
      const { error } = clientsSchema.validate(newClients);
      if (error) {
        return res.sendStatus(400);
      }
    try {
        const customers = await connection.query(`SELECT cpf FROM customers`)
        const customersCPF = customers.rows.map(e => e.cpf)
        console.log(newClients.cpf)
        const existCPF = customersCPF.find(e => e == newClients.cpf)
        console.log(existCPF)
        if(existCPF != newClients.cpf && existCPF){
            return res.status(409).send("CPF já existe")
        }
        await connection.query(`UPDATE customers SET name='${newClients.name}', phone='${newClients.phone}', cpf='${newClients.cpf}', birthday='${newClients.birthday}' WHERE id = ${id}`)
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send("Erro no servidor") 
    }
}