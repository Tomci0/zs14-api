import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';

import getUserById from '../services/getUser';
import insertUser from '../services/insertUser';
import { IUser } from '../types/types';
import AppError from '../utils/appError';

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

    https: passport.serializeUser(function (user: Express.User, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user: Express.User, done) {
        done(null, user);
    });
}
