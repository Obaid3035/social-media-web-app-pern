import jwt from 'jsonwebtoken'
import User from "../entities/User";
import {NextFunction, Response, Request} from "express";
import { StatusCodes} from "http-status-codes";

const auth = (role: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try{
			const token = req.headers.authorization.split(' ')[1];
			const decode = <any> jwt.verify(token, process.env.JWT_SECRET);
			const user: User = await User.findOne({
				where: {
					id: decode.user.id
				}
			});
			if (!user) {
				res.status(StatusCodes.UNAUTHORIZED).send({error: "Please Authorize Yourself"});
			}
			if (!(user.role === role)) {
				res.status(401).send({
					error: 'Please Authorize Yourself',
				});
			}
			(req as any).user = user;
			next();
		} catch (e) {
			res.status(StatusCodes.UNAUTHORIZED).send({error: "Please Authorize Yourself"});
		}
	};
}

export default auth;
