import { useEffect, useState } from "react";
import vite from "/public/vite.svg";
import { type LocalCartTypes } from "../utils/types";
import { NavLink } from "react-router-dom";


function Cart() {
    const [cartData, setCartData] = useState<LocalCartTypes[]>([]);


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
        <section>
            <h1>Cart</h1>
            <div className="">
                {
                    cartData.map((p) => (
                        <div key={p._id} className="border-[1px] border-gray-100 flex gap-2 my-2 px-3 py-4">
                            <div className="w-[20%] bg-gray-100"><img src={vite} alt={vite} className="w-full h-full" /></div>
                            <div className="w-[80%]">
                                <NavLink to={`/single_product/${p._id}`} className="font-semibold text-[1.2rem]  text-gray-700
                                    overflow-hidden 
                                    text-ellipsis 
                                    [display:-webkit-box] 
                                    [-webkit-line-clamp:3] 
                                    [-webkit-box-orient:vertical]
                                    underline
                                    underline-offset-2
                                    border-2
                                ">{p.name} {p.brand} {p.category} Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, numquam.</NavLink>
                                <div className="flex gap-4 items-center justify-end mt-2">
                                    <div>{p.quantity} x</div>
                                    <div className="font-semibold text-[1.4rem]">₹{p.price}</div>
                                    <button className="border-[1px] border-red-500 text-red-500 py-1 px-3 rounded-[4px]"
                                        onClick={() => removeProductFromLocalCart({_id:p._id})}
                                    >Remove</button>
                                    <button className="border-[1px] border-green-500 text-white bg-green-500 py-1 px-3 rounded-[4px] mr-2">Buy</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
};

export default Cart;