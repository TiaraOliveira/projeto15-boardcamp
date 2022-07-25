import connection from '../dbStrategy/postgres.js';
import joi from 'joi';

export async function getCategorie(req, res){
    const { rows: categories } = await connection.query('SELECT * FROM categories');
    res.send(categories);
}

export async function postCategories(req, res){
    const newCategories = req.body;
    const entrySchema = joi.object({
        name: joi.string().required()
    });
    const { error } = entrySchema.validate(newCategories);
    if (error) {
        return res.sendStatus(400);
    }
     
    try {
        const categories = await connection.query(`SELECT name FROM categories`)
        const categoriesName = categories.rows.map(e => e.name)
        const newCategoriesName = (newCategories.name).toLowerCase()
        const existName = categoriesName.find(e => e == newCategoriesName)
        if(existName){
            return res.status(409).send("Categoria já existe")
        }
        await connection.query(`INSERT INTO categories (name) VALUES ('${newCategoriesName}');`)
        res.status(200).send("Categoria cadastrado com sucesso");
    } catch (error) {
        console.log(error)
        res.status(500).send("Erro no servidor")
    }
}