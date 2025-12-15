
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser, UserRole } from './user.type';


const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
		imageUrl: { type: String, default: '' },
	},
	{ timestamps: true }
);

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
