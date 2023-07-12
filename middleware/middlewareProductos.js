import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { postProductos } from '../controller/productos.js';

const postProducto = (req, res, next) => {
    try {
        let data = plainToClass(postProductos, req.body, {excludeExtraneousValues: true});
        req.body = data;
        next();
    } catch (error) {
        res.status(error.status).send(error);
    }
}

export default postProducto;