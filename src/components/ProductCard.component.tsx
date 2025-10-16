import { NavLink } from "react-router-dom";
import RatingStars from "./RatingStars.component";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { addToCart } from "../apis/cart.api";
import ImageWithFallback from "./ImageWithFallback.component";
import { GoHeartFill } from "react-icons/go";
import { addToWishlist } from "../apis/wishlist.api";

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
    images:string[];
};

function ProductCard({productID, name, brand, category, price, rating, numReviews, weight, flavor, images}:ProductCardPropTypes) {
    const {cartData, addToLocalCart, setCartData, wishlistData, setWishlistData} = useCart();
    const {isUserAuthenticated} = useUser();

    async function addToCartHandler() {
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
    };

    async function addToWishlistHandler() {
        const selectedProduct = {_id:productID, name, brand, category, images, price}; // getting frop props
        const res = await addToWishlist({productID});
        // getting res from backend whose type is {success: boolean; message: string; jsonData: {productID: string; operation: 1 | -1;};}  here operation 1 represents addition of product and -1 removel product from wishlist
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
                    ">{name} {brand} Beginer's {category}, No Added Sugar, Faster Muscle Recovery & Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis, veniam.</div>
                    <div className="bg-gray-100 w-fit rounded-[4px] text-[0.9rem] px-2 mt-2">{weight} (Pack of 1)</div>
                </NavLink>
                <div>Options: <NavLink to={"/patoni"} className="underline underline-offset-2 text-blue-700">2 flavours</NavLink>, <NavLink to={"/patoni"} className="underline underline-offset-2 text-blue-700">4 sizes</NavLink></div>
                <NavLink to={`/single_product/${productID}`} className="flex flex-col h-full">
                    <div className="flex">{rating} <RatingStars rating={rating} outOf={5} /> ({numReviews})</div>
                    <div className="text-[2rem] font-semibold flex gap-0.5"><span className="text-[1rem] font-normal">₹</span>{price}</div>
                    <div>Free delivery <span className="font-semibold">Thu, 11 Sept</span></div>
                    <div className="mt-auto flex flex-col gap-2">
                        <button className="w-min" onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log("Liked.....");
                            addToWishlistHandler();
                        }}><GoHeartFill
                                className="
                                    w-[2rem] h-[2rem] transition-transform duration-300
                                    active:scale-115 active:text-pink-300
                                "
                                style={{
                                    color:isAlreadyWishlisted()?"#f6339a":"#e1e1e1"
                                }}
                            /></button>
                        <button className="bg-yellow-300 rounded-2xl py-2 w-full" onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (isUserAuthenticated()) {
                                addToCartHandler();
                            }
                            else{
                                addToLocalCart({_id:productID, name, brand, category, price, size:0, weight, flavor, quantity:1, images});
                            }
                            }}>Add to cart</button>
                    </div>
                </NavLink>
            </div>
        </div>
    )
};

export default ProductCard;