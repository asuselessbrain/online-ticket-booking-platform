import { config } from "../../../config";
import UserModel from "./user.model";
import { IUser } from "./user.type";
import jwt, { Secret } from 'jsonwebtoken';
import type {StringValue} from 'ms'
import bcrypt, { hash } from 'bcrypt'

const createUserIntoDB = async (userData: IUser)=> {
    const isUserExist = await UserModel.findOne({ email: userData.email });
    if (isUserExist) {
        throw new Error('User already exists with this email');
    }

    const hashedPassword = await hash(userData.password, config.saltRounds)

    userData.password = hashedPassword


    const token = jwt.sign({ email: userData.email, role: userData.role }, config.jwtSecret as Secret, { expiresIn: config.jwtExpiresIn as StringValue })
    const result = await UserModel.create(userData);
    return {token, result};
}


export const UserService = {
    createUserIntoDB,
};