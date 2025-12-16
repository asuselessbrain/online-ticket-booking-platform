import { Request, Response } from "express";
import { IUser } from "./user.type";
import { UserService } from "./user.service";
import { config } from "../../../config";

const parseDurationToMs = (duration: string | undefined) => {
    if (!duration) return undefined;
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return undefined;

    const value = Number(match[1]);
    const unit = match[2] as string;

    const multiplierMap: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    const multiplier = multiplierMap[unit];
    if (!multiplier) return undefined;
    return value * multiplier;
};

const buildCookieOptions = () => {
    const maxAge = parseDurationToMs(config.jwtExpiresIn);
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const,
        maxAge,
    };
};

const createUser = async (req: Request, res: Response) => {
    try {
        const userData: IUser = req.body;
        const newUser = await UserService.createUserIntoDB(userData);
        res.cookie("accessToken", newUser.token, buildCookieOptions());
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

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const authenticatedUser = await UserService.loginUser({ email, password });

        res.cookie("accessToken", authenticatedUser.token, buildCookieOptions());

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: authenticatedUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const userRole = async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        const role = await UserService.getUserRole(email as string);

        res.status(200).json({
            success: true,
            message: 'User role fetched successfully',
            data: { role },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        const user = await UserService.getSingleUser(email as string);

        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchTerm = req.query.searchTerm as string;
        const role = req.query.role as string;

        const result = await UserService.getAllUsers({ page, limit, searchTerm, role });

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;
        const updateData = req.body;

        const updatedUser = await UserService.updateUser(userId, updateData);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error as Error).message,
        });
    }
}

const updateFraudStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;
        const { isFraud } = req.body;

        const updatedUser = await UserService.updateFraudStatus(userId, isFraud);

        res.status(200).json({
            success: true,
            message: 'Fraud status updated successfully',
            data: updatedUser,
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
    loginUser,
    userRole,
    getSingleUser,
    getAllUsers,
    updateUser,
    updateFraudStatus,
};
