
import mongoose, { Schema, Model } from 'mongoose';
import { IUser, UserRole } from './user.type';


const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
		imageUrl: { type: String, required: true },
		isFraud: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
