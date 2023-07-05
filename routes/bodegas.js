import dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2';

let storageBodegas = Router();
dotenv.config();

let con = undefined;

storageBodegas.use((req, res, next) => {
    let connect = JSON.parse(process.env.MY_CONNECT)
    con = mysql.createPool(connect);
    next();
})

storageBodegas.get("/", (req, res)=>{
    con.query(
    /*sql*/`SELECT * FROM bodegas ORDER BY nombre ASC`,
    (err, data, fil) => {
        res.send(JSON.stringify(data))
    }) 
})

storageBodegas.post("/", (req, res)=>{

    /* 
    Para agregar un dato a bodegas tiene que hacerlo en este formato 
    los datos se agregan desde el Thunder CLient
    {
        "id": 54,
        "nombre": "bodega JHONNN",
        "id_responsable": 16,
        "estado": 1,
        "created_by": 16,
        "update_by": null,
        "created_at": null,
        "updated_at": null,
        "deleted_at": null
    }
    Recuerde que el id no puede ser repetido ya que es llave primaria 
    */

    let data = Object.values(req.body);

    con.query(
    `INSERT INTO bodegas (id, nombre, id_responsable, estado, created_by, update_by, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    data,

    (err, data, fil) => {
        if(err){
            console.log(err)
            res.status(500).send("Error al guardar los datos")
        } else {
            res.send("Agregado con exito");
        }
    }) 
})

export default storageBodegas;