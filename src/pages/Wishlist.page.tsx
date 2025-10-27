import { NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import ImageWithFallback from "../components/ImageWithFallback.component";


function Wishlist() {
    const {wishlistData} = useCart();
    
    return(
        <section>
            {
                wishlistData.map(({_id, name, brand, category, price, images}) => (
                    <NavLink to={`/single_product/${_id}`} className="border-b-1 border-gray-200 flex justify-between px-2 py-6 mt-8" key={_id}>
                        <div className="w-[30%]">
                            <ImageWithFallback
                                src={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`}
                                alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`}
                                fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                            />
                        </div>
                        <div className="w-[60%]">
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