import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { getSingleProduct } from "../apis/product.api";
import { type ProductTypes, type ReviewTypesPopulated } from "../utils/types";
import { getReviews } from "../apis/review.api";
import { useUser } from "../contexts/UserContext";
import { addToCart, removeFromCart } from "../apis/cart.api";
import { useCart } from "../contexts/CartContext";
import { FaShare } from "react-icons/fa6";
import ProductCard from "../components/ProductCard.component";
import { GoHeartFill } from "react-icons/go";
import ImageWithFallback from "../components/ImageWithFallback.component";
import { capitalizeString } from "../utils/functions";
import Skeletan from "../components/Skeletan";
import Spinner from "../components/Spinner.component";
import ReviewCard from "../components/ReviewCard.component";
//import RatingFormModal from "../components/RatingFormModal.component";
import ReviewSummery from "../components/ReviewSummery.component";
import { addToWishlist } from "../apis/wishlist.api";
import RatingStars from "../components/RatingStars.component";
const off = 10;
let timer = 0;
function SingleProduct() {
    const {productID} = useParams();
    //const [images, setImages] = useState<FileList|null>(null);
    const [singleProduct, setSingleProduct] = useState<ProductTypes>({_id:"", brand:"brand1", category:"protein", subCategory:"", dietaryType:"veg",
        images:["/test-category.webp", "/placeholders/no_product.jpg", "/placeholders/no_user.png", "/offers.webp", "/fizzy_whey.webp", "/amino_acids.webp"],
        name:"Product1", numReviews:0, price:800, rating:0, avgRating:4, tags:[], variants:[], weight:"1kg", description:"", flavor:"Unflavored", ingredients:[""], nutritionFacts:{calories:0, carbs:0, fat:0, protein:0, servingSize:"", servingsPerContainer:0}, stock:0, warnings:[]});
    const [allReviews, setAllReviews] = useState<ReviewTypesPopulated[]>([]);
    const [quantityInCart, setQuantityInCart] = useState<number>(0);
    const {isUserAuthenticated} = useUser();
    const {cartData, setCartData, addToLocalCart, setWishlistData} = useCart();
    //const navigate = useNavigate();
    //const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    const [isCartMutating, setIsCartMutating] = useState<boolean>(false);
    //const [variantProducts, setVariantProducts] = useState<ProductTypes[]>([]);
    //const [sameBrandProducts, setSameBrandProducts] = useState<ProductTypes[]>([]);
    //const [sameCategoryProducts, setSameCategoryProducts] = useState<ProductTypes[]>([]);
    const [revealer, setRevealer] = useState<boolean>(false);
    const [isLikeActive, setIsLikeActive] = useState<boolean>(false);
    const [isAddToCartVisible, setIsAddToCartVisible] = useState<boolean>(false);
    const addToCartBtnRef = useRef<HTMLButtonElement|null>(null);
    const [selectedFlavorVariant, setSelectedFlavorVariant] = useState<string>("Unflavored");
    const [selectedWeightVariant, setSelectedWeightVariant] = useState<{weight:string; index:number;}>({weight:"1kg", index:0});
    const [productVariantOptions, setProductVariantOptions] = useState<{[key:string]:{flavor:string; weight:string; price:number; stock:number;}[];}|null>(null);
    const [hoveringPreviewImg, setHoveringPreviewImg] = useState<number>(0);
    //const [isOpen, setIsOpen] = useState<number>(0);

    async function getSingleProductHandler(signal?:AbortSignal) {
        //setDataStatus({isLoading:true, isSuccess:false, error:""});
        if (!productID) return;
        
        const res = await getSingleProduct({productID}, signal);
        if (res.success) {
            setSingleProduct(res.jsonData);
            //setDataStatus({isLoading:false, isSuccess:true, error:""});
            setSelectedFlavorVariant(capitalizeString(res.jsonData.flavor));
            setSelectedWeightVariant({weight:res.jsonData.weight, index:0});
            
            const transformedVariantData = res.jsonData.variants.reduce((acc, iter) => {
                const flavor = capitalizeString(iter.split("#")[0]);
                const weight = iter.split("#")[1];
                const price = Number(iter.split("#")[2]);
                const stock = Number(iter.split("#")[6]);
                if (!acc[flavor]) {
                    acc[flavor] = [{flavor, weight, price, stock}];
                }
                else{
                    acc[flavor].push({flavor, weight, price, stock});
                }                                            
                return acc;
            }, {} as {[key:string]:{flavor:string; weight:string; price:number; stock:number;}[];});
            
            //console.log({transformedVariantData});
            
            setProductVariantOptions(transformedVariantData);
        }
        else{
            //setDataStatus({isLoading:false, isSuccess:false, error:res.message});
        }

    };



    //async function onChangeHandler(e:ChangeEvent<HTMLInputElement>) {
    //    const files = e.target.files;
    //    setImages(files);
    //};
    //async function upload() {
    //    const formData = new FormData();
        
    //    if (!productID)  throw new Error("ProductID params not found");
    //    if (!images || images.length === 0) throw new Error("Please select atleast one image");
    //    if (!singleProduct) throw new Error("singleProduct not found");
        
    //    formData.append("productID", productID);
    //    Array.from(images).forEach((image) => {
    //        formData.append("images", image);
    //    });
        
    //    const res = await addImages(formData);

    //    setSingleProduct({...singleProduct, images:res.jsonData.images});
    //    console.log({res});
        
    //};
    async function getReviewsHandler(signal?:AbortSignal) {
        if (!productID) throw new Error("productID is not defiend");

        const res = await getReviews({productID, signal});
        setAllReviews(res.jsonData);
        console.log(res);
    };

    async function addToCartHandler() {
        try {
            setIsCartMutating(true);
            if (!productID || !singleProduct.flavor || !singleProduct.weight || !singleProduct.price) throw Error(`something not found productID=${productID} flavor=${singleProduct.flavor} weight=${singleProduct.weight} price=${singleProduct.price}`);

            clearTimeout(timer);

            timer = setTimeout(async() => {
                if (isUserAuthenticated()) {
                    const res = await addToCart({productID, variant:`${productID}#${selectedFlavorVariant}#${selectedWeightVariant.weight}#${productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].price}`, quantity:1});
                    //console.log(res);
        
                    if (cartData.length === 0) {
                        setCartData([{...res.jsonData.products, variant:res.jsonData.variant, quantity:res.jsonData.quantity}]);
                    }
                    else{
                        setCartData((prev) => {
                            const findResult = prev.find(p => (p._id === res.jsonData.products._id && p.variant===res.jsonData.variant));
            
                            if (findResult) {
                                return prev.map((p) => (p._id === res.jsonData.products._id && p.variant===res.jsonData.variant)?{...p, quantity:res.jsonData.quantity}:p);
                            }
                            else{
                                return [...prev, {...res.jsonData.products, variant:res.jsonData.variant, quantity:res.jsonData.quantity}];
                            }
                        });
                    }
                }
                else{
                    addToLocalCart({_id:productID, name:singleProduct.name, brand:singleProduct.brand, category:singleProduct.category, images:[], flavor:selectedFlavorVariant, price:(productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].price||0), quantity:1, weight:selectedWeightVariant.weight, variant:`${productID}#${selectedFlavorVariant}#${selectedWeightVariant.weight}#${productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].price}`});
                }
                setIsCartMutating(false);
            }, 1000);

    
        } catch (error) {
            setIsCartMutating(false);
            console.log(error);
        }
    };

    async function addToWishlistHandler(selectedProduct:{_id:string; name:string; brand:string; category:ProductTypes["category"]; dietaryType:"veg"|"nonveg"|"vegan"; images:string[]; price:number; variant:string;}) {
        //const res = await addToWishlist({productID:selectedProduct._id, variant:selectedProduct.variant});
        const res = await addToWishlist({productID:selectedProduct._id, variant:`${selectedProduct._id}#${selectedFlavorVariant}#${selectedWeightVariant.weight}#${productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].price}`});

        if (res.success) {
            setIsLikeActive(!isLikeActive);
            setWishlistData((prev) => {
                if (res.jsonData.operation === 1) {
                    return [...prev, selectedProduct];
                }
                else if (res.jsonData.operation === -1) {
                    return prev.filter((p) => (p._id !== res.jsonData.productID && p.variant !== res.jsonData.variant));
                }
                else{
                    return prev;
                }
            })
        }
    };

    async function removeFromCartHandler() {
        try {
            setIsCartMutating(true);
            if (!productID) throw Error("productID not found");
    
            const res = await removeFromCart({productID, variant:`${productID}#${selectedFlavorVariant}#${selectedWeightVariant.weight}#${productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].price}`, quantity:1});
            //const res = await removeFromCart({productID, variant, quantity:1});

            //console.log(res);
            

            const selectedProduct = cartData.find((p) => p._id === res.jsonData.products);
    
            if (!selectedProduct) return Error("selectedProduct not found");
            if (res.jsonData.quantity < 1) {
                setCartData(cartData.filter(p => (p._id === res.jsonData.products && p.variant !== selectedProduct.variant)));
            }
            else{
                selectedProduct.quantity = res.jsonData.quantity;
                setCartData(cartData.map(p => (p._id === selectedProduct._id && p.variant === selectedProduct.variant)?{...p, quantity:res.jsonData.quantity}:p));
                "agar product ki quantity kam hui lekin poora remove nahi hua to usse handle karna hai"
            }
        } catch (error) {
            
        }
        finally{
            setIsCartMutating(false);
        }
    };

    //async function getProductsVariant() {
    //    if (!singleProduct.brand || !singleProduct.category) return;

    //    const res = await getSimilarProducts({excludeProductID:singleProduct._id, brand:singleProduct.brand, category:singleProduct.category});

    //    if (res.success) {
    //        //setVariantProducts(res.jsonData);
    //        //console.log({reso:res});
    //    }
    //};
    //async function getProductsWithSameBrand() {
    //    if (!singleProduct.brand) return;

    //    const res = await getSimilarProducts({excludeProductID:singleProduct._id, brand:singleProduct.brand});

    //    if (res.success) {
    //        //setSameBrandProducts(res.jsonData);
    //    }
    //};
    //async function getProductsWithOfCategory() {
    //    if (!singleProduct.category) return;

    //    const res = await getSimilarProducts({excludeProductID:singleProduct._id, category:singleProduct.category});

    //    if (res.success) {
    //        //setSameCategoryProducts(res.jsonData);
    //    }
    //};
    

    useEffect(() => {
        let timer = 0;
        //const controller = new AbortController();
        //const signal = controller.signal;
        timer = setTimeout(() => {
            getSingleProductHandler();
            getReviewsHandler();
        }, 1500);

        //getSingleProductHandler(signal);
        //getReviewsHandler(signal);

        //return() => {controller.abort();}
        return() => clearTimeout(timer);
    }, []);
    
    //useEffect(() => {
        //getProductsVariant();
        //getProductsWithSameBrand();
        //getProductsWithOfCategory();
    //}, [singleProduct])
    
    useEffect(() => {
        const findResult = cartData.find(p => (p._id === singleProduct._id && p.variant === `${productID}#${selectedFlavorVariant}#${selectedWeightVariant.weight}#${productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].price}`));
        setQuantityInCart(findResult?.quantity||0);
    }, [cartData, selectedFlavorVariant, selectedWeightVariant]);

    useEffect(() => {
        // show secondary addToCart button on the bottom if primary if not visible
        const addToCartBtn = addToCartBtnRef.current;

        if (!addToCartBtn) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsAddToCartVisible(entry.isIntersecting)
        }, {threshold:0.5});

        observer.observe(addToCartBtn);

        return() => observer.disconnect();
    }, []);

    return (
        <section className="relative h-[300vh] mt-20 mx-1 sm:mx-4">
            {/* left part */}
            <div className="sm:border border-gray-200 rounded-2xl flex flex-col gap-10 mx-auto sm:mx-0 w-full sm:top-20 sm:left-0 sm:sticky sm:w-[45%] p-4">
                {
                    productVariantOptions === null ?
                        // loading
                        <div className="relative">
                            <div className="mx-auto size-70 md:size-90 rounded-lg overflow-hidden">
                                <Skeletan />
                            </div>
                            <div className="w-8 h-8 absolute top-0 right-0 rounded-md overflow-hidden"><Skeletan /></div>
                            <div className="border border-gray-200 w-8 h-8 text-xl absolute top-12 right-0 rounded-md grid place-items-center group"><Spinner color="var(--color-gray-400)" type="secondary" /></div>
                            <button className="border border-gray-200 w-8 h-8 absolute top-24 right-0 rounded-md grid place-items-center text-gray-600"><Spinner color="var(--color-gray-400)" type="secondary" /></button>
                        </div>
                        :
                        // after load
                        <div className="relative">
                            {/*<pre className="text-xs">{JSON.stringify({selectedFlavorVariant, selectedWeightVariant, price:productVariantOptions[selectedFlavorVariant][selectedWeightVariant.index].price}, null, `\t`)}</pre>*/}
                            <div className="mx-auto size-70 md:size-90 rounded-lg">
                                <ImageWithFallback
                                    src={`${import.meta.env.VITE_SERVER_URL}/api/v1${singleProduct.images[hoveringPreviewImg]}`}
                                    alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${singleProduct.images[hoveringPreviewImg]}`}
                                    fallbackSrc="/placeholders/no_product.jpg"
                                />
                            </div>
                            <div className="bg-green-200/80 text-green-700 absolute -top-0.25 -left-0.25 rounded-tl-2xl rounded-br-2xl px-4 py-0.75 text-md">25% 0ff</div>
                            <div className="w-8 h-8 absolute top-0 right-0"><img src="/veg_icon.svg" alt="/veg_icon.svg" className="w-full" /></div>
                            <button className="border border-gray-200 w-8 h-8 text-xl absolute top-12 right-0 rounded-md grid place-items-center group" onClick={() => addToWishlistHandler({_id:singleProduct._id, brand:singleProduct.brand, category:singleProduct.category, dietaryType:singleProduct.dietaryType, images:singleProduct.images, name:singleProduct.name, price:singleProduct.price, variant:`${singleProduct._id}#${selectedFlavorVariant}#${selectedWeightVariant.weight}#${productVariantOptions[selectedFlavorVariant][selectedWeightVariant.index].price}`})}><GoHeartFill className={`${isLikeActive?"text-pink-400":"text-gray-200"} group-active:scale-130 transition-all ease-in-out duration-300`} /></button>
                            <button className="border border-gray-200 w-8 h-8 absolute top-24 right-0 rounded-md grid place-items-center text-gray-600"><FaShare/></button>
                        </div>
                }
                <div className="border border-gray-200 flex gap-1 rounded-xl overflow-hidden p-1">
                    {
                        productVariantOptions === null ?
                        [0,1,2,3,4,5].map((index) => (
                            <div key={index} className="h-30 basis-1/6 rounded-lg overflow-hidden">
                                <Skeletan />
                            </div>
                        ))
                        :
                        singleProduct.images.length === 0 ?
                            [0,1,2,3,4,5].map((_, index) => (
                                <div key={index} className="basis-1/6 transition-all ease-in-out duration-300">
                                    <img src="/placeholders/no_product.jpg" alt="/placeholders/no_product.jpg" />
                                </div>
                            ))
                            :
                            singleProduct.images.map((imgUrl, index) => (
                                <div key={index} className={`${hoveringPreviewImg===index?"scale-90":"scale-100"} basis-1/6 transition-all ease-in-out duration-300`}
                                    onMouseEnter={() => setHoveringPreviewImg(index)}
                                >
                                    <ImageWithFallback key={index} src={`${import.meta.env.VITE_SERVER_URL}/api/v1${imgUrl}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${imgUrl}`} fallbackSrc="/placeholders/no_product.jpg" />
                                </div>
                            ))
                    }

                </div>
            </div>

            {/* right part */}
            <div className="sm:border border-gray-200 rounded-t-2xl w-full sm:absolute sm:top-0 sm:right-0 sm:w-[51%] flex flex-col gap-3 p-4">
                {/* brand name & ratings */}
                <div className="flex justify-between text-gray-400">
                    {
                        productVariantOptions === null ?
                        <div className="flex w-full justify-between">
                            <div className="w-40 h-6 basis-1/4 rounded-md overflow-hidden"><Skeletan /></div>
                            <div className="w-20 h-6 basis-1/4 rounded-md overflow-hidden"><Skeletan /></div>
                        </div>
                        :
                        <>
                            <div>Muscletech</div>
                            <div className="flex items-center gap-2">
                                <RatingStars rating={singleProduct.avgRating} outOf={5}  />
                                <div>{singleProduct.avgRating}</div>
                                <div>({singleProduct.numReviews})</div>
                            </div>
                        </>
                    }
                </div>


                {
                    productVariantOptions === null ?
                        <div className="w-full rounded-md h-7 overflow-hidden">
                            <Skeletan />
                        </div>
                        :
                        <div className="text-gray-700 text-xl font-semibold">{singleProduct.name} - {selectedWeightVariant.weight} (2 lb), {selectedFlavorVariant}</div>
                }


                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        {
                            productVariantOptions === null ?
                                <div className="w-full rounded-md h-10 overflow-hidden">
                                    <Skeletan />
                                </div>
                                :
                                <>
                                    <div className="text-3xl text-gray-800"><span>₹</span><span className="font-semibold">{Math.floor(((productVariantOptions?.[selectedFlavorVariant]?.[0].price||0))-((((productVariantOptions?.[selectedFlavorVariant]?.[0].price||0))*(Number(off??0)))/100))}</span></div><span className="text-gray-600">(inclusive of all taxes, Free Delivery)</span><span className="border border-blue-200 bg-blue-50 text-blue-700 px-3 py-0.5 text-sm rounded-sm">Bestseller</span>
                                </>
                        }
                    </div>

                    <div className="text-gray-500">
                        {
                            productVariantOptions === null ?
                                <div className="w-full rounded-md h-6 overflow-hidden">
                                    <Skeletan />
                                </div>
                                :
                                <>
                                    <span>MRP:</span><span className="line-through">{productVariantOptions?.[selectedFlavorVariant]?.[0].price}</span> <span className="text-gray-600">Save : ₹{singleProduct.price - Math.floor(((productVariantOptions?.[selectedFlavorVariant]?.[0].price||0))-(((productVariantOptions?.[selectedFlavorVariant]?.[0].price||0)*(Number(off??0)))/100))} ({off}% Off)</span>
                                </>
                        }
                    </div>
                    {
                        productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].stock?
                            <div className="text-green-600 flex items-center gap-2">
                                <div>In Stock</div>
                                <div className="w-2 h-2 relative translate-0.25">
                                    <div className="h-full w-full bg-green-300 animate-ping absolute origin-center top-0 left-0 rounded-full"></div>
                                    <div className="h-full w-full bg-green-400 animate-pulse rounded-full"></div>
                                </div>
                            </div>
                            :
                            <div className="flex items-center gap-2">
                                <div className="text-red-600">Out of Stock</div>
                                <div className="w-1.75 h-1.75 relative translate-0.25">
                                    <div className="h-full w-full bg-red-300 animate-ping absolute origin-center top-0 left-0 rounded-full"></div>
                                    <div className="h-full w-full bg-red-400 animate-pulse rounded-full"></div>
                                </div>
                                <span className="text-gray-400 text-xs ml-1">( try other variants if available )</span>
                            </div>

                    }
                    <div>
                       {/* add to cart */}
                       <div className="flex items-center gap-4 w-full sm:w-60 h-10">
                        <div className={`
                            relative w-full h-full overflow-hidden pointer-events-auto
                            "opacity-100"
                        `}>
                            <button ref={addToCartBtnRef}
                                disabled={(productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].stock||0)<=0}
                                className={`
                                    border
                                    ${(productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index].stock||0) > 0 ? "border-green-300 bg-green-300 text-green-800 hover:bg-green-200":"border-gray-200 bg-gray-50 text-gray-300"}
                                    text-center content-center h-full w-full rounded-lg
                                    transition-all ease-in-out duration-300
                                `}
                                
                                onClick={addToCartHandler}
                            >
                                {
                                    (productVariantOptions === null || isCartMutating) ?
                                        <div className="w-max mx-auto">
                                            <Spinner color="var(--color-green-800)" type="secondary" />
                                        </div>
                                        :
                                        `Add to Cart ${quantityInCart}`
                                }
                            </button>
                            {/* quantity stepper */}
                            <div className={`
                                flex justify-center items-center
                                bg-primary-100 text-center content-center h-full w-full rounded-lg absolute left-0 overflow-hidden
                                ${quantityInCart>0?"bottom-0":"-bottom-full"}
                                transition-all ease-in-out duration-300 px-0.25
                            `}>
                                <button className="basis-1/2 h-full content-center bg-primary-100 hover:bg-primary-50"
                                    //disabled={!!processState}
                                    //onClick={()=>removeFromCartHandler({productID:productVariantOptions.product._id, variant:`${productVariantOptions.product._id}#${selectedFlavorVariant}#${selectedWeightVariant.weight}#${productVariantOptions["variants"][selectedFlavorVariant][selectedWeightVariant.index].price}`, quantity:1})}
                                    onClick={()=>removeFromCartHandler()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" className="size-5 mx-auto text-primary-700">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>
                                <div className="basis-1/4 h-full text-lg content-center text-gray-700 bg-white">{quantityInCart}</div>
                                <button className="basis-1/2 h-full content-center bg-primary-100 hover:bg-primary-50"
                                    //disabled={!!processState}
                                    onClick={addToCartHandler}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" className="size-5 mx-auto text-primary-700">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                       </div>
                    </div>
                </div>
                {/* flavors & weights */}
                <div>
                    {/* flavors */}
                    <div className="py-1">
                        <div className="py-1 mt-2">
                            <span className="text-gray-500">Flavor : </span>
                            <span className="text-gray-600">{selectedFlavorVariant}</span>
                        </div>

                        {
                            productVariantOptions === null ?
                            <div className="w-full h-10 rounded-md overflow-hidden">
                                <Skeletan />
                            </div>
                            :
                            <div className="relative">
                                <div className="py-2 overflow-x-scroll w-full sm:scrollbar-thin">
                                    <div className="w-max flex gap-4 group fog-x">
                                        {/* only to give leftmost space */}
                                        <div className={`
                                            shrink-0 w-10 pointer-events-none
                                        `}></div>

                                        {/* flavor items */}
                                        {
                                            singleProduct.variants.reduce((acc, iter) => {
                                                const flavor = capitalizeString(iter.split("#")[0]);
                                                if (!acc.includes(flavor) ) {
                                                    acc.push(flavor);
                                                }                                            
                                                return acc;
                                            }, [] as string[]).map((flvr) => (
                                                <button key={flvr}
                                                    className={`
                                                        border px-2 py-1 rounded-sm
                                                        ${selectedFlavorVariant===flvr?"border-primary-300 bg-primary-50 text-primary-500/70":"border-gray-300 bg-gray-50 text-gray-500"}
                                                        hover:scale-95 transition-all ease-in-out duration-300
                                                    `}
                                                    onClick={()=>{setSelectedFlavorVariant(flvr); setSelectedWeightVariant({weight:"", index:0})}}
                                                >{flvr}</button>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    {/*<pre className="text-xs">{JSON.stringify(productVariantOptions?.[selectedFlavorVariant], null, `\t`)}</pre>
                    <pre className="text-xs">{JSON.stringify(productVariantOptions?.[selectedFlavorVariant][selectedWeightVariant.index], null, `\t`)}</pre>
                    <pre className="text-xs">{JSON.stringify({selectedFlavorVariant, selectedWeightVariant}, null, `\t`)}</pre>*/}

                    {/* weights */}
                    <div className="py-1">
                        <div className="py-1 mt-2">
                            <span className="text-gray-500">Weight : </span>
                            <span className="text-gray-600">{selectedWeightVariant.weight} (0.88lb)</span>
                        </div>
                        {
                            productVariantOptions === null ?
                                <div className="w-full h-28 rounded-md overflow-hidden">
                                    <Skeletan />
                                </div>
                                :
                                <div className="relative">
                                    <div className="py-2 overflow-x-scroll sm:scrollbar-thin">
                                        <div className="w-max flex gap-4 group fog-x">

                                            {/* only to give leftmost space */}
                                            <div className={`
                                                shrink-0 w-10 pointer-events-none
                                            `}></div>

                                            {/* weight items */}
                                            {
                                                productVariantOptions?.[selectedFlavorVariant]?.map(({weight, price, stock}, index) => (
                                                    <button
                                                        key={index}
                                                        disabled={stock===0}
                                                        className={`
                                                            border
                                                            ${stock===0&&"border-dashed opacity-50"}
                                                            ${selectedWeightVariant.weight===weight?"border-primary-300 bg-primary-50 text-primary-500/70":"border-gray-300 bg-gray-50 text-gray-500"}
                                                            border-gray-300 bg-gray-50 text-gray-500 shrink-0
                                                            text-left rounded-sm overflow-hidden hover:scale-95 transition-all ease-in-out duration-300
                                                            `}
                                                        onClick={()=>setSelectedWeightVariant({weight, index})}
                                                    >
                                                        <div className={`border-b p-2 border-b-gray-300`}>{weight} (1.1 lb)</div>
                                                        <div className="bg-white p-2">
                                                            <div>
                                                                <span className="text-gray-700 text-xl font-semibold">₹{price}</span><span className="text-gray-500 text-sm"> ₹(
                                                                    {
                                                                        Math.round(
                                                                            ((
                                                                                (productVariantOptions?.[selectedFlavorVariant][0].price)/
                                                                            ((weight.includes("kg"))?(Number(weight.slice(0,-2))*1000):(Number(weight.slice(0,-1)))
                                                                            )))*100
                                                                        )
                                                                    }
                                                                    /100g)</span>
                                                            </div>
                                                            <div className="text-gray-400 text-sm">Save ₹100</div>
                                                        </div>
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
                {/* you may also like */}
                <div className="">
                    <div className="text-lg my-3">You May Also Like</div>
                    <div className="overflow-x-scroll sm:scrollbar-thin pb-4">
                        <div className="flex gap-4">
                            {   productVariantOptions === null ?
                                [1,2,3].map((_, index) => (
                                    <div key={index} className="border border-gray-200 basis-1/3 h-60 shrink-0 rounded-md overflow-hidden">
                                        <Skeletan />
                                    </div>
                                ))
                                :
                                [1,2,3,4,5].map((index) => (
                                    <div key={index} className="">
                                        <ProductCard
                                            product={{_id:"1234567890", brand:"brand9", category:"protein", subCategory:"", dietaryType:"vegan", name:"product9", numReviews:1229, price:5390, rating:4, weight:"1kg", flavor:"Choco Mint", variants:["Choco Mint#500g#3350#vegan","Choco Mint#1kg#5390#vegan","Choco Mint#2kg#7600#vegan","Blue Lagoon#1kg#4700#nonveg"], tags:["creatine", "choco", "mint"], images:["/test-category.webp", '/animo_acids.webp'], warnings:[]}}
                                            isVeg={true}
                                            isBestseller={false}
                                            isCartMutating={true}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* product details table */}
                <div className="">
                    <div className="text-lg my-3">Details</div>
                    <div className="flex flex-col gap-4">
                        <div className="flex rounded-lg overflow-hidden">
                            {   productVariantOptions === null &&
                                [{heading:"30g", para:"Protein/Serving"}, {heading:"", para:""}, {heading:"65.2%", para:"Protein"}, {heading:"", para:""}, {heading:"20", para:"Servings"}].map((iter) => (
                                    iter.heading?
                                    (
                                        <div className="bg-gray-100 py-5 text-center shrink-0 basis-1/3">
                                            <div className="text-gray-600 text-md sm:text-lg font-semibold">{iter.heading}</div>
                                            <div className="text-gray-500 text-sm sm:text-md">{iter.para}</div>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className="bg-gray-100 py-4">
                                            <div className="bg-gray-300 h-full w-0.75 rounded-2xl"></div>
                                        </div>
                                    )
                                ))
                            }
                        </div>
                        <div>
                            <div className={`relative grid grid-cols-2 gap-4 ${!revealer&&"h-50"} overflow-hidden`}>
                                {
                                    productVariantOptions === null ?
                                    [{heading:"Weight", para:"0.91kg"}, {heading:"Flavor", para:"Choco Mint"},{heading:"Deitry Type", para:"Veg"}, {heading:"Serving Size", para:"46g"}, {heading:"From", para:"Powder"}, {heading:"Packaging Type", para:"Jar"}, {heading:"Benefits", para:"Build Muscle, Muscle Recovery"}, {heading:"Gender", para:"Male, Female"}, {heading:"Lifestage", para:"Adults"}, {heading:"Weight", para:"0.91kg"}].map((iter) => (

                                        <>
                                            <span className="text-gray-400">{iter.heading}</span>
                                            <span className="rounded-md overflow-hidden"><Skeletan /></span>
                                        </>
                                        
                                    ))
                                    :
                                    [{heading:"Weight", para:"0.91kg"}, {heading:"Flavor", para:"Choco Mint"},{heading:"Deitry Type", para:"Veg"}, {heading:"Serving Size", para:"46g"}, {heading:"From", para:"Powder"}, {heading:"Packaging Type", para:"Jar"}, {heading:"Benefits", para:"Build Muscle, Muscle Recovery"}, {heading:"Gender", para:"Male, Female"}, {heading:"Lifestage", para:"Adults"}, {heading:"Weight", para:"0.91kg"}].map((iter) => (

                                        <>
                                            <span className="text-gray-400">{iter.heading}</span>
                                            <span className="text-gray-600">{iter.para}</span>
                                        </>
                                        
                                    ))
                                }
                                <div className="h-15 w-full absolute left-0 bottom-0 bg-linear-0 from-gray-50 to-transparent"></div>
                            </div>
                            <div className="w-max my-2 mx-auto">
                                <button className="border border-gray-200 text-gray-600 text-sm w-max py-1 px-3 rounded-md hover:bg-gray-50" onClick={() => setRevealer(!revealer)}>{revealer?"Hide":"View More"}</button>
                            </div>
                        </div>
                    </div> 
                </div>
                <div className="">
                    <div className="text-lg my-3">Product Images</div>
                    <div className="overflow-x-scroll scrollbar-thin">
                        <div className="flex gap-2 p-2">
                            {
                                productVariantOptions === null ?
                                [1,2,3].map((_, index) => (
                                    <div key={index} className="basis-1/3 h-70 rounded-md overflow-hidden">
                                        <Skeletan />
                                    </div>
                                ))
                                :
                                [1,2,3,4,5,6,7,8,9,10].map((iter) => (
                                    <img key={iter} src="/test-category.webp"
                                        alt="/test-category.webp"
                                        className="max-w-6040 rounded-lg"
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* ratings and reviews summery */}
                {
                    productVariantOptions !== null &&
                        <ReviewSummery productID={productID} averageRating={4.5} totalRatings={361} numOfReviews={942} ratings={{oneStar:259, twoStar:63, threeStar:25, fourStar:377, fiveStar:218}}  />
                }
                {/* reviews */}
                <div className="">
                    <div className="mb-30 mt-10 py-2 overflow-x-scroll sm:scrollbar-thin px-4">
                        {/*<pre>{JSON.stringify(allReviews, null, `\t`)}</pre>*/}
                        <div className="flex gap-4 w-max">
                            {
                                allReviews.map((aa) => (
                                    <ReviewCard key={aa.userID+aa.createdAt} {...aa} />
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* dynamic bottom label */}
                {
                    productVariantOptions !== null &&
                        <div className={`bg-white fixed right-0 ${isAddToCartVisible?"-bottom-full":"bottom-0"} sm:mr-4 w-full sm:w-[49.8%] flex justify-between sm:rounded-md items-center py-3 px-4 [box-shadow:0px_0px_6px_0.5px_var(--color-gray-300)] transition-all ease-in-out duration-300 z-2`}>
                            <div>
                                <div className="flex items-center gap-2"><div className="text-3xl text-gray-800"><span>₹</span><span className="font-semibold">{Math.floor((productVariantOptions?.[selectedFlavorVariant]?.[0].price||0)-(((productVariantOptions?.[selectedFlavorVariant]?.[0].price||0)*(Number(off??0)))/100))}</span></div><span className="text-gray-600 hidden sm:inline">(inclusive of all taxes, Free Delivery)</span></div>
                                <div className="text-gray-500"><span>MRP:</span><span className="line-through">{productVariantOptions?.[selectedFlavorVariant]?.[0].price}</span> <span className="text-gray-600 hidden sm:inline">Save : {singleProduct.price - Math.floor((productVariantOptions?.[selectedFlavorVariant]?.[0].price||0)-(((productVariantOptions?.[selectedFlavorVariant]?.[0].price||0)*(Number(off??0)))/100))} ({off}% Off)</span></div>
                            </div>
                            <div className="h-11 w-full max-w-50">
                                <button className={`
                                    border border-green-300 bg-green-300 text-center content-center h-full w-full rounded-md
                                    transition-all ease-in-out duration-300 hover:bg-green-200
                                `}
                                    
                                    onClick={addToCartHandler}
                                >
                                    {
                                        isCartMutating ?
                                        <div className="w-max mx-auto">
                                                <Spinner color="var(--color-green-800)" type="secondary" />
                                        </div>
                                        :
                                        "Add to Cart"
                                    }
                                </button>
                                {/*<button className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-md min-w-50 w-full">Add to Cart</button>*/}
                            </div>
                        </div>
                }
            </div>
        </section>
        //<HandlePageUIWithState isLoading={dataStatus.isLoading} isSuccess={dataStatus.isSuccess} error={dataStatus.error}
        //    errorChildren={
        //        <>
        //            <img src="/page_not_found8.jpg" alt="/page_not_found8.jpg" />
        //            <p className="text-center">error reason : {dataStatus.error}</p>
        //            <div className="text-center">
        //                <button className="bg-[#dc7589] text-white text-[1.2rem] py-2 px-3 font-medium rounded-[8px] my-7" onClick={() => navigate("/home")}>Go Back Home</button>
        //            </div>
        //        </>
        //    }
        //>
        //    <section className="max-w-602xl mx-auto">
        //        <div className="flex justify-between items-center py-2 px-2 bg-[#f4476a24]">
        //            <div className="flex items-center gap-5">
        //                <div>
        //                    <ImageWithFallback
        //                        src={`${import.meta.env.VITE_SERVER_URL}/api/v1${singleProduct.images}`}
        //                        alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${singleProduct.images}`}
        //                        fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
        //                        className="w-[50px] h-[50px]"
        //                    />
        //                </div>
        //                <div className="flex flex-col">
        //                    <span className="text-[1rem] font-semibold">{singleProduct.brand}</span>
        //                    <span className="text-[0.9rem]">{singleProduct.name}</span>
        //                </div>
        //            </div>
        //            <div className="text-[1rem] flex gap-2"><span>{singleProduct.rating}</span> <RatingStars rating={singleProduct.rating||0} outOf={5} /> ({singleProduct.numReviews})</div>
        //        </div>
        //        <p className="text-gray-700 px-2 font-semibold">{singleProduct.brand} {singleProduct.name} {singleProduct.category} ({singleProduct.flavor}, {singleProduct.weight}) - {singleProduct.description}</p>

        //        <ImageSliderWithPreview singleProduct={singleProduct} />

        //        {
        //            isUserAdmin() &&
        //            <div className="border-[1px] border-gray-100 my-2 px-2 py-4">
        //                <div className="text-[1.3rem]">
        //                    <span>Add Images</span><span className="font-semibold">Milk Chocolate</span>
        //                </div>
        //                <div className="flex flex-col mt-2 gap-2">
        //                    <input multiple={true} name="images" type="file" className="px-2 py-3 text-[1.2rem] bg-gray-200 text-gray-600" onChange={onChangeHandler} />
        //                    <button className="py-3 text-[1.2rem] bg-[#fa3368] text-white rounded-2xl" onClick={upload}>Submit</button>
        //                </div>
        //            </div>
        //        }

        //        <div className="px-2">
        //            {
        //                quantityInCart ?
        //                <div className="border-2 flex justify-between items-center w-60 mx-auto rounded-2xl">
        //                    <button className="text-3xl font-semibold w-[4rem] h-[3rem]" disabled={isCartMutating} style={{opacity:isCartMutating?0.2:1}} onClick={removeFromCartHandler}>-</button>
        //                    <span className="text-xl">{isCartMutating?<Spinner width="20px" />:quantityInCart}</span>
        //                    <button className="text-3xl font-semibold w-[4rem] h-[3rem]" disabled={isCartMutating} style={{opacity:isCartMutating?0.2:1}} onClick={addToCartHandler}>+</button>
        //                </div>
        //                :
        //                <button className="w-full h-[3rem] text-[1.2rem] rounded-2xl active:bg-gray-100 bg-yellow-300" onClick={addToCartHandler}>{isCartMutating?<Spinner width="20px" />:"Add to cart"}</button>

        //            }
        //        </div>


        //        <div className="border-[1px] border-gray-100 my-2 px-2 py-4">
        //            <div className="text-[1.3rem]">
        //                <span>Flavor Name: </span><span className="font-semibold">Milk Chocolate</span>
        //            </div>
        //            <div className="flex text-gray-800 text-[1.2rem] gap-6 overflow-scroll py-2">
        //                {
        //                    [1,2,3,4,5,6,7].map((num) => (
        //                        <div key={num} className="border-2 border-gray-700 font-semibold px-3 py-1 rounded-[4px]">Flavor{num}</div>
        //                    ))
        //                }
        //            </div>
        //        </div>
        //        <div className="border-[1px] border-gray-100 my-2 px-2 py-4">
        //            <div className="text-[1.3rem]">
        //                <span>Size: </span><span className="font-semibold">2Kg (Pack of 1)</span>
        //            </div>
        //            <div className="flex text-gray-800 text-[1.2rem] gap-6 overflow-scroll py-2 w-full">
        //                {
        //                    ["2Kg (Pack of 1)", "3Kg (Pack of 1)", "4Kg (Pack of 1)", "5Kg (Pack of 1)", "6Kg (Pack of 1)"].map((flav, index) => (
        //                        <div key={index} className="border-2 border-gray-700 font-semibold px-3 py-1 rounded-[4px]">{flav}</div>
        //                    ))
        //                }
        //            </div>
        //        </div>
        //        <div className="px-2">
        //            <button className="bg-yellow-300 w-full h-[3rem] text-[1.2rem] rounded-2xl active:bg-gray-100">See Similar Items</button>
        //        </div>
        //        <div className="border-[1px] border-gray-100 my-2 px-2 py-4">
        //            <div className="flex text-5xl justify-around">
        //                {
        //                    Array.from({length:5}).map((_,num) => {
        //                        if ((rating > 0) && (rating-num > 0)) {
        //                            return <span className="text-yellow-400" key={num} onClick={() => {
        //                                if (rating === num+1) {
        //                                    setRating(0);
        //                                }
        //                                else{
        //                                    setRating(num+1);
        //                                }
        //                            }}><BiSolidStar /></span>
        //                        }else{
        //                            return <span className="text-yellow-400" key={num} onClick={() => {
        //                                if (rating === num+1) {
        //                                    setRating(0);
        //                                }
        //                                else{
        //                                    setRating(num+1);
        //                                }
        //                            }}><BiStar /></span>
        //                        }
        //                    })
        //                }
        //            </div>
        //            <div className="mt-4 rounded-[8px]">
        //                <textarea rows={5} className="border border-primary-200 w-full p-2 rounded-sm" placeholder="Comment...(optional)" onChange={(e) => setComment(e.target.value)}></textarea>
        //            </div>
        //            <div className="mt-4">
        //                <button className="bg-yellow-300 w-full h-[3rem] text-[1.2rem] rounded-2xl active:bg-gray-100" disabled={isReviewMutating} onClick={createReviewHandler}>{isReviewMutating?<Spinner width="20px" />:"Submit"}</button>
        //            </div>
        //        </div>


                
        //        <ProductsSlider heading="Other variants" products={variantProducts} />
                
        //        <ProductsSlider heading={`Other products of ${singleProduct.brand}`} products={sameBrandProducts} />
               
        //        <ProductsSlider heading={`${capitalizeString(singleProduct.category)} from other brands`} products={sameCategoryProducts} />





        //        <div className="border-[1px] border-gray-100 my-2 px-2 py-4">
        //            <div className="text-[1.3rem]">
        //                <span>Measurement</span><span className="font-semibold"></span>
        //            </div>
        //            <div className="text-[1.2rem] gap-6 overflow-scroll w-full">
        //                <div className="flex justify-between items-center border-b-[1px] border-b-gray-600">
        //                    <span className="bg-gray-100 p-4 w-[40%]">Item Weight</span>
        //                    <span>4 Pounds</span>
        //                </div>
        //                <div className="flex justify-between items-center border-b-[1px] border-b-gray-600">
        //                    <span className="bg-gray-100 p-4 w-[40%]">No of Items</span>
        //                    <span>1</span>
        //                </div>
        //                <div className="flex justify-between items-center border-b-[1px] border-b-gray-600">
        //                    <span className="bg-gray-100 p-4 w-[40%]">Age Range (Description)</span>
        //                    <span>Adult</span>
        //                </div>
        //                <div className="flex justify-between items-center border-b-[1px] border-b-gray-600">
        //                    <span className="bg-gray-100 p-4 w-[40%]">Net Content Volume</span>
        //                    <span>9.41 Litres</span>
        //                </div>
        //            </div>
        //        </div>
        //        <div className="border-[1px] border-gray-100 my-2 px-2 py-4">
        //            <div className="text-[1.3rem] font-semibold">
        //                <span>Safety and product resources</span><span className="font-semibold"></span>
        //            </div>
        //            <div className="text-[1rem] w-full">
        //                <p>As the Food and Drug Administration (FDA) advises, dietary supplements can support your overall health but may also have powerful effects on the body. It’s important to read labels carefully, exercise caution, and consult your healthcare professional before taking any supplement. Side effects are more likely if supplements are taken in high doses, as substitutes for prescribed medications, or in combination with multiple supplements. If you experience severe side effects, discontinue use immediately and seek medical attention.</p>
        //            </div>
        //        </div>
        //        <div className="border-[1px] border-gray-100 my-2 px-2 py-4">
        //            <div className="text-[1.3rem] font-semibold">
        //                <span>LEGAL DESCLAIMER</span><span className="font-semibold"></span>
        //            </div>
        //            <div className="text-[1rem] w-full">
        //                <p>Some states prohibit the sale of products intended for weight loss or muscle building to individuals under age 18. Check your local laws prior to purchase.</p>
        //            </div>
        //        </div>
        //        <div className="border-[1px] border-gray-100 my-2 px-2 py-4">
        //            <div className="text-[1.3rem] font-semibold">
        //                <span>Top Reviews</span><span className="font-semibold"></span>
        //            </div>
        //            <div className="text-[1rem] w-full flex flex-col gap-2">
        //                {
        //                    allReviews.map(({productID, userID, ...review}) => (
        //                        <ReviewCard
        //                            key={productID.name}
        //                            productID={productID}
        //                            userID={userID}
        //                            rating={review.rating}
        //                            comment={review.comment}
        //                            isVerifiedPurchase={review.isVerifiedPurchase}
        //                            createdAt={review.createdAt}
        //                            updatedAt={review.updatedAt}
        //                        />
        //                    ))
        //                }
        //            </div>
        //        </div>
        //    </section>
        //</HandlePageUIWithState>
    );
};

export default SingleProduct;