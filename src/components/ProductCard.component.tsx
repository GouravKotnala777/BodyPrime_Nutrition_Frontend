import { NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import ImageWithFallback from "./ImageWithFallback.component";
//import { buttonNames } from "../utils/constants";
import { IoIosAdd, IoMdArrowDropdown } from "react-icons/io";
import { BiStar } from "react-icons/bi";
import { type CategoryTypes, type LocalCartTypes } from "../utils/types";
import { addToCart } from "../apis/cart.api";
import { useUser } from "../contexts/UserContext";
import { converKgtolbs } from "../utils/functions";
import { useState } from "react";
import Spinner from "./Spinner.component";

export interface ProductVariantOptionsInterface{
    img:string;
    description:string;
    flavor:string; // how to assign type of key of weight to type of flavors array item type
    product:Pick<LocalCartTypes, "_id"|"name"|"brand"|"category"|"images"|"price">;
    variants:{[key:string]:{weight:string; price:number; stock:number;}[]};
};
export interface ProductCardPropTypes{
    product:{
        _id:string;
        name:string;
        brand:string;
        category:CategoryTypes;
        subCategory:string;
        price:number;
        rating:number;
        numReviews:number;
        images:string[];
        
        weight:string;
        warnings?:string[];
        tags:string[];
        variants:string[];
        //variants:{weight:string; price:number; stock:number;}[][];
        flavor?:string;
        dietaryType:"veg"|"nonveg"|"vegan";
        //flavors:string[];
    };
    isCartMutating:boolean;
    isBestseller:boolean;
    isVeg:boolean;
    off?:number;
};

let timer = 0;
function ProductCard({product, isBestseller, off, isVeg}:ProductCardPropTypes) {
    const {isUserAuthenticated} = useUser();
    const {cartData, setCartData, addToLocalCart} = useCart();
    const {_id:productID, name, brand, category, price, rating, numReviews, weight, variants, flavor="unflavored", images} = product;
    const [targetedProduct, setTargetedProduct] = useState<string>("");

    //function isAlreadyWishlisted() {
    //    const isExist = wishlistData.some((p) => p._id === productID);
    //    return isExist;
    //};

    function sendDataToHomePage () {
        const variantsTransformed:ProductVariantOptionsInterface["variants"] = {};
        for (let i = 0; i < variants.length; i++) {
            const weightVar = variants[i].split("#")[1];
            const priceVar = Number(variants[i].split("#")[2]);
            const stockVar = Number(variants[i].split("#")[6]);
            const flavorVar = variants[i].split("#")[0];
            if (!variantsTransformed[flavorVar]||variantsTransformed[flavorVar]?.length===0) {
                variantsTransformed[flavorVar] = [{weight:weightVar, price:priceVar, stock:stockVar}];
            }else{
                variantsTransformed[flavorVar].push({weight:weightVar, price:priceVar, stock:stockVar});
            }
        }
        //const qty = isAlreadyInCart();
        const event = new CustomEvent<ProductVariantOptionsInterface>("myEvent", {
            detail:{
                img:images[0],
                description:`${name}#${brand}#${category}#${price}#${flavor}#${weight}#${images[0]}`,
                flavor,
                product:{_id:productID, name, brand, category, images, price},
                variants:variantsTransformed
            }
        });
        
        window.dispatchEvent(event);
    };


    async function addToCartHandler({productID, variant}:{productID:string; variant:string;}) {
        try {
            const res = await addToCart({productID, variant, quantity:1});
    
            if (cartData.length === 0) {
                setCartData([{...res.jsonData.products, variant, quantity:res.jsonData.quantity}]);
            }
            else{
                setCartData((prev) => {
                    const findResult = prev.find(p => (p._id === res.jsonData.products._id && p.variant===variant));
    
                    if (findResult) {
                        return prev.map((p) => (p._id === res.jsonData.products._id && p.variant===variant)?{...p, quantity:res.jsonData.quantity, variant}:p);
                    }
                    else{
                        return [...prev, {...res.jsonData.products, variant, quantity:res.jsonData.quantity}];
                    }
                });
            }
        } catch (error) {
            console.log("failed to mutate cart");
            console.log(error);
        }
        finally{
            //setSelectedProduct(null);
        }
    };

    async function onClickEventHandlers({product}:{product:Pick<LocalCartTypes, "_id"|"brand"|"category"|"flavor"|"images"|"name"|"price"|"weight"|"quantity"|"variant">;}) {
        setTargetedProduct(product._id);
        clearTimeout(timer);
        if (isUserAuthenticated()) {
            timer = setTimeout(() => {
                addToCartHandler({productID:product._id, variant:product.variant});
                setTargetedProduct("");
            }, 1000);
        }
        else{
            timer = setTimeout(() => {
                addToLocalCart(product);
                setTargetedProduct("");
            }, 1000);
        }        
    };
    return(
        <div className="flex flex-row sm:flex-col gap-2">
            {/* upper part */}
            <div className="border border-gray-200 aspect-square rounded-2xl relative min-w-30 product-card-upper-hover-selector">
                {/* nutritional info and single product link */}
                <NavLink to={`/single_product/${productID}`} className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity ease-in-out duration-300 product-card-upper-hovering p-4">
                    <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${product.images[1]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${product.images[1]}`} fallbackSrc="/placeholders/no_product.jpg"
                        className="w-full h-full aspect-square rounded-lg"
                    />
                </NavLink>
                {/* product image */}
                <div className="p-4">
                    <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${product.images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${product.images[0]}`} fallbackSrc="/placeholders/no_product.jpg"
                        className="w-full h-full aspect-square rounded-lg"
                    />
                    {
                        off ?
                            <div className="bg-green-200/80 text-green-700 absolute -top-0.25 -left-0.25 rounded-tl-2xl rounded-br-2xl px-3 py-0.5 text-sm">{off}% 0ff</div>
                            :
                            <></>
                    }
                    {
                        isBestseller &&
                            <div className="bg-blue-200/80 text-blue-700 absolute -top-0.25 -right-0.25 rounded-tr-2xl rounded-bl-2xl px-3 py-0.25 text-sm">Bestseller</div>
                    }
                    
                </div>
                {/* buy button for larger devices */}
                <button className="text-primary-400 bg-primary-50 w-10.5 h-10.5 absolute -right-1.25 -bottom-1.25 rounded-md place-items-center text-2xl group gradient-angle-selectable hidden sm:grid z-2"
                    onClick={()=>onClickEventHandlers({product:{_id:productID, brand, category, flavor, images, name, price, weight, quantity:1, variant:`${product._id}#${product.flavor}#${product.weight}#${product.price}`}})}
                >
                    {
                        targetedProduct===productID ?
                            <Spinner color="var(--color-primary-400)" />
                            :
                            <IoIosAdd className="stroke-20 group-hover:rotate-180 transition-transform ease-in-out duration-300" />
                    }
                </button>

                {/* buy button border for larger devices */}
                <div className="w-12 h-12 absolute -right-2 -bottom-2 rounded-lg gradient-angle-target hidden sm:block z-1"
                    style={{
                        background:"conic-gradient(from var(--gradient-angle), white, var(--primary-500), white)",
                    }}
                ></div>
            </div>
            {/* lower part */}
            <div className="flex flex-col gap-2 sm:px-2">
                <div className="text-gray-600 text-md line-clamp-3">{name} {category} {brand} {flavor} {weight}</div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <img src={isVeg?"/veg_icon.svg":"/nonveg_icon.svg"} alt={isVeg?"/veg_icon.svg":"/nonveg_icon.svg"} className="size-7" />
                        <span className="border absolute -bottom-basis left-0 text-xs text-gray-200 bg-gray-700 w-max pt-0.25 pb-0.75 px-1.5 rounded-xs scale-y-0 opacity-0 origin-top group-hover:scale-y-100 group-hover:opacity-100 transition-all ease-in-out duration-300 delay-300">
                            {isVeg?"is pure vegiterian":"contain nonveg"}
                        </span>
                    </div>
                    <div className="border border-gray-200 rounded-sm flex items-center gap-1 py-0.25 px-1"><span><BiStar className="text-yellow-400" /></span><span className="text-gray-600">{rating}</span><span className="text-gray-400">({numReviews})</span></div>
                </div>
                {/* variants button */}
                <button className="border border-gray-200 rounded-sm flex justify-between items-center sm:px-2 hover:border-gray-400 active:scale-90 transition-transform ease-in-out duration-300"
                    onClick={()=>sendDataToHomePage()}
                >
                    <div className="w-[80%] text-nowrap truncate">{weight} ({converKgtolbs(weight)}lb), {flavor}</div>
                    <IoMdArrowDropdown className="text-xl" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-semibold text-xl"><span className="font-thin">₹</span>{Math.floor(price-((price*(off??0))/100))}</span>
                    {
                        off ?
                            <span className="text-gray-600 text-sm">
                                <span>MRP:</span>
                                <span className="line-through">₹{price}</span>
                            </span>
                            :
                            <></>
                    }
                </div>
                <div className="text-sm text-gray-400">₹{(Math.floor(price-((price*(off??0))/100)))/100}/100g</div>
                {/* buy button for small devices */}
                <button className="border border-green-300 text-green-400 bg-green-50 rounded-md flex justify-center items-center gap-1 px-1 py-1.5 sm:hidden"
                    onClick={()=>onClickEventHandlers({product:{_id:productID, brand, category, flavor, images, name, price, weight, quantity:1, variant:`${product._id}#${product.flavor}#${product.weight}#${product.price}`}})}
                >
                    {
                        targetedProduct===productID ?
                            <Spinner color="var(--color-green-700)" width="24px" />    
                            :
                            <>
                                <span className="text-lg">Add</span>
                                <IoIosAdd className="text-2xl stroke-5" />
                            </>
                    }
                </button>
            </div>
        </div>
    )
};

export default ProductCard;