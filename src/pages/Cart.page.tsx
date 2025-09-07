import { useEffect, useState } from "react";
import vite from "/public/vite.svg";
import { type LocalCartTypes } from "../utils/types";
import { NavLink } from "react-router-dom";


function Cart() {
    const [cartData, setCartData] = useState<LocalCartTypes[]>([]);

    function calculateTotalCartValue() {
        return cartData.reduce((acc, iter) => {
            acc += (iter.price * iter.quantity);
            return acc;
        }, 0);
    };

    function fetchLocalCartProducts() {
        const cart = JSON.parse(localStorage.getItem("cart")||"[]");
        return cart;
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
    
    
    useEffect(() => {
        const res = fetchLocalCartProducts();
        setCartData(res);
    }, []);

    
    return(
        <section className="px-2">
            <div className="my-2">
                <div className="text-3xl"><span>Subtotal</span> <span className="font-semibold">{calculateTotalCartValue()}</span>₹</div>
                <div><button className="w-full py-3 mt-2 rounded-4xl bg-yellow-300 text-xl">Proceed to checkout (13 items)</button></div>
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
                                        <div className="flex gap-4 items-center mt-2">
                                            <div>{p.quantity} x</div>
                                            <div className="font-semibold text-[1.4rem]">₹{p.price}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex justify-between items-center gap-4 mt-2">
                                <div className="flex justify-around items-center border-[1px] border-green-500 py-1 rounded-[4px] flex-1/2">
                                    <button className="text-3xl">-</button>
                                    <span className="text-xl">2</span>
                                    <button className="text-3xl">+</button>
                                </div>
                                {/*<button className="border-[1px] border-green-500 text-white bg-green-500 py-2 rounded-[4px] flex-1/2 mr-2">Buy</button>*/}
                                <button className="border-[1px] border-red-500 text-red-500 py-2 rounded-[4px] flex-1/2 text-xl"
                                    onClick={() => removeProductFromLocalCart({_id:p._id})}
                                >Remove</button>
                            </div>
                            
                            <div className="flex justify-between items-center gap-2 mt-2">
                                <button className="border-[1px] border-gray-300 py-2 px-2 rounded-[4px] text-xl"
                                    onClick={() => removeProductFromLocalCart({_id:p._id})}
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