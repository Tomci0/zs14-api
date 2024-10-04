import { ObjectId } from 'mongoose';

export interface IUser {
    _id?: ObjectId;
    googleId?: string;
    email?: string;
    name: string;
    password?: string;
    image: string;
    isTeacher?: boolean;
    isAdmin?: boolean;
    disabled?: boolean;
}

export interface ISubject {
    _id: ObjectId;
    name: string;
}

export interface IConsultation {
    _id?: ObjectId;
    date?: Date;
    time?: number | string;
    subject?: ObjectId | ISubject | string;
    teacher?: ObjectId | IUser;
    building?: ObjectId | IBuilding | string;
    room?: ObjectId | IRoom | string;
    color?: string;
    max_students?: number;
    students?: IUser[] | ObjectId[];
    end_signing_up?: Date;
    description?: string;
    scopes?: ObjectId[] | IScope[];
}

export interface IBuilding {
    _id: ObjectId;
    name: string;
}

export interface IClass {
    _id: ObjectId;
    symbol: string;
    numbr: number;
    teacher: ObjectId | IUser;
}

export interface IRegistration {
    _id: ObjectId;
    userId: ObjectId | IUser;
    consultationId: ObjectId | IConsultation;
    date: Date;
    reason: string;
    scopes: ObjectId[];
}

export interface IRoom {
    _id: ObjectId;
    name: string;
    building: ObjectId | IBuilding;
}

export interface IScope {
    _id: ObjectId;
    name: string;
    description: string;
    subject: ObjectId;
    teacher: ObjectId;
    type: ObjectId;
}

export interface IScopeType {
    name: string;
    test: boolean;
    shorttest: boolean;
    practise: boolean;
}

export default { IUser, ISubject, IConsultation, IBuilding, IClass, IRegistration, IRoom, IScope, IScopeType };
