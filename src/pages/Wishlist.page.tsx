import { useCart } from "../contexts/CartContext";


function Wishlist() {
    const {wishlistData} = useCart();
    


    return(
        <section className="border-2">
            {
                wishlistData.map(({_id, name, brand, category}) => (
                    <div className="border-2 border-red-400 flex" key={_id}>
                        <div className="border-2 flex-1/3">
                            <img src="/vite.svg" alt="/vite.svg"
                                className="w-full"
                            />
                        </div>
                        <div className="border-2 flex-1/2">
                            <div className="border-2 border-green-500 text-[1.1rem] font-semibold
                                overflow-hidden 
                                text-ellipsis 
                                [display:-webkit-box] 
                                [-webkit-line-clamp:3] 
                                [-webkit-box-orient:vertical]
                            ">{name} {brand} Beginer's {category}, No Added Sugar, Faster Muscle Recovery & Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis, veniam.</div>

                            <button className="bg-yellow-300 rounded-2xl py-2 w-full">Tranfer to Cart</button>
                        </div>
                    </div>
                ))
            }
        </section>
    )
};

export default Wishlist;