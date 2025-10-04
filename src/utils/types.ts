

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

export interface ProductTypes {
    _id:string;
    name:string;
    price:number;
    brand:string;
    category:"protein"|"pre-workout"|"vitamins"|"creatine"|"other";
    size:number;
    tag:string[];
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
    numReviews: number;
    flavor?:string;
    warning?:string[];
};
export type CreateProductFormTypes = Pick<ProductTypes, "name"|"brand"|"category"|"price"|"flavor"|"size"|"tag"|"weight"|"warning">;
export type UpdateProductFormTypes = Partial<Pick<ProductTypes, "name"|"brand"|"category"|"price"|"flavor"|"size"|"tag"|"weight"|"warning">>;

export type LocalCartTypes = (Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images"|"size">&{quantity: number;});
export interface CartTypes{
    userID:string;
    products:{
        productID:string;
        quantity:number;
    }[];
    totalPrice:number;
};
export interface CartTypesPopulated {
  userID: string;
  products: {
    productID: Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images"|"size">;
    quantity: number;
  }[];
  totalPrice: number;
};
export interface CartTypesFlatted {
  userID: string;
  products: (Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images"|"size">&{quantity: number;})[];
  totalPrice: number;
};
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
    orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
};
export interface OrderTypesPopulates {
    _id:string;
    userID: string;
    products: {
        productID: Pick<ProductTypes, "_id"|"name"|"brand"|"category"|"price"|"weight"|"flavor"|"images"|"size">;
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
    createdAt:string;
    updatedAt:string;
};
export type ReviewTypesPopulated = Pick<ReviewTypes, "rating"|"comment"|"createdAt"|"updatedAt"> & {
    productID:Pick<ProductTypes, "name"|"flavor"|"size"|"weight">;
    userID:Pick<UserTypes, "name">;
};
export type CreateReviewBodyTypes = Pick<ReviewTypes, "rating"|"comment">&{productID:string;};