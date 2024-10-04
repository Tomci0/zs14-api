import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';

import bcrypt from 'bcrypt';

import getUserById from '../services/getUser';
import insertUser from '../services/insertUser';
import { IUser } from '../types/types';
import AppError from '../utils/appError';

import User from '../models/user.model';

const GoogleStrategy = passportGoogle.Strategy;

export function useGoogleStrategy() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID || '',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
                callbackURL: process.env.GOOGLE_REDIRECT_URL || '',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    if (!profile.id) throw 'User does not have id. Try Again.';

                    let user = await getUserById(profile.id);

                    if (user) {
                        const userData = {
                            _id: user._id,
                            googleId: user.googleId,
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            isTeacher: user.isTeacher,
                            isAdmin: user.isAdmin,
                            disabled: user.disabled,
                            isLogged: true,
                        } as IUser;
                        done(null, userData);
                    } else {
                        const newUser: IUser = {
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails ? profile.emails[0].value : '',
                            image: profile.photos ? profile.photos[0].value : '',
                        };

                        const newUserObject = await insertUser(newUser);
                        const userData = {
                            _id: newUserObject._id,
                            googleId: newUserObject.googleId,
                            email: newUserObject.email,
                            name: newUserObject.name,
                            image: newUserObject.image,
                            isTeacher: newUserObject.isTeacher,
                            isAdmin: newUserObject.isAdmin,
                            disabled: newUserObject.disabled,
                            isLogged: true,
                        } as IUser;

                        done(null, userData);
                    }
                } catch (err: any) {
                    console.error(err);
                    done(new AppError('Wystąpił błąd', 501));
                }
            }
        )
    );

    passport.serializeUser(function (user: Express.User, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user: Express.User, done) {
        done(null, user);
    });
}

export function useLocalStrategy() {
    passport.use(
        new LocalStrategy(async function (username, password, done) {
            try {
                if (username == '' || password == '') {
                    return done(new AppError('Niepoprawny adres e-mail lub hasło.', 200));
                }

                const userData: IUser | null = await User.findOne({ email: username });

                if (!userData) {
                    return done(new AppError('Niepoprawny adres e-mail lub hasło.', 200));
                }

                if (!userData.password) {
                    return done(new AppError('Niepoprawny adres e-mail lub hasło.', 200));
                }

                if (userData.disabled) {
                    return done(new AppError('Niepoprawny adres e-mail lub hasło.', 200));
                }

                const isPasswordCorrect = await bcrypt.compare(password, userData.password);
                if (!isPasswordCorrect) {
                    return done(new AppError('Niepoprawny adres e-mail lub hasło.', 200));
                }

                const user = {
                    _id: userData._id,
                    googleId: userData.googleId,
                    email: userData.email,
                    name: userData.name,
                    image: userData.image,
                    isTeacher: userData.isTeacher,
                    isAdmin: userData.isAdmin,
                    disabled: userData.disabled,
                    isLogged: true,
                } as IUser;

                return done(null, user);
            } catch (err) {
                console.error(err);
                return done(new AppError('Error with finding user', 500));
            }
        })
    );
}
