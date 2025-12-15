import { Request, Response } from "express";
import { IUser } from "./user.type";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const userData: IUser = req.body;
        console.log(userData)
        const newUser = await UserService.createUserIntoDB(userData);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

export const UserController = {
    createUser,
};