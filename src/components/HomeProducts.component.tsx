import { useEffect, useState } from "react";
import { getProducts } from "../apis/product.api";
import { type ProductTypes } from "../utils/types";
import ProductCard from "./ProductCard.component";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import HandlePageUIWithState from "./HandlePageUIWithState";
import { ButtonPrimary } from "./Button.component";

//const dummyProducts:ProductTypes[] = [
//    {_id:"1246891", brand:"brand1", category:"protein", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore.", images:["/public/vite.svg"], name:"product1", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246892", brand:"brand2", category:"pre-workout", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product2", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246893", brand:"brand3", category:"protein", description:"Lorem ipsum dolor sit amet.", images:["/public/vite.svg"], name:"product3", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246894", brand:"brand4", category:"vitamins", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore. consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore.", images:["/public/vite.svg"], name:"product4", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246895", brand:"brand5", category:"creatine", description:"this is my coment", images:["/public/vite.svg"], name:"product5", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246896", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//];


export function HomeProducts({selectedProduct}:{selectedProduct:string|null;}) {
    const [skip, setSkip] = useState<number>(0);
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const navigate = useNavigate();
    const {isUserAdmin} = useUser();
    const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    const [refetchDataStatus, setRefetchDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});


    async function getProductsHandler(signal?:AbortSignal) {
        setRefetchDataStatus({isLoading:true, isSuccess:false, error:""});
        const data = await getProducts(skip, "", "", signal);
        if (data.success) {
            if (data.jsonData.length !== 0) {
                setSkip(skip+1);
                setProducts((prev) => [...prev, ...data.jsonData]);
                setRefetchDataStatus({isLoading:false, isSuccess:true, error:""});
            }
            else{
                setRefetchDataStatus({isLoading:false, isSuccess:false, error:"No more products"});
            }
        }
        else{
            setRefetchDataStatus({isLoading:false, isSuccess:false, error:data.message});
            setDataStatus({isLoading:false, isSuccess:false, error:data.message});
        }
        return data;
    };

    function navigateToInventoryHandler() {
        navigate("/inventory", {state:{tab:"add"}});
    };

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setDataStatus({isLoading:true, isSuccess:false, error:""});
        getProductsHandler(signal)
        .then((data) => {
            if (data.success) {
                setDataStatus({isLoading:false, isSuccess:true, error:""});
            }
        })
        .catch((err) => {
            console.log(err);
        });

        return () => {
            controller.abort();
        }
    }, []);
    
    //async function addToWishlistHandler(selectedProduct:{_id:string; name:string; brand:string; category:ProductTypes["category"]; images:string[]; price:number;}) {
    //    const res = await addToWishlist({productID:selectedProduct._id});
    //    if (res.success) {
    //        setWishlistData((prev) => {
    //            if (res.jsonData.operation === 1) {
    //                return [...prev, selectedProduct];
    //            }
    //            else if (res.jsonData.operation === -1) {
    //                return prev.filter((p) => p._id !== res.jsonData.productID);
    //            }
    //            else{
    //                return prev;
    //            }
    //        })
    //    }
    //};

    //async function addToCartHandler({productID}:{productID:string}) {
    //    try {
    //        setIsCartMutating(true);
    //        const res = await addToCart({productID, quantity:1});
    
    //        if (cartData.length === 0) {
    //            setCartData([{...res.jsonData.products, quantity:res.jsonData.quantity}]);
    //        }
    //        else{
    //            setCartData((prev) => {
    //                const findResult = prev.find(p => p._id === res.jsonData.products._id);
    
    //                if (findResult) {
    //                    return prev.map((p) => p._id === res.jsonData.products._id?{...p, quantity:res.jsonData.quantity}:p);
    //                }
    //                else{
    //                    return [...prev, {...res.jsonData.products, quantity:res.jsonData.quantity}];
    //                }
    //            });
    //        }
    //    } catch (error) {
    //        console.log("failed to mutate cart");
    //        console.log(error);
    //    }
    //    finally{
    //        setIsCartMutating(false);
    //    }
    //};

    //async function onClickEventHandler(e:MouseEvent<HTMLElement>) {
    //    const buttonData = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("data-set");
    //    const buttonName = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("name") as (keyof(typeof buttonNames));

    //    if (!buttonData) throw Error("nothing will happen because buttonData is undefined");
    //    const parsedData = JSON.parse(buttonData);
    //    if (!parsedData?._id) throw Error("nothing will happen because productID is undefined");

    //    if (buttonName === "addToCartHandler") {
    //        if (isUserAuthenticated()) {
    //            addToCartHandler({productID:parsedData});
    //        }
    //        else{
    //            addToLocalCart(parsedData);
    //        }
    //    }
    //    else if(buttonName === "addToWishlistHandler"){
    //        addToWishlistHandler(parsedData);
    //    }
        
    //}

    
    if (dataStatus.isSuccess && products.length === 0 && isUserAdmin()) {

        return(
            <>
                <img src="/empty_cart2.png" alt="/empty_cart2.png" />
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
                        <ProductCard key={p._id} product={p} isCartMutating={selectedProduct === p._id} />
                        //<ProductCard key={p._id} productID={p._id} name={p.name} brand={p.brand} category={p.category} price={p.price} numReviews={p.numReviews} rating={p.rating} weight={p.weight} flavor={p.flavor} images={p.images} />
                    ))
                }

                <ButtonPrimary
                    isLoading={refetchDataStatus.isLoading}
                    isSuccess={refetchDataStatus.isSuccess}
                    isDisabled={(refetchDataStatus.error !== "")}
                    onClickHandler={() => getProductsHandler()}
                />
            </section>
        </HandlePageUIWithState>
    )
};

export function BestSellers({selectedProduct}:{selectedProduct:string|null;}) {
    const [skip, setSkip] = useState<number>(0);
    const [refetchDataStatus, setRefetchDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    const [bestSellers, setBestSellers] = useState<ProductTypes[]>([]);
    //const [isCartMutating, setIsCartMutating] = useState<boolean>(false);
    //const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    

    async function getBestSellersHandler(signal?:AbortSignal) {
        try {
            setRefetchDataStatus({isLoading:true, isSuccess:false, error:""});
            const res = await getProducts(skip, "soldCount", "", signal);

            if (res.success) {
                setBestSellers((prev) => [...prev, ...res.jsonData]);
                setRefetchDataStatus({isLoading:false, isSuccess:true, error:""});
                setSkip(skip+1);
            }
            else{
                setRefetchDataStatus({isLoading:false, isSuccess:false, error:res.message});
            }
        } catch (error) {
            console.log(error);
            setRefetchDataStatus({isLoading:false, isSuccess:false, error:error as string});
            throw Error(error as string);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getBestSellersHandler(signal);

        return() => {controller.abort()}
    }, []);

    return(
        <section>
            {bestSellers.length !== 0 && <h1 className="text-[1.3rem] font-semibold text-white mt-10 p-2 bg-gradient-to-br from-[#f44669] to-[#ff7f50]">Best Sellers</h1>}
            {
                bestSellers.map((p) => (
                    <ProductCard key={p._id} product={p} isCartMutating={selectedProduct === p._id} />
                ))
            }
            {bestSellers.length !== 0 &&
                <ButtonPrimary
                    isLoading={refetchDataStatus.isLoading}
                    isSuccess={refetchDataStatus.isSuccess}
                    isDisabled={(refetchDataStatus.error !== "")}
                    onClickHandler={() => getBestSellersHandler()}
                />
            }

        </section>
    )
};

export function FeatureProducts({selectedProduct}:{selectedProduct:string|null;}) {
    const [skip, setSkip] = useState<number>(0);
    const [refetchDataStatus, setRefetchDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    const [featureProducts, setFeatureProducts] = useState<ProductTypes[]>([]);
    //const [isCartMutating, setIsCartMutating] = useState<boolean>(false);
    //const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    

    async function getBestSellersHandler(signal?:AbortSignal) {
        try {
            setRefetchDataStatus({isLoading:true, isSuccess:false, error:""});
            const res = await getProducts(skip, "createdAt", "", signal);

            if (res.success) {
                setFeatureProducts((prev) => [...prev, ...res.jsonData]);
                setRefetchDataStatus({isLoading:false, isSuccess:true, error:""});
                setSkip(skip+1);
            }
            else{
                setRefetchDataStatus({isLoading:false, isSuccess:false, error:res.message});
            }
        } catch (error) {
            console.log(error);
            setRefetchDataStatus({isLoading:false, isSuccess:false, error:error as string});
            throw Error(error as string);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getBestSellersHandler(signal);

        return() => {controller.abort()}
    }, []);

    return(
        <section>
            {featureProducts.length !== 0 && <h1 className="text-[1.3rem] font-semibold text-white mt-10 p-2 bg-gradient-to-br from-[#f44669] to-[#ff7f50]">Feature Products</h1>}
            {
                featureProducts.map((p) => (
                    <ProductCard key={p._id} product={p} isCartMutating={selectedProduct === p._id} />
                ))
            }

            {
                featureProducts.length !== 0 &&
                    <ButtonPrimary
                        isLoading={refetchDataStatus.isLoading}
                        isSuccess={refetchDataStatus.isSuccess}
                        isDisabled={(refetchDataStatus.error !== "")}
                        onClickHandler={() => getBestSellersHandler()}
                    />
            }
        </section>
    )
};