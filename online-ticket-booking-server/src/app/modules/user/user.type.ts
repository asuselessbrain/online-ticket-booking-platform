export enum UserRole {
	USER = 'user',
	VENDOR = 'vendor',
	ADMIN = 'admin',
}

export interface IUser {
	name: string;
	email: string;
	password: string;
	role?: UserRole;
	imageUrl: string;
	isFraud?: boolean;
}