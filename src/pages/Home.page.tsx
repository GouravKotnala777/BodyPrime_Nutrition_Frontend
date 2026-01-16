import { useState, type MouseEvent } from "react";
import { addToWishlist } from "../apis/wishlist.api";
import {HomeProducts, BestSellers, FeatureProducts} from "../components/HomeProducts.component";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { addToCart } from "../apis/cart.api";
import type { buttonNames } from "../utils/constants";
import type { LocalCartTypes, ProductTypes } from "../utils/types";


function Home() {
    const {cartData, setCartData, setWishlistData, addToLocalCart} = useCart();
    const {isUserAuthenticated} = useUser();
    //const [isCartMutating, setIsCartMutating] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<string|null>(null);

    // ------------  addToWishlistHandler, addToCartHandler and onClickEventHandlers are redeclared at SearchedProducts.page.tsx
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
            setSelectedProduct(productID);
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
            setSelectedProduct(null);
        }
    };
    async function onClickEventHandlers(e:MouseEvent<HTMLElement>) {
        const buttonData = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("data-set");
        const buttonName = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("name") as (keyof(typeof buttonNames));

        if (!buttonData) throw Error("nothing will happen because buttonData is undefined");
        const parsedData = JSON.parse(buttonData) as LocalCartTypes;
        if (!parsedData?._id) throw Error("nothing will happen because productID is undefined");

        if (buttonName === "addToCartHandler") {
            if (isUserAuthenticated()) {
                addToCartHandler({productID:parsedData._id});
            }
            else{
                addToLocalCart({...parsedData, quantity:1});
            }
        }
        else if(buttonName === "addToWishlistHandler"){
            addToWishlistHandler(parsedData);
        }
        
    };
    // ------------
    
    return(
        <section onClick={onClickEventHandlers}>
            <HomeProducts selectedProduct={selectedProduct} />

            
            <BestSellers selectedProduct={selectedProduct} />

            
            <FeatureProducts selectedProduct={selectedProduct} />
        </section>
    )
};

export default Home;