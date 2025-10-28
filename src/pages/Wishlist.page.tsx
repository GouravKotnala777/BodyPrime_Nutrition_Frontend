import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import ImageWithFallback from "../components/ImageWithFallback.component";
import { addToCart } from "../apis/cart.api";
import { addToWishlist } from "../apis/wishlist.api";


function Wishlist() {
    const {wishlistData, setWishlistData, setCartData} = useCart();
    const navigate = useNavigate();
    //const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:false, isSuccess:true, error:""});

    async function transferProductToCartHandler({productID}:{productID:string;}) {
        try {
            const res = await addToCart({productID, quantity:1});

            console.log({ATC:res});
            if (res.success) {
                const res2 = await addToWishlist({productID});
                console.log({ATW:res2});

                if (res2.success) {
                    setWishlistData(wishlistData.filter((p) => p._id !== productID));
                    setCartData((prev) => {
                        const findResult = wishlistData.find((p) => p._id === productID);
                        if (!findResult) throw Error("productID not found in wishlist");
                        
                        return [...prev, {
                            _id:findResult._id,
                            brand:findResult.brand,
                            category:findResult.category,
                            images:findResult.images,
                            name:findResult.name,
                            price:findResult.price,
                            quantity:1,
                            size:0,
                            weight:"001"
                        }];
                    });
                }          
            }         
        } catch (error) {
            console.log(error);
            throw Error("FFFFFFFFFFFFFFFFFFFFFFFFFF")            
        }
    };

    async function removeFromWishlistHandler({productID}:{productID:string}) {
        const res = await addToWishlist({productID});

        if (res.success) {
            setWishlistData(wishlistData.filter((p) => p._id !== productID));
        }
    };

    

    if (wishlistData.length === 0) return(
        <div className="text-center pt-10">
            <img src="/empty_wishlist.webp" alt="/empty_wishlist.webp"
                className="w-[50%] mx-auto"
            />
            <h3 className="text-2xl text-[#f44669] font-semibold my-4">No Products</h3>
            <p className="text-xl text-gray-500 my-2">seems like you have not liked anything yet.</p>
            <div className="text-center my-8">
                <button className="border-2 px-4 py-2 text-xl rounded-[8px] bg-gradient-to-r from-[#f44669] to-orange-500 text-white"
                    onClick={() => navigate("/home")}
                >Buy Products</button>
            </div>
        </div>
    )
    
    return(
        <section>
            {
                wishlistData.map(({_id, name, brand, category, price, images}) => (
                    <NavLink to={`/single_product/${_id}`} className="border-b-1 border-gray-200 flex justify-between items-center px-2 py-6" key={_id}>
                        <div className="w-[30%]">
                            <ImageWithFallback
                                src={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`}
                                alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`}
                                fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                            />
                        </div>
                        <div className="w-[60%]">
                            <button className="w-[30px] h-[30px] ml-auto mb-10 block bg-gray-100 rounded-[4px]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFromWishlistHandler({productID:_id})
                                    console.log("removed...");
                                }}
                            >X</button>
                            <div className="text-[1.1rem] font-semibold
                                overflow-hidden 
                                text-ellipsis 
                                [display:-webkit-box] 
                                [-webkit-line-clamp:3] 
                                [-webkit-box-orient:vertical]
                            ">{name} {brand} Beginer's {category}, No Added Sugar, Faster Muscle Recovery & Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis, veniam.</div>
                            <div className="text-2xl">{price}<span className="font-light">₹</span></div>
                            <button
                                className="bg-yellow-300 rounded-2xl py-2 w-full mt-4"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log("transfered");
                                    transferProductToCartHandler({productID:_id})
                                }}
                            >Tranfer to Cart</button>
                        </div>
                    </NavLink>
                ))
            }
        </section>
    )
};

export default Wishlist;