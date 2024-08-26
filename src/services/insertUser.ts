import User from '../models/user.model';
import { IUser } from '../types/types';

export default async function insertUser(newUser: IUser) {
    return User.create(newUser);
}
