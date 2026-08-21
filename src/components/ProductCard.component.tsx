import { NavLink } from "react-router-dom";
import RatingStars from "./RatingStars.component";
import { useCart } from "../contexts/CartContext";
import ImageWithFallback from "./ImageWithFallback.component";
import { GoHeartFill } from "react-icons/go";
import Spinner from "./Spinner.component";
import { buttonNames } from "../utils/constants";
import { IoIosAdd, IoMdArrowDropdown } from "react-icons/io";
import { BiStar } from "react-icons/bi";

export interface ProductCardPropTypes{
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
    isBestseller:boolean;
    off?:number;
};

function ProductCard({product, isCartMutating, isBestseller, off}:ProductCardPropTypes) {
    const {wishlistData} = useCart();
    const {_id:productID, name, brand, category, price, rating, numReviews, weight, flavor, images} = product;

    function isAlreadyWishlisted() {
        const isExist = wishlistData.some((p) => p._id === productID);
        return isExist;
    };

    return(
        <div className="flex flex-col gap-2">
            <div className="border border-gray-200 aspect-square p-4 rounded-2xl relative">
                <img src="test-category.webp" alt="https://cdn2.nutrabay.com/uploads/variant/images/thumbnail_image-NB-NUT-1102-02-1785321618-200x200.webp"
                
                />
                {
                    off &&
                        <div className="bg-green-200/80 text-green-700 absolute -top-0.25 -left-0.25 rounded-tl-2xl rounded-br-2xl px-3 py-0.5 text-sm">{off}% 0ff</div>
                }
                {
                    isBestseller &&
                        <div className="bg-blue-200/80 text-blue-700 absolute -top-0.25 -right-0.25 rounded-tr-2xl rounded-bl-2xl px-3 py-0.25 text-sm">Bestseller</div>
                }
                
                
                <button className="block text-primary-400 bg-primary-50 w-10.5 h-10.5 absolute -right-1.25 -bottom-1.25 rounded-md grid place-items-center text-2xl group gradient-angle-selectable z-2">

                    <IoIosAdd className="stroke-20 group-hover:rotate-180 transition-transform ease-in-out duration-300" />
                </button>

                    {/* Button */}
                    {/*<NavLink to="/home" className="block gradient-angle-selectable relative text-sm font-semibold sm:text-lg rounded-[10px] bg-white px-4 py-2 text-primary-400 cursor-pointer">
                        Shop Now
                    </NavLink>*/}


                    {/* Border */}
                    <div className="w-12 h-12 absolute -right-2 -bottom-2 rounded-lg gradient-angle-target z-1"
                        style={{
                            background:"conic-gradient(from var(--gradient-angle), white, var(--primary-500), white)",
                        }}
                    ></div>
                    
                {/*<button className="border-3 border-primary-400 text-primary-400 bg-primary-50 w-12 h-12 absolute -right-2 -bottom-2 rounded-lg grid place-items-center text-2xl group">

                    <IoIosAdd className="stroke-20 group-hover:rotate-180 transition-transform ease-in-out duration-300" />
                </button>*/}
            </div>
            <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center gap-2">
                    <div className=""><img src="veg_icon.svg" alt="veg_icon.svg" className="size-7" /></div>
                    <div className="border border-gray-200 rounded-sm flex items-center py-0.25 px-1"><span><BiStar className="text-yellow-400" /></span><span className="text-gray-600">{rating}</span><span className="text-gray-400">({numReviews})</span></div>
                </div>
                <div className="border border-gray-200 rounded-sm flex justify-between items-center px-2">
                    <div className="w-[80%] text-nowrap truncate">{weight} (2.2lb), {flavor}</div>
                    <IoMdArrowDropdown className="" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-semibold text-xl">₹{price-((price*(off??0))/100)}</span>
                    {
                        off &&
                            <span className="text-gray-600 text-sm">
                                <span>MRP:</span>
                                <span className="line-through">₹{price}</span>
                            </span>
                    }
                </div>
                <div className="text-sm text-gray-400">₹{price/100}/100g</div>
            </div>
        </div>


        //<div className="border product_card rounded-[8px] flex justify-between h-[55vh] items-center my-2">
        //    <NavLink to={`/single_product/${productID}`} className="h-[clamp(120px,40vw,310px)] w-[clamp(90px,30vw,260px)] bg-gray-100">
        //        <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`} fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`} className="h-full w-full" />
        //    </NavLink>
        //    <div className="w-[60%] h-full flex flex-col gap-2 py-4 px-2">
        //        <NavLink to={`/single_product/${productID}`} className="h-[14rem]">
        //            <div className="text-xl font-semibold h-[6rem]
        //                overflow-hidden 
        //                text-ellipsis 
        //                [display:-webkit-box] 
        //                [-webkit-line-clamp:3] 
        //                [-webkit-box-orient:vertical]
        //            ">{name} {brand} Beginer's {category}, {flavor} No Added Sugar, Faster Muscle Recovery & Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis, veniam.</div>
        //            <div className="bg-gray-100 w-fit rounded-[4px] text-[0.9rem] px-2 mt-2">{weight} (Pack of 1)</div>
        //        </NavLink>
        //        <div>Options: <NavLink to={"/patoni"} className="underline underline-offset-2 text-blue-700">2 flavours</NavLink>, <NavLink to={"/patoni"} className="underline underline-offset-2 text-blue-700">4 sizes</NavLink></div>
        //        <NavLink to={`/single_product/${productID}`} className="flex flex-col h-full">
        //            <div className="flex">{rating} <RatingStars rating={rating} outOf={5} /> ({numReviews})</div>
        //            <div className="text-[2rem] font-semibold flex gap-0.5"><span className="text-[1rem] font-normal">₹</span>{price}</div>
        //            <div>Free delivery <span className="font-semibold">Thu, 11 Sept</span></div>
        //            <div className="mt-auto flex flex-col gap-2">
        //                <button className="w-min"
        //                    name={buttonNames.addToWishlistHandler}
        //                    data-set={JSON.stringify({_id:productID, name, brand, category, images, price})}
        //                    onClick={(e) => {
        //                        e.preventDefault();
        //                }}><GoHeartFill
        //                        className="
        //                            w-[2rem] h-[2rem] transition-transform duration-300
        //                            active:scale-115 active:text-pink-300 hover:opacity-70
        //                        "
        //                        style={{
        //                            color:isAlreadyWishlisted()?"#f6339a":"#e1e1e1"
        //                        }}
        //                    /></button>
        //                <button className="bg-yellow-300 rounded-2xl w-full max-w-80 overflow-hidden hover:opacity-70"
        //                    name={buttonNames.addToCartHandler}
        //                    data-set={JSON.stringify({_id:productID, name, brand, category, images, price})}
        //                    onClick={(e) => {
        //                        e.preventDefault();
        //                    }}>
        //                    <span className="only_for_same_btn_level w-full h-full inline-block">
        //                        <span className="only_for_same_btn_level w-full h-full inline-block py-2">
        //                            {isCartMutating?<Spinner />:"Add to cart"}
        //                        </span>
        //                    </span>
        //                </button>
        //            </div>
        //        </NavLink>
        //    </div>
        //</div>
    )
};

export default ProductCard;