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


    
    const result = await UserModel.create(userData);
    const token = jwt.sign({ email: result.email, role: result.role }, config.jwtSecret as Secret, { expiresIn: config.jwtExpiresIn as StringValue })
    const createdUser = result.toObject();
    const { password, ...userDataWithoutPassword } = createdUser;
    return {token, user: userDataWithoutPassword};
}

const loginUser = async (payload: { email: string; password: string }) => {
    const existingUser = await UserModel.findOne({ email: payload.email });
    if (!existingUser) {
        throw new Error('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(payload.password, existingUser.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ email: existingUser.email, role: existingUser.role }, config.jwtSecret as Secret, { expiresIn: config.jwtExpiresIn as StringValue });
    const userData = existingUser.toObject();
    const { password, ...userDataWithoutPassword } = userData;

    return { token, user: userDataWithoutPassword };
}

const getUserRole = async(email: string): Promise<string | null> => {
    const user =  await UserModel.findOne({ email }, { role: 1, _id: 0 });
    return user?.role || null;
}

const getSingleUser = async(email: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ email }, { password: 0 });
    return user;
}

const getAllUsers = async (params: { page: number; limit: number; searchTerm?: string; role?: string }) => {
    const { page, limit, searchTerm, role } = params;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (searchTerm) {
        query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    if (role) {
        query.role = role;
    }

    const users = await UserModel.find(query, { password: 0 })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments(query);

    return {
        data: users,
        meta: { page, limit, total }
    };
}

const updateUser = async (userId: string, updateData: Partial<IUser>) => {
    const allowedUpdates = ['name', 'imageUrl', 'role'];
    const updates: any = {};

    Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = updateData[key as keyof IUser];
        }
    });

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        updates,
        { new: true, select: '-password' }
    );

    if (!updatedUser) {
        throw new Error('User not found');
    }

    return updatedUser;
}

const updateFraudStatus = async (userId: string, isFraud: boolean) => {
    const user = await UserModel.findById(userId);
    
    if (!user) {
        throw new Error('User not found');
    }

    if (user.role !== 'vendor') {
        throw new Error('Only vendors can be marked as fraud');
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isFraud },
        { new: true, select: '-password' }
    );

    return updatedUser;
}


export const UserService = {
    createUserIntoDB,
    loginUser,
    getUserRole,
    getSingleUser,
    getAllUsers,
    updateUser,
    updateFraudStatus
};