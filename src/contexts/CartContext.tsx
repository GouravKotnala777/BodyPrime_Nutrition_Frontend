import { createContext, useContext, useState, type ChangeEvent, type MouseEvent, type ReactNode } from "react";
import type { LocalCartTypes } from "../utils/types";


interface CartContextPropTypes{
    cartData:LocalCartTypes[];
    addToLocalCart:(product:LocalCartTypes)=>void;
    fetchLocalCartProducts:()=>void;
    removeProductFromLocalCart:({_id}:{_id:string;})=>void;
    changeLocalCartProductQuantity:(e:(MouseEvent<HTMLButtonElement>|ChangeEvent<HTMLInputElement>), productId:string)=>void;
    calculateTotalCartItems:()=>number;
    calculateTotalCartValue:()=>number;
}

const CartContext = createContext<CartContextPropTypes|null>(null);

export function CartProvider({children}:{children:ReactNode;}) {
    const [cartData, setCartData] = useState<LocalCartTypes[]>([]);
    
    function fetchLocalCartProducts() {
        const cart:LocalCartTypes[] = JSON.parse(localStorage.getItem("cart")||"[]");
        setCartData(cart);
    };

    function addToLocalCart({_id, name, brand, category, price, quantity}:LocalCartTypes) {
        try {
            const localStorageCartData = JSON.parse(localStorage.getItem("cart")||"[]") as LocalCartTypes[];

            const isProductExist = localStorageCartData.find((p) => p._id === _id);

            if (isProductExist) {
                isProductExist.quantity+=quantity;
            }
            else{
                localStorageCartData.push({_id, name, brand, category, price, quantity});
            }
            
            localStorage.setItem("cart", JSON.stringify(localStorageCartData));
            setCartData(localStorageCartData);
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    function removeProductFromLocalCart({_id}:{_id:string}) {
        
        setCartData((prev) => {
            const selectedProduct = prev.find((product) => product._id === _id);
            if (!selectedProduct) {
                console.warn("selectedProduct not found");                
                return prev;
            };
            
            let updatedCart;
            if (selectedProduct.quantity > 1) {
                updatedCart = prev.map((product) => product._id === _id ?
                {...product, quantity:product.quantity-1}
                :
                product);
            }
            else{
                updatedCart = prev.filter((product) => product._id !== _id);
            };

            console.log(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            return updatedCart;
        });
    };

    function changeLocalCartProductQuantity(e:(MouseEvent<HTMLButtonElement>|ChangeEvent<HTMLInputElement>), productId:string) {
        const eventName = e.currentTarget.name;
        let eventValue = e.currentTarget.value;
        const step = eventName || eventValue;

        const targetedProduct = cartData.find((p) => p._id === productId);       

        if (!targetedProduct) throw Error("targetedProduct nahi mil raha");
        if (typeof Number(eventValue) !== "number" || isNaN(Number(eventValue))) throw Error("targetedProduct ki quantity number honi chahiye");
        if (Number(eventValue) > 10) throw Error("targetedProduct ki quantity 10 se jyada nahi ho sakti 1");
        if (Number(eventValue) <= 0 && Number(eventName) <= 0 && targetedProduct.quantity <= 0 && targetedProduct.quantity > 10) throw Error("targetedProduct ki quantity 0 ya 0 se kam nahi ho sakti 1");
        if (targetedProduct.quantity + Number(eventName) < 0) throw Error("targetedProduct ki quantity 0 ya 0 se kam nahi ho sakti 2");
        if (targetedProduct.quantity + Number(eventName) > 10) throw Error("targetedProduct ki quantity 10 se jyada nahi ho sakti 2");

        
        setCartData((prev) => {
            const updatedCart = prev.reduce((acc, p) => {
                if (p._id === productId) {
                    const newQuantity = p.quantity + Number(step);
                    if (p.quantity >= 1 && p.quantity <= 10 && Number(eventValue) > 0) {
                        acc.push({...p, quantity:Number(step)});
                    }

                    if (p.quantity > 1 && p.quantity - Number(step) <= 10 && p.quantity - Number(step) > 0 && Number(step) > 1 && !Number(eventValue)) {
                        acc.push({...p, quantity:Number(step)})
                    }
                    if (newQuantity > 0 && !Number(eventValue)) {
                        acc.push({...p, quantity:newQuantity})
                    }
                }
                else{
                    acc.push(p);
                }
                return acc;
            }, [] as LocalCartTypes[]);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });

    };
    


    function calculateTotalCartItems() {
        return cartData.reduce((acc, iter) => {
            acc += iter.quantity;
            return acc;
        }, 0);
    };
    
    function calculateTotalCartValue() {
        return cartData.reduce((acc, iter) => {
            acc += (iter.price * iter.quantity);
            return acc;
        }, 0);
    };

    
    return(
        <CartContext.Provider value={{cartData, fetchLocalCartProducts, addToLocalCart, removeProductFromLocalCart, changeLocalCartProductQuantity, calculateTotalCartItems, calculateTotalCartValue}}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be provide inside CartProvider");
    }
    return context;
};