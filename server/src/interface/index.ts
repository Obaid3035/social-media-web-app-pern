import {Router, Request} from 'express';
import User from "../entities/User";

export interface IController {
    path: string,
    router: Router
}

export interface IUserResponse {
    token: string,
    auth: boolean
}

export interface IRequest extends Request{
    user: User
}

export interface ICreateResponse {
    saved: true
}
