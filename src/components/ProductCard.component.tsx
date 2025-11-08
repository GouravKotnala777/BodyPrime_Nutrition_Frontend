import { NavLink } from "react-router-dom";
import RatingStars from "./RatingStars.component";
import { useCart } from "../contexts/CartContext";
import ImageWithFallback from "./ImageWithFallback.component";
import { GoHeartFill } from "react-icons/go";
import Spinner from "./Spinner.component";
import { buttonNames } from "../utils/constants";

interface ProductCardPropTypes{
    product:{
        _id:string;
        name:string;
        brand:string;
        category:"protein"|"pre-workout"|"vitamins"|"creatine"|"other";
        price:number;
        rating:number;
        numReviews:number;
        weight:string;
        flavor?:string;
        images:string[];
    };
    isCartMutating:boolean;
};

function ProductCard({product, isCartMutating}:ProductCardPropTypes) {
    const {wishlistData} = useCart();
    const {_id:productID, name, brand, category, price, rating, numReviews, weight, flavor, images} = product;

    function isAlreadyWishlisted() {
        const isExist = wishlistData.some((p) => p._id === productID);
        return isExist;
    };

    return(
        <div className="border-[1px] border-gray-100 rounded-[8px] flex justify-between h-[55vh] items-center my-2">
            {/*<pre>{JSON.stringify(cartData, null, `\t`)}</pre>*/}
            <NavLink to={`/single_product/${productID}`} className="w-[40%] h-[100%] bg-gray-100">
                <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`} fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`} className="h-full w-full" />
            </NavLink>
            <div className="w-[60%] h-full flex flex-col gap-2 py-4 px-2">
                <NavLink to={`/single_product/${productID}`} className="h-[14rem]">
                    <div className="text-[1.3rem] font-semibold h-[6rem]
                        overflow-hidden 
                        text-ellipsis 
                        [display:-webkit-box] 
                        [-webkit-line-clamp:3] 
                        [-webkit-box-orient:vertical]
                    ">{name} {brand} Beginer's {category}, {flavor} No Added Sugar, Faster Muscle Recovery & Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis, veniam.</div>
                    <div className="bg-gray-100 w-fit rounded-[4px] text-[0.9rem] px-2 mt-2">{weight} (Pack of 1)</div>
                </NavLink>
                <div>Options: <NavLink to={"/patoni"} className="underline underline-offset-2 text-blue-700">2 flavours</NavLink>, <NavLink to={"/patoni"} className="underline underline-offset-2 text-blue-700">4 sizes</NavLink></div>
                <NavLink to={`/single_product/${productID}`} className="flex flex-col h-full">
                    <div className="flex">{rating} <RatingStars rating={rating} outOf={5} /> ({numReviews})</div>
                    <div className="text-[2rem] font-semibold flex gap-0.5"><span className="text-[1rem] font-normal">₹</span>{price}</div>
                    <div>Free delivery <span className="font-semibold">Thu, 11 Sept</span></div>
                    <div className="mt-auto flex flex-col gap-2">
                        <button className="w-min" name={buttonNames.addToWishlistHandler} data-set={JSON.stringify({_id:productID, name, brand, category, images, price})} onClick={(e) => {
                            //e.stopPropagation();
                            e.preventDefault();
                            //addToWishlistHandler();
                        }}><GoHeartFill
                                className="
                                    w-[2rem] h-[2rem] transition-transform duration-300
                                    active:scale-115 active:text-pink-300
                                "
                                style={{
                                    color:isAlreadyWishlisted()?"#f6339a":"#e1e1e1"
                                }}
                            /></button>
                        <button className="bg-yellow-300 rounded-2xl py-2 w-full" name={buttonNames.addToCartHandler} onClick={(e) => {
                            //e.stopPropagation();
                            e.preventDefault();
                            //if (isUserAuthenticated()) {
                            //    addToCartHandler();
                            //}
                            //else{
                            //    addToLocalCart({_id:productID, name, brand, category, price, size:0, weight, flavor, quantity:1, images});
                            //}
                            }}>{isCartMutating?<Spinner />:"Add to cart"}</button>
                    </div>
                </NavLink>
            </div>
        </div>
    )
};

export default ProductCard;