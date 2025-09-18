import { useEffect } from "react";
import vite from "/public/vite.svg";
import { NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { addToCart, getCart, removeFromCart } from "../apis/cart.api";
import { useUser } from "../contexts/UserContext";
import type { CartTypesFlatted, CartTypesPopulated } from "../utils/types";

function transformCartDataForRes(cartData:CartTypesPopulated) {
    const transformedCartData = cartData.products.reduce((acc, {productID, quantity}) => {
        acc.products.push({
            _id:productID._id,
            name:productID.name,
            brand:productID.brand,
            category:productID.category,
            price:productID.price,
            size:productID.size,
            weight:productID.weight,
            flavor:productID.flavor,
            images:productID.images,
            quantity
        });
        return acc;
    }, {userID:"", products:[], totalPrice:0} as CartTypesFlatted);

    console.log(transformedCartData);
    return transformedCartData;
};

function Cart() {
    const {isUserAuthenticated} = useUser();
    const {cartData, setCartData, changeLocalCartProductQuantity, removeProductFromLocalCart, calculateTotalCartItems, calculateTotalCartValue} = useCart();


    async function addToCartHandler({productID, quantity}:{productID:string; quantity:number;}) {
        const res = await addToCart({productID, quantity});

        const selectedProduct = cartData.find((p) => p._id === res.jsonData.products._id);

        if (!selectedProduct) return Error("selectedProduct not found");

        if (res.jsonData.quantity < 10) {
            setCartData(cartData.map((p) => p._id === res.jsonData.products._id?{...p, quantity:res.jsonData.quantity}:p));
        } else {
            return Error("Cannot add more than 10 products");
        }
        console.log(res);
    };

    async function getCartHandler() {
        const res = await getCart();

        setCartData(transformCartDataForRes(res.jsonData).products);
    };

    async function removeFromCartHandler({productID, quantity}:{productID:string; quantity:number;}) {
        const res = await removeFromCart({productID, quantity});

        const selectedProduct = cartData.find((p) => p._id === res.jsonData.products);

        if (!selectedProduct) return Error("selectedProduct not found");
        if (res.jsonData.quantity < 1) {
            setCartData(cartData.filter(p => p._id !== res.jsonData.products));
        }
        else{
            selectedProduct.quantity = res.jsonData.quantity;
            setCartData(cartData.map(p => p._id === res.jsonData.products?{...p, quantity:res.jsonData.quantity}:p));
            "agar product ki quantity kam hui lekin poora remove nahi hua to usse handle karna hai"
        }        
    };

    useEffect(() => {
        if (isUserAuthenticated()) {
            getCartHandler();
        }
        else{
            //const res = fetchLocalCartProducts();
            //setCartData(res);
        }
    }, []);

    
    return(
        <section className="px-2">
            <div className="my-2">
                <div className="text-3xl"><span>Subtotal</span> <span className="font-semibold">{calculateTotalCartValue()}</span>₹</div>
                <div><button className="w-full py-3 mt-2 rounded-4xl bg-yellow-300 text-xl">Proceed to checkout ({calculateTotalCartItems()} items)</button></div>
            </div>
            <div className="">
                {
                    cartData.map((p) => (
                        <div key={p._id} className="border-[1px] border-gray-100 my-4 py-4">
                            <div className="flex gap-2 my-2 py-4">
                                <div className="w-[20%] bg-gray-100"><img src={vite} alt={vite} className="w-full h-full"/></div>
                                <div className="w-[80%]">    
                                    <div>
                                        <NavLink to={`/single_product/${p._id}`} className="font-semibold text-[1.2rem] text-gray-700
                                            overflow-hidden 
                                            text-ellipsis 
                                            [display:-webkit-box] 
                                            [-webkit-line-clamp:3] 
                                            [-webkit-box-orient:vertical]
                                            underline
                                            underline-offset-2
                                        ">{p.name} {p.brand} {p.category} Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, numquam.</NavLink>
                                        <div className="mt-2">
                                            <div>{p.quantity} x</div>
                                            <div className="font-semibold text-[1.4rem]">₹{p.price}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex justify-between items-center gap-4 mt-2">
                                <div className="flex justify-around items-center border-[1px] border-green-500 py-1 rounded-[4px] flex-1/2">
                                    <button className="text-3xl" name="-1" onClick={(e) => {
                                        if (isUserAuthenticated()) {
                                            removeFromCartHandler({productID:p._id, quantity:1});
                                        }
                                        else{
                                            changeLocalCartProductQuantity(e, p._id);
                                        }
                                    }}>-</button>
                                    <span className="text-xl w-1/3 text-center">{p.quantity.toString()}</span>
                                    <button className="text-3xl" name="1" onClick={(e) => {
                                        if (isUserAuthenticated()) {
                                            addToCartHandler({productID:p._id, quantity:1});
                                        }
                                        else{
                                            changeLocalCartProductQuantity(e, p._id)
                                        }
                                    }}>+</button>
                                </div>
                                {/*<button className="border-[1px] border-green-500 text-white bg-green-500 py-2 rounded-[4px] flex-1/2 mr-2">Buy</button>*/}
                                <button className="border-[1px] border-red-500 text-red-500 py-2 rounded-[4px] flex-1/2 text-xl"
                                    onClick={() => {
                                        if (isUserAuthenticated()) {
                                            removeFromCartHandler({productID:p._id, quantity:p.quantity});
                                        }
                                        else{
                                            removeProductFromLocalCart({_id:p._id})
                                        }
                                    }}
                                >Remove</button>
                            </div>
                            
                            <div className="flex justify-between items-center gap-2 mt-2">
                                <button className="border-[1px] border-gray-300 py-2 px-2 rounded-[4px] text-xl"
                                    //onClick={() => removeProductFromLocalCart({_id:p._id})}
                                >Save for later</button>
                                <button className="border-[1px] border-gray-300 py-2 px-2 rounded-[4px] text-xl">Compare with similar items</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
};

export default Cart;