import { NextFunction, Request, Response } from "express";
import {secret}  from '../services/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import HTTPError from 'http-errors';


const generateToken = (payload: JwtPayload) => {
    return jwt.sign(payload, secret)
}

const getTokenFrom = (request: Request) => {
    const authorization = request.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {

        return authorization.substring(7);

    } else {
        return null;
    }
}

const tokenVerify = (token: string) => jwt.verify(token, secret);


const validateToken = (req: Request, res: Response, next: NextFunction) => {
    try {

        const token: string | null = getTokenFrom(req);
        console.log(token);

        let email: any = tokenVerify(token);



        if (!token || email!== 'admin') {
            throw new Error ('token invalid or missing');
        }
         else {
            next(HTTPError(401,{error: 'token invalid or missed'}))

        }
    } catch (error:any) {
        res.status(400).send(error.message)
    }

}

export default {
    generateToken,
    validateToken
}