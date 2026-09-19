import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
//import ImageWithFallback from "../components/ImageWithFallback.component";
import { addToCart } from "../apis/cart.api";
import { addToWishlist } from "../apis/wishlist.api";
//import { useState } from "react";
//import Spinner from "../components/Spinner.component";
import { converKgtolbs } from "../utils/functions";
import Skeletan from "../components/Skeletan";

const off = 20;
function Wishlist() {
    const {wishlistData, setWishlistData, cartData, setCartData} = useCart();
    //const [targetedProduct, setTargetedProduct] = useState<string>("");
    //const [processState, setProcessState] = useState<"loading"|"success"|"error"|null>(null);
    const navigate = useNavigate();
    //const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:false, isSuccess:true, error:""});


    //function clicked(state:"success"|"error") {
    //    setProcessState("loading");
    //    setTimeout(() => {
    //        if (state === "error") {
    //            setProcessState("error");
    //            setTimeout(() => {
    //                setProcessState(null);
    //            }, 1000)
    //        }
    //        else{
    //            setProcessState("success");
                
    //            setTimeout(() => {
    //                setProcessState(null);
    //            }, 1000)
    //        }
    //    }, 2000);
    //};

    async function transferProductToCartHandler({productID, variant}:{productID:string; variant:string;}) {
        try {
            //setTargetedProduct(productID);
            const res = await addToCart({productID, variant, quantity:1});

            if (res.success) {
                const res2 = await addToWishlist({productID, variant});

                if (res2.success) {
                    setWishlistData(wishlistData.filter((p) => (p._id !== productID && p.variant !== variant)));
                    setCartData((prev) => {
                        const doesExistInWishlist = wishlistData.find((p) => (p._id === productID && p.variant === variant));
                        const doesExistInCart = cartData.find((p) => (p._id === productID && p.variant === variant));

                        if (!doesExistInWishlist) throw Error("productID not found in wishlist");

                        const flavor = doesExistInWishlist.variant.split("#")[1];
                        const weight = doesExistInWishlist.variant.split("#")[2];
                        const price = Number(doesExistInWishlist.variant.split("#")[3]);

                        if (!doesExistInCart) {
                            return [...prev, {
                                _id:doesExistInWishlist._id,
                                brand:doesExistInWishlist.brand,
                                category:doesExistInWishlist.category,
                                images:doesExistInWishlist.images,
                                name:doesExistInWishlist.name,
                                price,
                                quantity:1,
                                variant,
                                flavor,
                                weight
                            }];
                        }
                        else{
                            return prev.map((p) => (
                                (p._id === doesExistInCart._id && p.variant === doesExistInCart.variant) ?
                                {...p, quantity:doesExistInCart.quantity+1}
                                :
                                p
                            ))
                        }
                        

                    });
                }          
            }         
        } catch (error) {
            console.log(error);
            throw Error("FFFFFFFFFFFFFFFFFFFFFFFFFF")            
        }
        finally{
            //setTargetedProduct("");
        }
    };

    async function removeFromWishlistHandler({productID, variant}:{productID:string; variant:string;}) {
        const res = await addToWishlist({productID, variant});

        if (res.success) {
            setWishlistData(wishlistData.filter((p) => (p._id === productID && p.variant !== variant)));
        }
    };

    
    
    return(
        <section className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 relative">
                {/* left part */}
                {/*<pre>{JSON.stringify(wishlistData, null, `\t`)}</pre>*/}
                <div className="border border-gray-200 flex-1 rounded-xl p-4">
                    <div className="text-gray-400 text-lg font-semibold">Wishlisted Products</div>
                    {
                        wishlistData[0]?._id === "initialProductId" ?
                            [0,1,2].map((iter) => (
                                <div key={iter} className="border-b border-gray-100 flex gap-4 mt-15 pb-4">
                                    <div className="relative size-35 group">
                                        <div className="w-full h-full rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="w-full h-full bg-pink-200 grid place-items-center rounded-md absolute top-0 left-0 opacity-0">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                fill="none"
                                                stroke="currentColor"
                                                className="size-6"
                                            >
                                                <path
                                                    pathLength="1"
                                                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                    className="
                                                        fill-none
                                                        stroke-current
                                                        [stroke-dasharray:1]
                                                        [stroke-dashoffset:1]
                                                        transition-[stroke-dashoffset]
                                                        duration-700 delay-200
                                                        group-hover:[stroke-dashoffset:0]
                                                        ease-in-out
                                                    "
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full">
                                        <div className="h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="h-5 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="flex items-center gap-2 h-10 w-35 rounded-md overflow-hidden">
                                            <Skeletan />
                                        </div>
                                        <div className="w-full flex justify-end flex-wrap gap-4">
                                            <div className="h-9 w-45 rounded-md overflow-hidden">
                                                <Skeletan />
                                            </div>
                                            <div className="h-9 w-45 rounded-md overflow-hidden">
                                                <Skeletan />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            :
                            <div>
                                {/*<pre className="text-xs">{JSON.stringify(wishlistData, null, `\t`)}</pre>*/}
                                {
                                    wishlistData.length === 0 ?
                                        <div className="text-center pt-10 max-w-2xl mx-auto">
                                            <img src="/empty_wishlist.webp" alt="/empty_wishlist.webp"
                                                className="w-full max-w-50 h-50 mx-auto"
                                            />
                                            <h3 className="text-2xl text-gray-700 font-semibold mb-2">No Products</h3>
                                            <p className="text-gray-500 mt-0 mb-10">seems like you have not liked anything yet.</p>
                                            <div className="text-center my-8">
                                                <button className="bg-primary-100 hover:bg-primary-50 text-primary-500 font-semibold w-full max-w-50 mx-auto pt-2.75 pb-2.5 rounded-md flex justify-center items-center gap-1 transition-colors ease-out duration-300 group"
                                                    onClick={() => navigate("/home")}
                                                >
                                                    <span className="ml-4 -translate-y-0.5">Continue Shopping</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 group-hover:translate-x-4 ease-out duration-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            {
                                                wishlistData.map((p) => (
                                                    <div className="border-b border-gray-100 flex gap-4 mt-15 pb-4">
                                                        <NavLink to={`/single_product/${p._id}`} target="_blank" className="relative size-35 group">
                                                            <img src="/test-category.webp" alt="/test-category.webp" className="w-full h-full" />
                                                            <div className="w-full h-full bg-pink-200 grid place-items-center rounded-md absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity ease-out duration-300  [box-shadow:0px_0px_5px_2px_white_inset]">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="1.5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    className="size-6"
                                                                >
                                                                    <path
                                                                        pathLength="1"
                                                                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                                        className="
                                                                            fill-none
                                                                            stroke-current
                                                                            [stroke-dasharray:1]
                                                                            [stroke-dashoffset:1]
                                                                            transition-[stroke-dashoffset]
                                                                            duration-700 delay-100
                                                                            group-hover:[stroke-dashoffset:0]
                                                                            ease-in-out
                                                                        "
                                                                    />
                                                                </svg>
                                                                {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-white size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                </svg>*/}
                                                            </div>
                                                        </NavLink>
                                                        <div className="">
                                                            <div className="text-gray-800">{p.name} {p.category} {p.brand} {p.variant.split("#")[1]} {p.variant.split("#")[2]}</div>
                                                            <div className="text-gray-600">{p.variant.split("#")[2]} ({converKgtolbs(p.variant.split("#")[2])} lb), {p.variant.split("#")[1]}</div>
                                                            <div className="flex items-center gap-2 my-2">
                                                                <span><span className="text-gray-700 text-xl">₹</span><span className="text-gray-800 text-2xl font-semibold">{(Number(p.variant.split("#")[3])*(off||100))/100}</span></span>
                                                                {off?<span className="text-gray-400 line-through">₹{p.variant.split("#")[3]}</span>:<></>}
                                                                {off?<span className="text-gray-600">({off}% off)</span>:<></>}
                                                            </div>
                                                            <div className="flex flex-wrap justify-end gap-4">
                                                                
                                                                <button className="border border-gray-200 text-gray-500 bg-gray-50 px-3 pt-1 pb-1.5 rounded-sm hover:opacity-70"
                                                                    onClick={() => transferProductToCartHandler({productID:p._id, variant:p.variant})}
                                                                >Transfer to Cart</button>
                                                                <button className="border border-red-200 text-red-500 bg-red-50 px-3 pt-1 pb-1.5 rounded-sm hover:opacity-70"
                                                                    onClick={() => removeFromWishlistHandler({productID:p._id, variant:p.variant})}
                                                                >Remove from Wishlist</button>
                                                                {/*<button className="border border-red-200 text-red-500 bg-red-50 px-3 py-1 rounded-sm hover:opacity-70" onClick={() => {
                                                                    if (isUserAuthenticated()) {
                                                                        removeFromCartHandler({productID:p._id, variant:p.variant, quantity:p.quantity});
                                                                    }
                                                                    else{
                                                                        removeProductFromLocalCart({_id:p._id, variant:p.variant, quantity:1})
                                                                    }
                                                                }}>Remove</button>*/}
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))
                                            }
                                        </div>

                                }
                            </div>
                    }
                </div>
                {/* right part */}
                <div id="price_details" className="border border-gray-200 min-w-70 h-min rounded-xl sticky top-21 right-0 p-4">{/*give mb-15 sm:mb-0*/}
                    {
                        wishlistData.length === 0 ?
                            <div className="border">
                                <div className="w-70">
                                </div>
                            </div>
                            :
                            <div className="">
                                {/*<div className="text-gray-700 text-lg font-semibold">Price Details</div>
                                <div className="flex items-center gap-2 my-4">
                                    <span className="text-gray-700">Item Total ({wishlistData.length !== 0})</span>
                                    {off?<span className="text-green-700">theek karunga</span>:<></>}
                                    <div className="ml-auto">
                                        <div className="text-gray-700">₹1234</div>
                                        {off?<div className="text-gray-500 line-through">₹3456</div>:<></>}
                                    </div>
                                </div>
                                <div className="flex gap-1 my-5">
                                    <div>
                                        <div className="text-gray-700">Shipping Charges</div>
                                        <div className="text-sm text-gray-500">Free Shipping on orders above ₹350</div>
                                    </div>
                                    <span className="text-gray-500 line-through ml-auto">₹50</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex flex-col gap-2.5 mt-8">
                                    <div className="flex gap-1.5 text-gray-700">
                                        <span>Total Payable</span>
                                        <span className="text-gray-800 text-lg font-semibold">₹5678</span>
                                    </div>
                                    <button className="bg-orange-100 hover:bg-orange-50 text-orange-800 font-semibold w-full py-2.5 rounded-md hidden sm:flex justify-center items-center gap-1 transition-colors ease-out duration-300 group"
                                        //onClick={emitAddressFormModalEvent}
                                    >
                                        <span className="ml-4">Add Address</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 group-hover:translate-x-4 ease-out duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>*/}
                            </div>
                            
                    }
                </div>
            </div>

            {/* bottom fixed container for smaller devices only */}
            {
                wishlistData.length === 0 ?
                    <></>
                    :
                    <div className="bg-white block sm:hidden fixed left-0 bottom-0 w-full px-4 py-2 [box-shadow:0px_0px_10px_2px_var(--color-gray-400)]">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="">
                                    <span className="text-gray-700 text-3xl">₹</span>
                                    <span className="text-gray-800 text-3xl font-bold">10997</span>
                                </span>
                                <button className="text-gray-400 flex items-center"
                                    //onClick={() => handlePageSectionJump("price_details")}
                                >
                                    <span>See Price Details</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 translate-y-0.25">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                            <button className="bg-orange-100 text-orange-800 font-semibold w-50 rounded-md flex justify-center items-center gap-1"
                                //onClick={emitAddressFormModalEvent}
                            >
                                <span className="ml-4">Add Address</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 translate-y-0.25">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
            }
        </section>
















        //<section className="max-w-2xl mx-auto">
        //    <pre className="text-xs">{JSON.stringify(wishlistData, null, `\t`)}</pre>
        //    {
        //        wishlistData.map(({_id, name, brand, category, price, images, variant}) => (
        //            <NavLink to={`/single_product/${_id}`} className="border-b-1 border-gray-200 flex justify-between items-center px-2 py-6" key={_id}>
        //                <div className="w-[30%]">
        //                    {/*<ImageWithFallback
        //                        src={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`}
        //                        alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`}
        //                        //fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
        //                        fallbackSrc="/placeholders/no_product.jpg"
        //                    />*/}
        //                </div>
        //                <div className="w-[60%]">
        //                    <button className="w-[30px] h-[30px] ml-auto mb-10 block bg-gray-100 rounded-[4px]"
        //                        onClick={(e) => {
        //                            e.preventDefault();
        //                            e.stopPropagation();
        //                            removeFromWishlistHandler({productID:_id, variant})
        //                            console.log("removed...");
        //                        }}
        //                    >X</button>
        //                    <div className="text-[1.1rem] font-semibold
        //                        overflow-hidden 
        //                        text-ellipsis 
        //                        [display:-webkit-box] 
        //                        [-webkit-line-clamp:3] 
        //                        [-webkit-box-orient:vertical]
        //                    ">{name} {brand} Beginer's {category}, No Added Sugar, Faster Muscle Recovery & Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis, veniam.</div>
        //                    <div className="text-2xl">{price}<span className="font-light">₹</span></div>
        //                    <button
        //                        className="bg-yellow-300 rounded-2xl py-2 w-full mt-4"
        //                        disabled={targetedProduct === _id}
        //                        onClick={(e) => {
        //                            e.preventDefault();
        //                            e.stopPropagation();
        //                            console.log("transfered");
        //                            transferProductToCartHandler({productID:_id, variant})
        //                        }}
        //                    >{(targetedProduct===_id)?<Spinner width="20px" />:"Tranfer to Cart"}</button>
        //                </div>
        //            </NavLink>
        //        ))
        //    }
        //</section>
    )
};

export default Wishlist;