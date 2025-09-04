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
                    <ProductCard key={p._id} brand={p.brand} category={p.category} price={p.price} numReviews={p.numReviews} rating={p.rating} weight={p.weight} />
                ))
            }
            {/*<pre>{JSON.stringify(products.map((p) => ({name:p.name, category:p.category, price:p.price})), null, `\t`)}</pre>*/}

            <button
                className="text-white rounded-[8px] px-6 py-2 mx-auto block"
                onClick={getProductsHandler}
            >Next</button>
        </section>
    )
};

export default HomeProducts;