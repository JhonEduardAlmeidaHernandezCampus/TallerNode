import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { postBodegas } from '../controller/bodegas.js';

const postBodega = (req, res, next) => {
    try {
        let data = plainToClass(postBodegas, req.body, {excludeExtraneousValues: true})
        req.body = data;
        next();
    } catch (error) {
        res.status(error.status).send(error)
    }
}

export default postBodega;