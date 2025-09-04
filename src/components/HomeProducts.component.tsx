import { useEffect, useState } from "react";
import { getProducts } from "../apis/product.api";
import { type ProductTypes } from "../utils/types";


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
        <section className="border-2 border-violet-500">
            <pre>{JSON.stringify(products.map((p) => ({name:p.name, category:p.category, price:p.price})), null, `\t`)}</pre>

            <button
                className="border-2 border-black bg-black text-white rounded-[8px] px-6 py-2 mx-auto block"
                onClick={getProductsHandler}
            >Next</button>
        </section>
    )
};

export default HomeProducts;