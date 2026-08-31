import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { addImages, getSimilarProducts, getSingleProduct } from "../apis/product.api";
import { type ProductTypes, type ReviewTypesPopulated } from "../utils/types";
import { getReviews, createReview } from "../apis/review.api";
import { useUser } from "../contexts/UserContext";
import { addToCart, removeFromCart } from "../apis/cart.api";
import { useCart } from "../contexts/CartContext";
import { BiStar } from "react-icons/bi";
import { FaArrowLeftLong, FaArrowRightLong, FaShare } from "react-icons/fa6";
import ProductCard from "../components/ProductCard.component";
import { GoHeartFill } from "react-icons/go";
const off = 10;
function SingleProduct() {
    const {productID, variant} = useParams();
    const [images, setImages] = useState<FileList|null>(null);
    const [singleProduct, setSingleProduct] = useState<ProductTypes>({_id:"", brand:"brand1", category:"other", dietaryType:"veg", images:[], name:"Product1", numReviews:0, price:800, rating:0, tags:[],
        variants:[
            "Unflavored#1kg#800#veg#''#''#1#''",
            "Unflavored#100g#80#veg#''#''#0#''",
            "Unflavored#200g#160#veg#''#''#1#''",
            "Unflavored#500g#400#veg#''#''#1#''",
            "Mango Shake#1kg#1000#veg#''#''#1#''",
            "Mango Shake#100g#100#veg#''#''#1#''",
            "Mango Shake#200g#200#veg#''#''#0#''",
            "Mango Shake#500g#500#veg#''#''#1#''",
            "Pista Badaam#1kg#2100#veg#''#''#1#''",
            "Pista Badaam#100g#210#veg#''#''#1#''",
            "Pista Badaam#2kg#4200#veg#''#''#1#''",
            "Cashue Hazel#1kg#4700#veg#''#''#1#''",
            "Cashue Hazel#200g#2700#veg#''#''#1#''",
            "Cashue Hazel#5kg#6800#veg#''#''#1#''",
        ],
        weight:"1kg", description:"", flavor:"Unflavored", ingredients:[""], nutritionFacts:{calories:0, carbs:0, fat:0, protein:0, servingSize:"", servingsPerContainer:0}, stock:0, warnings:[]});
    const [allReviews, setAllReviews] = useState<ReviewTypesPopulated[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [quantityInCart, setQuantityInCart] = useState<number>(0);
    const {isUserAdmin} = useUser();
    const {cartData, setCartData} = useCart();
    const navigate = useNavigate();
    const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    const [isCartMutating, setIsCartMutating] = useState<boolean>(false);
    const [isReviewMutating, setIsReviewMutating] = useState<boolean>(false);
    const [variantProducts, setVariantProducts] = useState<ProductTypes[]>([]);
    const [sameBrandProducts, setSameBrandProducts] = useState<ProductTypes[]>([]);
    const [sameCategoryProducts, setSameCategoryProducts] = useState<ProductTypes[]>([]);
    const [revealer, setRevealer] = useState<boolean>(false);
    const [isLikeActive, setIsLikeActive] = useState<boolean>(false);
    const [isAddToCartVisible, setIsAddToCartVisible] = useState<boolean>(false);
    const addToCartBtnRef = useRef<HTMLButtonElement|null>(null);
    const [selectedFlavorVariant, setSelectedFlavorVariant] = useState<string>("Unflavored");
    const [selectedWeightVariant, setSelectedWeightVariant] = useState<{weight:string; index:number;}>({weight:"1kg", index:0});
    const [productVariantOptions, setProductVariantOptions] = useState<{[key:string]:{flavor:string; weight:string; price:number; stock:number;}[];}>({
        "Unflavored":[
            {flavor:"Unflavored", weight:"100g", price:80, stock:1},
            {flavor:"Unflavored", weight:"200g", price:160, stock:0},
            {flavor:"Unflavored", weight:"500g", price:400, stock:1},
            {flavor:"Unflavored", weight:"1kg", price:800, stock:1}
        ],
        "Mango Shake":[
            {flavor:"Mango Shake", weight:"100g", price:100, stock:1},
            {flavor:"Mango Shake", weight:"200g", price:200, stock:1},
            {flavor:"Mango Shake", weight:"500g", price:500, stock:0},
            {flavor:"Mango Shake", weight:"1kg", price:1000, stock:1}
        ],
        "Pista Badaam":[
            {flavor:"Pista Badaam", weight:"100g", price:210, stock:1},
            {flavor:"Pista Badaam", weight:"1kg", price:2100, stock:1},
            {flavor:"Pista Badaam", weight:"2kg", price:4200, stock:1}
        ],
        "Cashue Hazel":[
            {flavor:"Cashue Hazel", weight:"200g", price:2700, stock:1},
            {flavor:"Cashue Hazel", weight:"1kg", price:4700, stock:1},
            {flavor:"Cashue Hazel", weight:"5kg", price:6800, stock:1}
        ]


    });
    

    async function getSingleProductHandler(signal?:AbortSignal) {
        setDataStatus({isLoading:true, isSuccess:false, error:""});
        if (!productID) return;
        
        const res = await getSingleProduct({productID}, signal);
        console.log({res});

        if (res.success) {
            setSingleProduct(res.jsonData);
            setDataStatus({isLoading:false, isSuccess:true, error:""});
            setSelectedFlavorVariant(singleProduct.flavor);
            setSelectedWeightVariant({weight:singleProduct.weight, index:0});
            const transformedVariantData = singleProduct.variants.reduce((acc, iter) => {
                const flavor = iter.split("#")[0];
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
            setProductVariantOptions(transformedVariantData);
        }
        else{
            setDataStatus({isLoading:false, isSuccess:false, error:res.message});
        }

    };

    async function createReviewHandler() {
        setIsReviewMutating(true);
        if (!productID) return;
        
        console.log({productID, rating, comment});
        
        
        const res = await createReview({productID, rating, comment});
        
        console.log(res);
        setIsReviewMutating(false);
    };

    async function onChangeHandler(e:ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        setImages(files);
    };
    async function upload() {
        const formData = new FormData();
        
        if (!productID)  throw new Error("ProductID params not found");
        if (!images || images.length === 0) throw new Error("Please select atleast one image");
        if (!singleProduct) throw new Error("singleProduct not found");
        
        formData.append("productID", productID);
        Array.from(images).forEach((image) => {
            formData.append("images", image);
        });
        
        const res = await addImages(formData);

        setSingleProduct({...singleProduct, images:res.jsonData.images});
        console.log({res});
        
    };
    async function getReviewsHandler(signal?:AbortSignal) {
        if (!productID) throw new Error("productID is not defiend");

        const res = await getReviews({productID, signal});
        setAllReviews(res.jsonData);
        console.log(res);
    };

    async function addToCartHandler() {
        try {
            setIsCartMutating(true);
            if (!productID) throw Error("productID not found");
            if (!variant) throw Error("variant not found");
    
            const res = await addToCart({productID, variant, quantity:1});
    
            if (cartData.length === 0) {
                setCartData([{...res.jsonData.products, variant, quantity:res.jsonData.quantity}]);
            }
            else{
                setCartData((prev) => {
                    const findResult = prev.find(p => (p._id === res.jsonData.products._id && p.variant===res.jsonData.variant));
    
                    if (findResult) {
                        return prev.map((p) => (p._id === res.jsonData.products._id && p.variant===res.jsonData.variant)?{...p, quantity:res.jsonData.quantity}:p);
                    }
                    else{
                        return [...prev, {...res.jsonData.products, variant, quantity:res.jsonData.quantity}];
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setIsCartMutating(false);            
        }
    };

    async function removeFromCartHandler() {
        try {
            setIsCartMutating(true);
            if (!productID) throw Error("productID not found");
            if (!variant) throw Error("variant not found");
    
            const res = await removeFromCart({productID, variant, quantity:1});
    
            const selectedProduct = cartData.find((p) => p._id === res.jsonData.products);
    
            if (!selectedProduct) return Error("selectedProduct not found");
            if (res.jsonData.quantity < 1) {
                setCartData(cartData.filter(p => p._id !== res.jsonData.products));
            }
            else{
                selectedProduct.quantity = res.jsonData.quantity;
                setCartData(cartData.map(p => p._id === res.jsonData.products?{...p, quantity:res.jsonData.quantity}:p));
                "agar product ki quantity kam hui lekin poora remove nahi hua to usse handle karna hai"
            }
        } catch (error) {
            
        }
        finally{
            setIsCartMutating(false);
        }
    };

    async function getProductsVariant() {
        if (!singleProduct.brand || !singleProduct.category) return;

        const res = await getSimilarProducts({excludeProductID:singleProduct._id, brand:singleProduct.brand, category:singleProduct.category});

        if (res.success) {
            setVariantProducts(res.jsonData);
            console.log({reso:res});
        }
    };
    async function getProductsWithSameBrand() {
        if (!singleProduct.brand) return;

        const res = await getSimilarProducts({excludeProductID:singleProduct._id, brand:singleProduct.brand});

        if (res.success) {
            setSameBrandProducts(res.jsonData);
            console.log({reso:res});
        }
    };
    async function getProductsWithOfCategory() {
        if (!singleProduct.category) return;

        const res = await getSimilarProducts({excludeProductID:singleProduct._id, category:singleProduct.category});

        if (res.success) {
            setSameCategoryProducts(res.jsonData);
            console.log({reso:res});
        }
    };
    

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getSingleProductHandler(signal);
        getReviewsHandler(signal);

        return() => {controller.abort();}
    }, []);
    
    useEffect(() => {
        getProductsVariant();
        getProductsWithSameBrand();
        getProductsWithOfCategory();
    }, [singleProduct])
    
    useEffect(() => {
        const findResult = cartData.find(p => p._id === singleProduct._id);
        setQuantityInCart(findResult?.quantity||0);
    }, [cartData]);

    useEffect(() => {
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
            <div className="sm:border border-gray-200 rounded-2xl block mx-auto sm:mx-0 w-full sm:top-20 sm:left-0 sm:sticky sm:w-[45%] p-4">
                <div className="relative">
                    <img 
                        src="/test-category.webp" 
                        alt="/test-category.webp"
                        className="mx-auto w-md"
                    />
                    <div className="bg-green-200/80 text-green-700 absolute -top-0.25 -left-0.25 rounded-tl-2xl rounded-br-2xl px-4 py-0.75 text-md">25% 0ff</div>
                    <div className="w-8 h-8 absolute top-0 right-0"><img src="/veg_icon.svg" alt="/veg_icon.svg" className="w-full" /></div>
                    <button className="border border-gray-200 w-8 h-8 text-xl absolute top-12 right-0 rounded-md grid place-items-center group" onClick={() => setIsLikeActive(!isLikeActive)}><GoHeartFill className={`${isLikeActive?"text-pink-400":"text-gray-200"} group-active:scale-130 transition-all ease-in-out duration-300`} /></button>
                    <button className="border border-gray-200 w-8 h-8 absolute top-24 right-0 rounded-md grid place-items-center text-gray-600"><FaShare/></button>
                </div>
            </div>

            {/* right part */}
            <div className="sm:border border-gray-200 rounded-t-2xl w-full sm:absolute sm:top-0 sm:right-0 sm:w-[51%] flex flex-col gap-3 p-4">
                <div className="flex justify-between text-gray-400">
                    <div>Muscletech</div>
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                            <BiStar />
                            <BiStar />
                            <BiStar />
                            <BiStar />
                        </div>
                        <div>4.6</div>
                        <div>(104)</div>
                    </div>
                </div>
                <div className="text-gray-700 text-xl font-semibold">{singleProduct.name} - {selectedWeightVariant.weight} (2 lb), {selectedFlavorVariant}</div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2"><div className="text-3xl text-gray-800"><span>₹</span><span className="font-semibold">{Math.floor((productVariantOptions[selectedFlavorVariant][0].price)-(((productVariantOptions[selectedFlavorVariant][0].price)*(Number(off??0)))/100))}</span></div><span className="text-gray-600">(inclusive of all taxes, Free Delivery)</span><span className="border border-blue-200 bg-blue-50 text-blue-700 px-3 py-0.5 text-sm rounded-sm">Bestseller</span></div>
                    <div className="text-gray-500"><span>MRP:</span><span className="line-through">{productVariantOptions[selectedFlavorVariant][0].price}</span> <span className="text-gray-600">Save : ₹{singleProduct.price - Math.floor((productVariantOptions[selectedFlavorVariant][0].price)-(((productVariantOptions[selectedFlavorVariant][0].price)*(Number(off??0)))/100))} ({off}% Off)</span></div>
                    <div className="text-green-600 flex items-center gap-2">
                        <div>In Stock</div>
                        <div className="w-2 h-2 relative">
                            <div className="h-full w-full bg-green-400 animate-ping absolute top-0 left-0 rounded-full"></div>
                            <div className="h-full w-full bg-green-300 animate-puls rounded-full"></div>
                        </div>
                    </div>
                    <div>
                       {/* add to cart */}
                       <div className="flex items-center gap-4 w-full sm:w-60 h-10">
                        <div className={`
                                relative w-full h-full overflow-hidden pointer-events-auto
                                "opacity-100"
                            `}>
                                <button ref={addToCartBtnRef} className={`
                                    border border-green-300 bg-green-300 text-center content-center h-full w-full rounded-lg
                                    transition-all ease-in-out duration-300 hover:opacity-50
                                `}
                                    
                                    onClick={()=>{
                                        
                                    }}
                                >
                                    Add to Cart
                                </button>
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
                        <div className="">
                            <div className="py-2 overflow-x-scroll w-full sm:scrollbar-thin">
                                <div className="w-max flex gap-4 group">
                                    {/* only to give leftmost space */}
                                    <div className={`
                                        shrink-0 w-10 opacity-25 pointer-events-none
                                        hover:scale-95
                                        content-center
                                    `}><FaArrowLeftLong className="ml-auto group-hover:-translate-x-2 transition-all ease-in-out duration-300"
                                            style={{
                                                animation:"left-arrow-flow 2s ease-in infinite",
                                            }}
                                        /></div>

                                    {/* flavor items */}
                                    {
                                        singleProduct.variants.reduce((acc, iter) => {
                                            const flavor = iter.split("#")[0];
                                            if (!acc.includes(flavor) ) {
                                                acc.push(flavor);
                                            }
                                            return acc;
                                        }, [] as string[]).map((flvr, index) => (
                                            <button key={flvr} disabled={productVariantOptions[flvr][0].stock===0}
                                                className={`
                                                    border px-2 py-1 rounded-sm
                                                    ${productVariantOptions[flvr][0].stock===0&&"border-dashed opacity-50"}
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
                    </div>

                    {/* weights */}
                    <div className="py-1">
                        <div className="py-1 mt-2">
                            <span className="text-gray-500">Weight : </span>
                            <span className="text-gray-600">{selectedWeightVariant.weight} (0.88lb)</span>
                        </div>
                        <div className="">
                            <div className="py-2 overflow-x-scroll sm:scrollbar-thin">
                                <div className="w-max flex gap-4 group">

                                    {/* only to give leftmost space */}
                                    <div className={`
                                        shrink-0 w-10 opacity-25 pointer-events-none
                                        hover:scale-95 transition-all ease-in-out duration-300
                                        content-center
                                    `}><FaArrowLeftLong className="ml-auto group-hover:-translate-x-2 transition-all ease-in-out duration-300"
                                            style={{
                                                animation:"left-arrow-flow 2s ease-in infinite",
                                            }}  
                                        /></div>
                                    
                                    {/* weight items */}
                                    {
                                        productVariantOptions[selectedFlavorVariant].map(({flavor, weight, price, stock}, index) => (
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
                                                            (((productVariantOptions[selectedFlavorVariant][0].price)/
                                                            (
                                                                (weight.includes("kg"))?(Number(weight.slice(0,-2))*1000):(Number(weight.slice(0,-1)))
                                                            )))*100
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
                    </div>
                </div>
                {/* you may also like */}
                <div className="">
                    <div className="text-lg my-3">You May Also Like</div>
                    <div className="overflow-x-scroll sm:scrollbar-thin pb-4">
                        <div className="flex gap-4">
                            {
                                [1,2,3,4,5].map((iter) => (
                                    <div className="">
                                        <ProductCard
                                            product={{_id:"1234567890", brand:"brand9", category:"creatine", dietaryType:"vegan", name:"product9", numReviews:1229, price:5390, rating:4, weight:"1kg", flavor:"Choco Mint", variants:["Choco Mint#500g#3350#vegan","Choco Mint#1kg#5390#vegan","Choco Mint#2kg#7600#vegan","Blue Lagoon#1kg#4700#nonveg"], tags:["creatine", "choco", "mint"], images:["/test-category.webp", '/animo_acids.webp'], warnings:[]}}
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
                {/*  */}
                <div className="">
                    <div className="text-lg my-3">Details</div>
                    <div className="flex flex-col gap-4">
                        <div className="flex rounded-lg overflow-hidden">
                            {
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
                                [1,2,3,4,5,6,7,8,9,10].map((iter) => (
                                    <img src="/test-category.webp"
                                        alt="/test-category.webp"
                                        className="max-w-6040 rounded-lg"
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* ratings and reviews */}
                <div className="flex flex-col gap-10 mb-30">
                    <div className="flex justify-between items-center mt-6">
                        <div className="text-lg">Ratings & Reviews</div>
                        <button className="bg-linear-90 from-blue-200 via-blue-50 to-blue-200 text-blue-600 py-1 px-4 rounded-sm">Rate Product</button>
                    </div>
                    <div className="flex justify-around items-center">
                        <div className="w-max">
                            <div className="text-gray-700 text-2xl font-semibold flex gap-1 items-end w-max mx-auto"><span className="">4.6</span>/<span className="text-lg">5</span></div>
                            <div className="flex gap-1 text-yellow-400 w-max mx-auto"><BiStar /><BiStar /><BiStar /><BiStar /><BiStar /></div>
                            <div className="text-gray-500">291 Ratings & 104 Reviews</div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center text-green-500 text-xs">5 <BiStar className="size-2.5" /></span>
                                <div className="w-30 relative rounded-2xl overflow-hidden">
                                    <div className={`bg-green-500 absolute top-0 left-0 w-[60%] h-0.75`}></div>
                                    <div className="bg-gray-200 h-0.75"></div>
                                </div>
                                <span className="text-gray-600 text-xs">60%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center text-lime-500 text-xs">4 <BiStar className="size-2.5" /></span>
                                <div className="w-30 relative rounded-2xl overflow-hidden">
                                    <div className={`bg-lime-500 absolute top-0 left-0 w-[20%] h-0.75`}></div>
                                    <div className="bg-gray-200 h-0.75"></div>
                                </div>
                                <span className="text-gray-600 text-xs">20%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center text-yellow-500 text-xs">3 <BiStar className="size-2.5" /></span>
                                <div className="w-30 relative rounded-2xl overflow-hidden">
                                    <div className={`bg-yellow-500 absolute top-0 left-0 w-[10%] h-0.75`}></div>
                                    <div className="bg-gray-200 h-0.75"></div>
                                </div>
                                <span className="text-gray-600 text-xs">10%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center text-orange-400 text-xs">2 <BiStar className="size-2.5" /></span>
                                <div className="w-30 relative rounded-2xl overflow-hidden">
                                    <div className={`bg-orange-400 absolute top-0 left-0 w-[7%] h-0.75`}></div>
                                    <div className="bg-gray-200 h-0.75"></div>
                                </div>
                                <span className="text-gray-600 text-xs">7%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center text-red-500 text-xs">1 <BiStar className="size-2.5" /></span>
                                <div className="w-30 relative rounded-2xl overflow-hidden">
                                    <div className={`bg-red-500 absolute top-0 left-0 w-[3%] h-0.75`}></div>
                                    <div className="bg-gray-200 h-0.75"></div>
                                </div>
                                <span className="text-gray-600 text-xs">3%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* dynamic bottom label */}
                <div className={`bg-white fixed right-0 ${isAddToCartVisible?"-bottom-full":"bottom-0"} sm:mr-4 w-full sm:w-[49.8%] flex justify-between sm:rounded-md items-center py-3 px-4 [box-shadow:0px_0px_6px_0.5px_var(--color-gray-300)] transition-all ease-in-out duration-300 z-2`}>
                    <div>
                        <div className="flex items-center gap-2"><div className="text-3xl text-gray-800"><span>₹</span><span className="font-semibold">{Math.floor((productVariantOptions[selectedFlavorVariant][0].price)-(((productVariantOptions[selectedFlavorVariant][0].price)*(Number(off??0)))/100))}</span></div><span className="text-gray-600 hidden sm:inline">(inclusive of all taxes, Free Delivery)</span></div>
                        <div className="text-gray-500"><span>MRP:</span><span className="line-through">{productVariantOptions[selectedFlavorVariant][0].price}</span> <span className="text-gray-600 hidden sm:inline">Save : {singleProduct.price - Math.floor((productVariantOptions[selectedFlavorVariant][0].price)-(((productVariantOptions[selectedFlavorVariant][0].price)*(Number(off??0)))/100))} ({off}% Off)</span></div>
                    </div>
                    <div className="h-11 w-full max-w-50">
                        <button className={`
                            border border-green-300 bg-green-300 text-center content-center h-full w-full rounded-md
                            transition-all ease-in-out duration-300 hover:opacity-50
                        `}
                            
                            onClick={()=>{
                                
                            }}
                        >
                            Add to Cart
                        </button>
                        {/*<button className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-md min-w-50 w-full">Add to Cart</button>*/}
                    </div>
                </div>
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