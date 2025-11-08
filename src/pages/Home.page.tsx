import { useState, type MouseEvent } from "react";
import { addToWishlist } from "../apis/wishlist.api";
import {HomeProducts, BestSellers, FeatureProducts} from "../components/HomeProducts.component";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { addToCart } from "../apis/cart.api";
import type { buttonNames } from "../utils/constants";
import type { ProductTypes } from "../utils/types";


function Home() {
    const {cartData, setCartData, setWishlistData, addToLocalCart} = useCart();
    const {isUserAuthenticated} = useUser();
    const [isCartMutating, setIsCartMutating] = useState<boolean>(false);


    async function addToWishlistHandler(selectedProduct:{_id:string; name:string; brand:string; category:ProductTypes["category"]; images:string[]; price:number;}) {
        const res = await addToWishlist({productID:selectedProduct._id});
        if (res.success) {
            setWishlistData((prev) => {
                if (res.jsonData.operation === 1) {
                    return [...prev, selectedProduct];
                }
                else if (res.jsonData.operation === -1) {
                    return prev.filter((p) => p._id !== res.jsonData.productID);
                }
                else{
                    return prev;
                }
            })
        }
    };

    async function addToCartHandler({productID}:{productID:string}) {
        try {
            setIsCartMutating(true);
            const res = await addToCart({productID, quantity:1});
    
            if (cartData.length === 0) {
                setCartData([{...res.jsonData.products, quantity:res.jsonData.quantity}]);
            }
            else{
                setCartData((prev) => {
                    const findResult = prev.find(p => p._id === res.jsonData.products._id);
    
                    if (findResult) {
                        return prev.map((p) => p._id === res.jsonData.products._id?{...p, quantity:res.jsonData.quantity}:p);
                    }
                    else{
                        return [...prev, {...res.jsonData.products, quantity:res.jsonData.quantity}];
                    }
                });
            }
        } catch (error) {
            console.log("failed to mutate cart");
            console.log(error);
        }
        finally{
            setIsCartMutating(false);
        }
    };

    async function onClickEventHandlers(e:MouseEvent<HTMLElement>) {
        const buttonData = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("data-set");
        const buttonName = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("name") as (keyof(typeof buttonNames));

        if (!buttonData) throw Error("nothing will happen because buttonData is undefined");
        const parsedData = JSON.parse(buttonData);
        if (!parsedData?._id) throw Error("nothing will happen because productID is undefined");

        if (buttonName === "addToCartHandler") {
            if (isUserAuthenticated()) {
                addToCartHandler({productID:parsedData});
            }
            else{
                addToLocalCart(parsedData);
            }
        }
        else if(buttonName === "addToWishlistHandler"){
            addToWishlistHandler(parsedData);
        }
        
    }
    
    return(
        <section onClick={onClickEventHandlers}>
            <HomeProducts isCartMutating={isCartMutating} />

            
            <BestSellers isCartMutating={isCartMutating} />

            
            <FeatureProducts isCartMutating={isCartMutating} />
        </section>
    )
};

export default Home;