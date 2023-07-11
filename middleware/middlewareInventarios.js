import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { postInventarios } from '../controller/inventarios.js';
import { putInventarios } from '../controller/inventariosTranslate.js';

const postInventario = (req, res, next) =>{
    try {
        let data = plainToClass(postInventarios, req.body, {excludeExtraneousValues: true});
        req.body = data; 
        next();   
    } catch (error) {
        res.status(error.status).send(error)
    }
}

const putInventario = (req, res, next) => {
    try {
        let data = plainToClass(putInventarios, req.body, {excludeExtraneousValues: true})
        req.body = data
        next();
    } catch (error) {
        res.status(error.status).send(error)
    }
}

export { postInventario, putInventario };