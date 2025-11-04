import { NavLink } from "react-router-dom";
import type { ProductTypes } from "../utils/types";
import ImageWithFallback from "./ImageWithFallback.component";


function ProductsSlider({heading, products}:{heading:string; products:ProductTypes[];}) {
    
    if (products.length === 0) return(<></>);
    
    return(
        <>
            <h1 className="text-2xl font-semibold text-white mt-10 p-2 bg-gradient-to-br from-[#f44669] to-[#ff7f50]">{heading}</h1>
            <div className="flex gap-4 overflow-x-scroll px-4 py-2">
                {
                    products.map((p) => (
                        <NavLink reloadDocument={true} to={`/single_product/${p._id}`} className="border-1 border-gray-200 flex flex-col p-2 rounded-[4px]">
                            <div className="w-35 h-35">
                                <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.images[0]}`} fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`} />
                            </div>
                            <div className="text-center">
                                <h4>{p.name}</h4>
                                <p>{p.flavor}</p>
                                <p>
                                    <span className="text-xl font-semibold">{p.price}</span>
                                    <span className="text-[0.9rem]">₹</span>
                                </p>
                            </div>
                        </NavLink>
                    ))
                }
            </div>
        </>
    )
};

export default ProductsSlider;