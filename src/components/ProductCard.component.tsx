import { NavLink } from "react-router-dom";
import vite from "/public/vite.svg";
import RatingStars from "./RatingStars.component";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { addToCart } from "../apis/cart.api";

interface ProductCardPropTypes{
    productID:string;
    name:string;
    brand:string;
    category:"protein"|"pre-workout"|"vitamins"|"creatine"|"other";
    price:number;
    rating:number;
    numReviews:number;
    weight:string;
    flavor?:string;
};

function ProductCard({productID, name, brand, category, price, rating, numReviews, weight, flavor}:ProductCardPropTypes) {
    const {addToLocalCart} = useCart();
    const {isUserAuthenticated} = useUser();

    return(
        <div className="border-[1px] border-gray-100 rounded-[8px] flex justify-between h-[55vh] items-center my-2">
            <NavLink to={`/single_product/${productID}`} className="w-[40%] h-[100%] bg-gray-100"><img src={vite} alt={vite} className="w-full h-full"/></NavLink>
            <div className="w-[60%] h-full flex flex-col gap-2 py-4 px-2">
                <NavLink to={`/single_product/${productID}`} className="h-[14rem]">
                    <div className="text-[1.3rem] font-semibold h-[6rem]
                        overflow-hidden 
                        text-ellipsis 
                        [display:-webkit-box] 
                        [-webkit-line-clamp:3] 
                        [-webkit-box-orient:vertical]
                    ">{name} {brand} Beginer's {category}, No Added Sugar, Faster Muscle Recovery & Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis, veniam.</div>
                    <div className="bg-gray-100 w-fit rounded-[4px] text-[0.9rem] px-2 mt-2">{weight} (Pack of 1)</div>
                </NavLink>
                <div>Options: <NavLink to={"/patoni"} className="underline underline-offset-2 text-blue-700">2 flavours</NavLink>, <NavLink to={"/patoni"} className="underline underline-offset-2 text-blue-700">4 sizes</NavLink></div>
                <NavLink to={`/single_product/${productID}`} className="flex flex-col h-full">
                    <div className="flex">{rating} <RatingStars rating={rating} outOf={5} /> ({numReviews})</div>
                    <div className="text-[2rem] font-semibold flex gap-0.5"><span className="text-[1rem] font-normal">₹</span>{price}</div>
                    <div>Free delivery <span className="font-semibold">Thu, 11 Sept</span></div>
                    <button className="bg-yellow-300 rounded-2xl w-full py-2 mt-auto" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (isUserAuthenticated()) {
                            addToCart({productID, quantity:1});
                        }
                        else{
                            addToLocalCart({_id:productID, name, brand, category, price, size:0, weight, flavor, quantity:1});
                        }
                        }}>Add to cart</button>
                </NavLink>
            </div>
        </div>
    )
};

export default ProductCard;