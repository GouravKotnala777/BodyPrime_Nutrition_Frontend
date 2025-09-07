

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


export interface ProductTypes {
    _id:string;
    name:string;
    price:number;
    brand:string;
    category:"protein"|"pre-workout"|"vitamins"|"creatine"|"other";
    size:number;
    tag:string[];
    description: string;
    images: string[];
    stock: number;
    weight: string;
    ingredients?: string[];
    nutritionFacts?: {
        servingSize: string;
        servingsPerContainer: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        calories?: number;
    };
    rating: number;
    numReviews: number;
    flavor?:string;
    warning?:string[];
};

export interface LocalCartTypes{
    _id:string;
    name:string;
    brand:string;
    category:string;
    price:number;
    quantity:number;
};

export interface ReviewTypes {
    productID:string;
    userID:string;
    rating:number;
    comment?:string;
    createdAt:string;
    updatedAt:string;
};
export type ReviewTypesPopulated = Pick<ReviewTypes, "rating"|"comment"|"createdAt"|"updatedAt"> & {
    productID:Pick<ProductTypes, "name"|"flavor"|"size"|"weight">;
    userID:Pick<UserTypes, "name">;
};
export type CreateReviewBodyTypes = Pick<ReviewTypes, "rating"|"comment">&{productID:string;};