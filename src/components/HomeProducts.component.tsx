import { useEffect, useState } from "react";
import { getProducts } from "../apis/product.api";
import { type ProductTypes } from "../utils/types";
import ProductCard from "./ProductCard.component";


function HomeProducts() {
    const [skip, setSkip] = useState<number>(0);
    const [products, setProducts] = useState<ProductTypes[]>([]);

    async function getProductsHandler() {
        const data = await getProducts(skip);
        setProducts((prev) => [...prev, ...data.jsonData]);
        console.log(data);
        setSkip(skip+1)
    };
    
    useEffect(() => {
        getProductsHandler();
    }, []);

    return(
        <section>
            {
                products.map((p) => (
                    <ProductCard key={p._id} productID={p._id} name={p.name} brand={p.brand} category={p.category} price={p.price} numReviews={p.numReviews} rating={p.rating} weight={p.weight} />
                ))
            }

            <button
                className="bg-black text-white rounded-[8px] px-6 py-2 mx-auto block"
                onClick={getProductsHandler}
            >Next</button>
        </section>
    )
};

export default HomeProducts;