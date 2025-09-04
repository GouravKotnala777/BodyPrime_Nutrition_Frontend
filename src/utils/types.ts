

export interface UserTypes{
    name:string;
    email:string;
    password?:string;
    mobile:string;
    gender:"male"|"female"|"other";
    role:"user"|"admin"|"developer";
    isVerified:boolean;
    emailVerificationToken?:string|null;
    emailVerificationTokenExpire?:number|null;
};
export type LoginFormTypes = Required<Pick<UserTypes, "email"|"password">>;
export type RegisterFormTypes = Required<Pick<UserTypes, "name"|"email"|"mobile"|"gender"|"password">>;