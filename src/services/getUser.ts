import User from '../models/user.model';

export default async function getUserById(googleId: string) {
    return User.findOne({ googleId });
}
