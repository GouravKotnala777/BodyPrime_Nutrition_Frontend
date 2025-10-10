import { useEffect, useState } from "react";
import { getProducts } from "../apis/product.api";
import { type ProductTypes } from "../utils/types";
import ProductCard from "./ProductCard.component";
import emptyStateImage from "../../public/empty_cart2.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import HandlePageUIWithState from "./HandlePageUIWithState";

//const dummyProducts:ProductTypes[] = [
//    {_id:"1246891", brand:"brand1", category:"protein", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore.", images:["/public/vite.svg"], name:"product1", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246892", brand:"brand2", category:"pre-workout", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product2", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246893", brand:"brand3", category:"protein", description:"Lorem ipsum dolor sit amet.", images:["/public/vite.svg"], name:"product3", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246894", brand:"brand4", category:"vitamins", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore. consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore.", images:["/public/vite.svg"], name:"product4", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246895", brand:"brand5", category:"creatine", description:"this is my coment", images:["/public/vite.svg"], name:"product5", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246896", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//];


function HomeProducts() {
    const [skip, setSkip] = useState<number>(0);
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const navigate = useNavigate();
    const {isUserAdmin} = useUser();
    const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});

    async function getProductsHandler() {
        setDataStatus({isLoading:true, isSuccess:false, error:""});
        const data = await getProducts(skip);
        
        if (data.success) {
            setProducts((prev) => [...prev, ...data.jsonData]);
            setSkip(skip+1);
            setDataStatus({isLoading:false, isSuccess:true, error:""});
        }
        else{
            setDataStatus({isLoading:false, isSuccess:false, error:data.message});
        }
    };

    function navigateToInventoryHandler() {
        navigate("/inventory", {state:{tab:"add"}});
    };

    useEffect(() => {
        getProductsHandler();
    }, []);

    
    if (dataStatus.isSuccess && products.length === 0 && isUserAdmin()) {

        return(
            <>
                <img src={emptyStateImage} alt={emptyStateImage} />
                <h1 className="text-2xl text-center font-bold text-[#f44769] py-1">No Product!</h1>
                <p className="text-[1.1rem] text-center text-gray-400 font-semibold py-1/2">It looks like there is no product yet.</p>
                <div className="text-center">
                    <button className="bg-[#f44769] text-white text-[1.2rem] py-2 px-3 font-medium rounded-[8px] my-7" onClick={navigateToInventoryHandler}>Add New Products</button>
                </div>
            </>
        )
    }

    return(
        <HandlePageUIWithState isLoading={dataStatus.isLoading} isSuccess={dataStatus.isSuccess} error={dataStatus.error}>
            <section>
                {
                    products.map((p) => (
                        <ProductCard key={p._id} productID={p._id} name={p.name} brand={p.brand} category={p.category} price={p.price} numReviews={p.numReviews} rating={p.rating} weight={p.weight} flavor={p.flavor} images={p.images} />
                    ))
                }

                <button
                    className="bg-black text-white rounded-[8px] px-6 py-2 mx-auto block"
                    onClick={getProductsHandler}
                >Next</button>
            </section>
        </HandlePageUIWithState>
    )
};

export default HomeProducts;