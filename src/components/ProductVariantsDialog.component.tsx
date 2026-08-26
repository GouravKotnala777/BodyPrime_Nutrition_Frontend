import { useEffect, useState, type Dispatch, type MouseEvent, type SetStateAction } from "react";
import type { ProductVariantOptionsInterface } from "./ProductCard.component";
import { NavLink } from "react-router-dom";
import { BsArrowRight, BsCheck, BsExclamation } from "react-icons/bs";
import Spinner from "./Spinner.component";
import { addToCart } from "../apis/cart.api";
import { useUser } from "../contexts/UserContext";
import type { LocalCartTypes, ProductTypes, WishlistTypes } from "../utils/types";
import { addToWishlist } from "../apis/wishlist.api";
import { useCart } from "../contexts/CartContext";

interface ProductVariantDialogPropTypes{
    totalCartItems:number;
    isUserAuthenticated:boolean;
    cartData:LocalCartTypes[];
    setCartData:Dispatch<SetStateAction<LocalCartTypes[]>>;
    setWishlistData:Dispatch<SetStateAction<WishlistTypes[]>>;
    addToLocalCart:(product:LocalCartTypes) => void;
    

}

let num = 0;
function ProductVariantDialog({totalCartItems, addToLocalCart, cartData, isUserAuthenticated, setCartData, setWishlistData}:ProductVariantDialogPropTypes) {
    const [selectedFlavorVariant, setSelectedFlavorVariant] = useState<keyof ProductVariantOptionsInterface["variants"]>("Cold Coffee");
    const [selectedWeightVariant, setSelectedWeightVariant] = useState<{weight:string; index:number;}>({weight:"", index:0});
    const [isProductVariantOptionsOpen, setIsProductVariantOptionsOpen] = useState<boolean>(false);
    const [productVariantOptions, setProductVariantOptions] = useState<ProductVariantOptionsInterface>({img:"test-category.webp", description:"", flavor:"Cold Coffee", variants:{}, product:{_id:"", brand:"", category:"other", images:[], name:"", price:0}});
    const [processState, setProcessState] = useState<"loading"|"success"|"error"|null>(null);
    //const {cartData} = useCart();
    //const {isUserAuthenticated} = useUser();
    //const [isCartMutating, setIsCartMutating] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<string|null>(null);
    const [selectedVariantQty, setSelectedVariantQty] = useState<number>(0);

    
    
    useEffect(() => {
        function handleChildData(event:Event) {
            const customEvent = (event as CustomEvent<ProductVariantOptionsInterface>);
            console.log(customEvent.detail);
            setProductVariantOptions(customEvent.detail);
            setIsProductVariantOptionsOpen(true);
        }
        window.addEventListener("myEvent", handleChildData);

        return() => window.removeEventListener("myEvent", handleChildData);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isProductVariantOptionsOpen ? "hidden" : "auto";
    }, [isProductVariantOptionsOpen]);


    function clicked(state:"success"|"error") {
        setProcessState("loading");
        setTimeout(() => {
            if (state === "error") {
                setProcessState("error");
                setTimeout(() => {
                    setProcessState(null);
                    num++;
                }, 1000)
            }
            else{
                setProcessState("success");
                
                setTimeout(() => {
                    setProcessState(null);
                    num++;
                }, 1000)
            }
        }, 2000);
    };
    

    function isAlreadyInCart() {
        // existing products quantity if exists
        const isExist = cartData.reduce((acc, p) => {
            const variant = `${productVariantOptions.product._id}#${selectedFlavorVariant}#${selectedWeightVariant?.weight}#${productVariantOptions["variants"][selectedFlavorVariant][selectedWeightVariant.index].price}`;
            const productID = productVariantOptions.product._id;
            if (p._id === productID && p.variant === variant) {
                acc=acc+p.quantity;
            }
            return acc;
        }, 0);        
        setSelectedVariantQty(isExist);
    };

    async function addToWishlistHandler(selectedProduct:{_id:string; name:string; brand:string; category:ProductTypes["category"]; dietaryType:"veg"|"nonveg"|"vegan"; images:string[]; price:number; variant:string;}) {
        const res = await addToWishlist({productID:selectedProduct._id, variant:selectedProduct.variant});
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
    async function addToCartHandler({productID, variant}:{productID:string; variant:string;}) {
        try {
            setSelectedProduct(productID);
            const res = await addToCart({productID, variant, quantity:1});
    
            if (!res.success) {
                clicked("error");
                console.log("addToCart nahi hua");
                return;
            }

            if (cartData.length === 0) {
                setCartData([{...res.jsonData.products, variant, quantity:res.jsonData.quantity}]);
            }
            else{
                setCartData((prev) => {
                    const findResult = prev.find(p => (p._id === res.jsonData.products._id && p.variant === res.jsonData.variant));
                    

                    if (findResult) {
                        return prev.map((p) => 
                            (p._id === res.jsonData.products._id && p.variant===variant) ?
                                ({...p, quantity:res.jsonData.quantity})
                                :
                                ({...p})
                        );
                    }
                    else{
                        return [...prev, {...res.jsonData.products, variant, quantity:res.jsonData.quantity}];
                    }
                });
            }
            clicked("success");
        } catch (error) {
            clicked("error")
            console.log("failed to mutate cart");
            console.log(error);
        }
        finally{
            setSelectedProduct(null);
        }
    };
    async function onClickAddToCartHandlers() {
        //const buttonData = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("data-set");
        //const buttonName = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("name") as (keyof(typeof buttonNames));

        //if (!buttonData) throw Error("nothing will happen because buttonData is undefined");
        //const parsedData = JSON.parse(buttonData) as LocalCartTypes;
        //if (!parsedData?._id) throw Error("nothing will happen because productID is undefined");
        const {_id, brand, category, name, images} = productVariantOptions.product;
        //if (!selectedFlavorVariant || !selectedWeightVariant.weight || typeof selectedWeightVariant.index !== "number" || !_id || !brand || !category || !name) {
        //    throw Error(`something is undefined ${selectedFlavorVariant} ${selectedWeightVariant.weight} ${selectedWeightVariant.index} ${_id} ${brand} ${category} ${name}`);
        //}
        const price = productVariantOptions["variants"][selectedFlavorVariant][selectedWeightVariant.index].price
        const variant = `${productVariantOptions.product._id}#${selectedFlavorVariant}#${selectedWeightVariant.weight}#${price}`;
        

        //if (isUserAuthenticated) {
        //    addToCartHandler({productID:productVariantOptions.product._id, variant});
        //}
        //else{
        //    clicked("success");
        //    setTimeout(() => {
        //        addToLocalCart({_id, brand, category, price, name, flavor:(selectedFlavorVariant as string), weight:selectedWeightVariant.weight, images, variant, quantity:1});
        //    }, 500);
        //}
        
    };

    useEffect(() => {
        if (!selectedFlavorVariant || !selectedWeightVariant.weight) return;
        
        // returns existing products quantity if exists
        isAlreadyInCart();
    }, [selectedFlavorVariant, selectedWeightVariant]);

    return(
        <div className={`fixed top-0 left-0 w-screen h-screen bg-black/60 ${isProductVariantOptionsOpen?"scale-y-100 opacity-100":"scale-y-0 opacity-0"} z-100`}>
            <div className="w-full h-full sm:h-max max-w-2xl fixed top-[50%] left-[50%] -translate-[50%] flex justify-end sm:justify-center flex-col gap-2"
                //onClick={() => setIsProductVariantOptionsOpen(false)}
            >
                
                <button className="size-10 ml-auto rounded-full bg-primary-100 text-primary-600 grid place-items-center hover:opacity-80"
                    onClick={() => setIsProductVariantOptionsOpen(false)}
                >X</button>
                
                <div className="bg-white p-4 h-120 rounded-2xl">
                    <div className="w-full h-full px-2 pt-8 pb-15 scrollbar-thin overflow-y-scroll">
                        <NavLink to="####" className="border border-gray-200 text-gray-700 font-semibold flex items-center gap-4 rounded-md hover:bg-primary-100 transition-all ease-out duration-300 group">
                            <div className="w-20 h-25">
                                <img src="/test-category.webp" alt="/test-category.webp" className="w-full h-full" />
                            </div>
                            <div className="text-md sm:text-xl line-clamp-3 w-[75%]">{productVariantOptions.description} {selectedFlavorVariant} {selectedWeightVariant.weight}</div>
                            <div className="ml-auto -translate-x-8 text-xl group-hover:-translate-x-4 transition-all ease-out duration-300"><BsArrowRight /></div>
                        </NavLink>

                        {/* flavors */}
                        <div className="py-1">
                            <div className="text-gray-400 text-lg font-semibold py-1 mt-2">Flavor</div>
                            <div className="flex flex-wrap gap-4">
                                {
                                Object.keys(productVariantOptions.variants).map((flvr) => (
                                    <button key={flvr} disabled={productVariantOptions.variants[flvr][0].stock===0} className={`
                                        border px-2 py-1 rounded-sm
                                        ${productVariantOptions.variants[flvr][0].stock===0&&"border-dashed opacity-50"}
                                        ${selectedFlavorVariant===flvr?"border-primary-300 bg-primary-50 text-primary-500/70":"border-gray-300 bg-gray-50 text-gray-500"}
                                        hover:scale-95 transition-all ease-in-out duration-300
                                    `} onClick={()=>{setSelectedFlavorVariant(flvr); setSelectedWeightVariant({weight:"", index:0})}}>{flvr}</button>
                                ))
                                }
                            </div>
                        </div>

                        {/* weights */}
                        <div className="py-1">
                            <div className="text-gray-400 text-lg font-semibold py-1 mt-2">Weight</div>
                            <div className="flex gap-4 flex-wrap">
                                {
                                productVariantOptions["variants"][selectedFlavorVariant]?.map(({weight, price, stock}, index) => (
                                    <button
                                        key={index}
                                        disabled={stock===0}
                                        className={`
                                            border
                                            ${stock===0&&"border-dashed opacity-50"}
                                            ${selectedWeightVariant.weight===weight?"border-primary-300 bg-primary-50 text-primary-500/70":"border-gray-300 bg-gray-50 text-gray-500"}
                                            text-left rounded-sm overflow-hidden hover:scale-95 transition-all ease-in-out duration-300
                                            `}
                                        onClick={()=>setSelectedWeightVariant({weight, index})}
                                    >
                                        <div className={`border-b p-2 ${selectedWeightVariant.weight===weight?"border-b-primary-300":"border-b-gray-300"}`}>{weight} (1.1 lb)</div>
                                        <div className="bg-white p-2">
                                            <div>
                                                <span className="text-gray-700 text-xl font-semibold">₹{price}</span><span className="text-gray-500 text-sm"> (₹360/100g)</span>
                                            </div>
                                            <div className="text-gray-400 text-sm">Save ₹100</div>
                                        </div>
                                    </button>
                                ))
                                }
                            </div>
                        </div>

                        {/*<pre>{JSON.stringify(cartData, null, `\t`)}</pre>*/}

                        <div className="absolute left-0 bottom-0 w-full rounded-b-2xl pointer-events-none">
                            <div className="mx-5 py-5"
                                style={{
                                    background:"linear-gradient(0deg, white 70%, transparent 100%)"
                                }}
                            >
                                <div className="flex items-center gap-4 w-full sm:w-max ml-auto">
                                    <button className={`
                                        relative w-full rounded-lg hover:opacity-80 pointer-events-auto overflow-hidden
                                        ${!processState?"bg-green-300":"bg-gray-200 text-gray-400"}
                                    `}
                                        disabled={!!processState}
                                        onClick={onClickAddToCartHandlers}
                                    >
                                        {/* quantity steper */}
                                        <div className="bg-red-500 py-2 px-6">Add to Cart</div>
                                        <div className={`
                                            absolute flex justify-between items-center left-0 w-full h-full bg-white transition-all ease-in-out duration-300
                                            ${selectedVariantQty>0?"bottom-0":"-bottom-full"}
                                        `}>
                                            <div className="bg-primary-50 py-0.25 flex-1/3 text-3xl text-gray-600">-</div>
                                            <div className="py-0.25 flex-1/5">{selectedVariantQty}</div>
                                            <div className="bg-primary-50 py-0.25 flex-1/3 text-3xl text-gray-600">+</div>
                                        </div>
                                    </button>
                                    <div className="border border-green-300 relative rounded-lg bg-green-50">
                                        {
                                            //processState === "loading" ?
                                            //    <Spinner color="white"  />
                                            //    :
                                            //    processState === "success" ?
                                            //        <BsCheck className="text-xl text-gray-700" />
                                            //        :
                                            //        processState === "error" ?
                                            //            <BsExclamation className="text-xl text-red-500" />
                                            //            :
                                            //            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-gray-700 size-6">
                                            //                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            //            </svg>
                                        }
                                        
                                        {/* cart icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                            className={`text-gray-700 text-2xl size-9 p-1
                                                ${!processState?"opacity-100 blur-0":"opacity-0 blur-md"}
                                                transition-all ease-in-out duration-300
                                                `}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                        <div className={`absolute top-[50%] left-[50%] -translate-[50%] text-5xl text-gray-700 size-9 p-0 grid place-items-center
                                            ${processState==="loading"?"opacity-100 blur-0":"opacity-0 blur-md"}
                                            transition-all ease-in-out duration-300
                                        `}>
                                            <Spinner color="white"  />
                                        </div>
                                        <BsCheck className={`absolute top-[50%] left-[50%] -translate-[50%] text-5xl text-gray-700 size-9 p-0
                                            ${processState==="success"?"opacity-100 blur-0":"opacity-0 blur-md"}
                                            transition-all ease-in-out duration-300
                                            `} />
                                        <BsExclamation className={`absolute top-[50%] left-[50%] -translate-[50%] text-5xl text-gray-700 size-9 p-0
                                            ${processState==="error"?"opacity-100 blur-0":"opacity-0 blur-md"}
                                            transition-all ease-in-out duration-300
                                            `} />
                                        
                                        
                                        {/* totalCartItems notification */}
                                        <div className={`absolute -right-2 -top-2 w-5 h-5 rounded-full grid place-items-center text-xs bg-green-300
                                            ${!processState?"opacity-100 blur-0":"opacity-0 blur-md"}
                                            transition-all ease-in-out duration-300`}>{totalCartItems}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ProductVariantDialog;