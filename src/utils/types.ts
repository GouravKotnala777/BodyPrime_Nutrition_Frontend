//import type { ProductVariantOptionsInterface } from "../components/ProductCard.component";

export interface UserTypes{
    _id:string;
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
export type UpdateProfileFormType = Partial<Pick<UserTypes, "name"|"gender"|"mobile">>;

export interface ProductVariantInterface{
    _id:string;
    price:number;
    description:string;
    flavor:string;
    weights:string[];
    warnings:string[];
    stock:number;
    soldCount:number;
    images?: string[];
    dietaryType:"veg"|"nonveg"|"vegan";
    tags:string[];
};
export interface ProductTypes {
    _id:string;
    name:string;
    price:number;
    brand:string;
    category:"protein"|"pre-workout"|"vitamins"|"creatine"|"other";
    subCategory:string;
    //size:number;
    tags:string[];
    description?: string;
    images: string[];
    stock?: number;
    weight: string;
    ingredients?: string[];
    nutritionFacts?: {
        servingSize?: string;
        servingsPerContainer?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
        calories?: number;
    };
    rating: number;
    avgRating:number;
    numReviews: number;
    dietaryType:"veg"|"nonveg"|"vegan";
    flavor:string;
    warnings?:string[];
    variants:string[];
};
export type CreateProductFormTypes = Pick<ProductTypes, "name"|"brand"|"category"|"subCategory"|"price"|"flavor"|"description"|"dietaryType"|"tags"|"weight"|"warnings">;
export type UpdateProductFormTypes = Partial<Pick<ProductTypes, "name"|"brand"|"category"|"subCategory"|"price"|"flavor"|"description"|"dietaryType"|"tags"|"weight"|"warnings">>;

export type LocalCartTypes = (Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images">&{quantity: number; variant:string;});
export interface CartTypes{
    userID:string;
    products:{
        productID:string;
        quantity:number;
        variant:string;
    }[];
    totalPrice:number;
};
export interface CartTypesPopulated {
  userID: string;
  products: {
    productID: Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images"|"dietaryType">;
    quantity: number;
    variant:string;
  }[];
  totalPrice: number;
};
export interface CartTypesFlatted {
  userID: string;
  products: (Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images"|"dietaryType">&{variant:string; quantity: number;})[];
  totalPrice: number;
};
export type WishlistTypes = Omit<LocalCartTypes, "flavor"|"weight"|"size"|"quantity">;
export interface WishlistTypesPopulated {
    userID: string;
    products: {
        productID: Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images"|"dietaryType">;
        variant:string;
    }[];
}
export interface WishlistTypesFlatted {
  userID: string;
  products: (Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images"|"dietaryType">&{variant:string;})[];
};
export type OrderStatusTypes =  "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export interface OrderTypes {
    _id:string;
    userID: string;
    products: {
        productID: string;
        name:string;
        price:number;
        quantity: number;
    }[];
    shippingInfo: {
        address: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        phone: string;
    };
    paymentInfo: {
        method: "COD" | "Stripe";
        transactionID?: string;
        status: "pending" | "paid" | "failed" | "refunded";
    };
    priceSummary: {
        itemsPrice: number;
        taxPrice: number;
        shippingPrice: number;
        discount: number;
        totalPrice: number;
    };
    orderStatus:OrderStatusTypes;
    deliveredAt?: Date;
    otp?:string;
    otpExpiryTime:Date|null;
    createdAt: Date;
    updatedAt: Date;
};
export interface OrderTypesPopulates {
    _id:string;
    userID:{
        _id:string;
        name:string;
        email:string;
        mobile:string;
    };
    products: {
        productID: Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images">;
        name:string;
        price:number;
        quantity: number;
    }[];
    shippingInfo: {
        address: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        phone: string;
    };
    paymentInfo: {
        method: "COD" | "Stripe";
        transactionID?: string;
        status: "pending" | "paid" | "failed" | "refunded";
    };
    priceSummary: {
        itemsPrice: number;
        taxPrice: number;
        shippingPrice: number;
        discount: number;
        totalPrice: number;
    };
    orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    deliveredAt?: Date;
    otp?:string;
    otpExpiryTime:Date|null;
    createdAt: Date;
    updatedAt: Date;
};
export type PaymentStatusType = "canceled"|"processing"|"requires_action"|"requires_capture"|"requires_confirmation"|"requires_payment_method"|"succeeded"|"refunded";
export interface CreateOrderFormType{
    products:{
        productID:string;
        name:string;
        price:number;
        quantity: number;
    }[];
    address:string; city:string; state:string; country:string; pincode:string;
    method:"COD"|"Stripe"; transactionID?:string; status:PaymentStatusType;
    itemsPrice:number; taxPrice:number; shippingPrice:number; discount:number; totalPrice:number;
    phone:string;
    orderStatus:"pending"|"processing"|"shipped"|"delivered"|"cancelled";
};
export interface ReviewTypes {
    productID:string;
    userID:string;
    rating:number;
    comment?:string;
    isVerifiedPurchase:boolean;
    createdAt:string;
    updatedAt:string;
};
export type ReviewTypesPopulated = Pick<ReviewTypes, "rating"|"comment"|"isVerifiedPurchase"|"createdAt"|"updatedAt"> & {
    productID:Pick<ProductTypes, "name"|"flavor"|"weight">;
    userID:Pick<UserTypes, "name">;
};
export type CreateReviewBodyTypes = Pick<ReviewTypes, "rating"|"comment">&{productID:string;};