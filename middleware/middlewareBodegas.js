import 'reflect-metadata';
import { plainToClass } from 'class-transformer';

const postBodegas = (req, res, next) => {
    try {
        let data = plainToClass()
    } catch (error) {
        res.status(error.status).send(error)
    }
}

export default postBodegas;