import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { addImages, getSingleProduct } from "../apis/product.api";
import { type ProductTypes, type ReviewTypesPopulated } from "../utils/types";
import RatingStars from "../components/RatingStars.component";
import { getReviews, createReview } from "../apis/review.api";
import ReviewCard from "../components/ReviewCard.component";
import { useUser } from "../contexts/UserContext";
import { addToCart, removeFromCart } from "../apis/cart.api";
import { useCart } from "../contexts/CartContext";
import pageNotFound from "../../public/page_not_found8.jpg";
import HandlePageUIWithState from "../components/HandlePageUIWithState";

function SingleProduct() {
    const {productID} = useParams();
    const [images, setImages] = useState<FileList|null>(null);
    const [singleProduct, setSingleProduct] = useState<ProductTypes|null>(null);
    const [allReviews, setAllReviews] = useState<ReviewTypesPopulated[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [quantityInCart, setQuantityInCart] = useState<number>(0);
    const {isUserAdmin} = useUser();
    const {cartData, setCartData} = useCart();
    const navigate = useNavigate();
    const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});


    async function getSingleProductHandler() {
        setDataStatus({isLoading:true, isSuccess:false, error:""});
        if (!productID) return;
        
        const res = await getSingleProduct(productID);
        console.log({res});

        if (res.success) {
            setSingleProduct(res.jsonData);
            setDataStatus({isLoading:false, isSuccess:true, error:""});
        }
        else{
            setDataStatus({isLoading:false, isSuccess:false, error:res.message});
        }

    };

    async function createReviewHandler() {
        if (!productID) return;

        console.log({productID, rating, comment});
        

        const res = await createReview({productID, rating, comment});

        console.log(res);
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
    async function getReviewsHandler() {
        if (!productID) throw new Error("productID is not defiend");

        const res = await getReviews({productID});
        setAllReviews(res.jsonData);
        console.log(res);
    };

    async function addToCartHandler() {
        if (!productID) throw Error("productID not found");

        const res = await addToCart({productID, quantity:1});

        if (cartData.length === 0) {
            setCartData([{...res.jsonData.products, quantity:res.jsonData.quantity}]);
        }
        else{
            setCartData((prev) => {
                const findResult = prev.find(p => p._id === res.jsonData.products._id);

                if (findResult) {
                    return prev.map((p) => p._id === res.jsonData.products._id?{...p, quantity:res.jsonData.quantity}:p);
                }
                else{
                    return [...prev, {...res.jsonData.products, quantity:res.jsonData.quantity}];
                }
            });
        }
    };

    async function removeFromCartHandler() {
        if (!productID) throw Error("productID not found");

        const res = await removeFromCart({productID, quantity:1});

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
    };
    

    useEffect(() => {
        getSingleProductHandler();
        getReviewsHandler();
    }, []);
    
    useEffect(() => {
        const findResult = cartData.find(p => p._id === singleProduct?._id);
        setQuantityInCart(findResult?.quantity||0);
    }, [cartData]);

    return (
        <HandlePageUIWithState isLoading={dataStatus.isLoading} isSuccess={dataStatus.isSuccess} error={dataStatus.error}
            errorChildren={
                <>
                    <img src={pageNotFound} alt={pageNotFound} />
                    <p className="text-center">error reason : {dataStatus.error}</p>
                    <div className="text-center">
                        <button className="bg-[#dc7589] text-white text-[1.2rem] py-2 px-3 font-medium rounded-[8px] my-7" onClick={() => navigate("/home")}>Go Back Home</button>
                    </div>
                </>
            }
        >
            <section>
                <div className="flex justify-between items-center py-2 bg-[#f4476a24]">
                    <div><img src="/vite.svg" alt="/vite.svg" /></div>
                    <div className="flex flex-col">
                        <span className="text-[1rem] font-semibold">Company Name</span>
                        <span className="text-[0.9rem]">Brand name</span>
                    </div>
                    <div className="text-[0.8rem] flex">4.5 <RatingStars rating={4.5} outOf={5} /> (20,234)</div>
                </div>
                <p className="text-gray-700 font-semibold">{singleProduct?.brand} {singleProduct?.name} {singleProduct?.category} ({singleProduct?.flavor}, {singleProduct?.weight}) - Nitro-Tech Ultimate Muscle Building Formula with Whey Protein Isolate - 30g of Protein, 3g of Creatine & 6.8g of BCAA - Packaging May Vary</p>
                <div className="w-full h-[45vh] bg-gray-100">
                    {
                        (singleProduct&&singleProduct.images&&singleProduct.images[0]) ?
                        <img src={`http://localhost:8000/api/v1${singleProduct.images[0]}`} alt={`http://localhost:8000/api/v1${singleProduct?.images[0]}`} className="h-full w-full" />
                        :
                        <img src={"http://localhost:8000/api/v1/public/no_product.png"} alt={"http://localhost:8000/api/v1/public/no_product.png"} className="h-full w-full" />
                    }
                </div>

                {
                    isUserAdmin() &&
                    <div className="border-[1px] border-gray-100 my-2 py-4">
                        <div className="text-[1.3rem]">
                            <span>Add Images</span><span className="font-semibold">Milk Chocolate</span>
                        </div>
                        <div className="flex flex-col mt-2 gap-2">
                            <input multiple={true} name="images" type="file" className="px-2 py-3 text-[1.2rem] bg-gray-200 text-gray-600" onChange={onChangeHandler} />
                            <button className="py-3 text-[1.2rem] bg-[#fa3368] text-white rounded-2xl" onClick={upload}>Submit</button>
                        </div>
                    </div>
                }

                <div>
                    {
                        quantityInCart ?
                        <div className="border-2 flex justify-between items-center w-60 mx-auto rounded-2xl">
                            <button className="text-3xl font-semibold w-[4rem] h-[3rem]" onClick={removeFromCartHandler}>-</button>
                            <span className="text-xl">{quantityInCart}</span>
                            <button className="text-3xl font-semibold w-[4rem] h-[3rem]" onClick={addToCartHandler}>+</button>
                        </div>
                        :
                        <button className="w-full h-[3rem] text-[1.2rem] rounded-2xl active:bg-gray-100 bg-yellow-300" onClick={addToCartHandler}>Add to cart</button>

                    }
                </div>


                <div className="border-[1px] border-gray-900 my-2 py-4">
                    <div className="text-[1.3rem]">
                        <span>Flavor Name: </span><span className="font-semibold">Milk Chocolate</span>
                    </div>
                    <div className="flex text-gray-800 text-[1.2rem] gap-6 overflow-scroll py-2">
                        {
                            [1,2,3,4,5,6,7].map((num) => (
                                <div key={num} className="border-2 border-gray-700 font-semibold px-3 py-1 rounded-[4px]">Flavor{num}</div>
                            ))
                        }
                    </div>
                </div>
                <div className="border-[1px] border-gray-100 my-2 py-4">
                    <div className="text-[1.3rem]">
                        <span>Size: </span><span className="font-semibold">2Kg (Pack of 1)</span>
                    </div>
                    <div className="flex text-gray-800 text-[1.2rem] gap-6 overflow-scroll py-2 w-full">
                        {
                            ["2Kg (Pack of 1)", "3Kg (Pack of 1)", "4Kg (Pack of 1)", "5Kg (Pack of 1)", "6Kg (Pack of 1)"].map((flav, index) => (
                                <div key={index} className="border-2 border-gray-700 font-semibold px-3 py-1 rounded-[4px]">{flav}</div>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <button className="bg-yellow-300 w-full h-[3rem] text-[1.2rem] rounded-2xl active:bg-gray-100">See Similar Items</button>
                </div>
                <div className="border-[1px] border-gray-100 my-2 py-4">
                    <div className="flex text-5xl justify-around">
                        {
                            [1,2,3,4,5].map((num) => (
                                <span key={num} onClick={() => setRating(num)}>⭐</span>
                            ))
                        }
                    </div>
                    <div className="mt-4 border-2 border-red-400 rounded-[8px]">
                        <textarea rows={5} className="w-full" placeholder="Comment...(optional)" onChange={(e) => setComment(e.target.value)}></textarea>
                    </div>
                    <div className="mt-4">
                        <button className="bg-yellow-300 w-full h-[3rem] text-[1.2rem] rounded-2xl active:bg-gray-100" onClick={createReviewHandler}>Submit</button>
                    </div>
                </div>
                <div className="border-[1px] border-gray-100 my-2 py-4">
                    <div className="text-[1.3rem]">
                        <span>Measurement</span><span className="font-semibold"></span>
                    </div>
                    <div className="text-[1.2rem] gap-6 overflow-scroll w-full">
                        <div className="flex justify-between items-center border-b-[1px] border-b-gray-600">
                            <span className="bg-gray-100 p-4 w-[40%]">Item Weight</span>
                            <span>4 Pounds</span>
                        </div>
                        <div className="flex justify-between items-center border-b-[1px] border-b-gray-600">
                            <span className="bg-gray-100 p-4 w-[40%]">No of Items</span>
                            <span>1</span>
                        </div>
                        <div className="flex justify-between items-center border-b-[1px] border-b-gray-600">
                            <span className="bg-gray-100 p-4 w-[40%]">Age Range (Description)</span>
                            <span>Adult</span>
                        </div>
                        <div className="flex justify-between items-center border-b-[1px] border-b-gray-600">
                            <span className="bg-gray-100 p-4 w-[40%]">Net Content Volume</span>
                            <span>9.41 Litres</span>
                        </div>
                    </div>
                </div>
                <div className="border-[1px] border-gray-100 my-2 py-4">
                    <div className="text-[1.3rem] font-semibold">
                        <span>Safety and product resources</span><span className="font-semibold"></span>
                    </div>
                    <div className="text-[1rem] w-full">
                        <p>As the Food and Drug Administration (FDA) advises, dietary supplements can support your overall health but may also have powerful effects on the body. It’s important to read labels carefully, exercise caution, and consult your healthcare professional before taking any supplement. Side effects are more likely if supplements are taken in high doses, as substitutes for prescribed medications, or in combination with multiple supplements. If you experience severe side effects, discontinue use immediately and seek medical attention.</p>
                    </div>
                </div>
                <div className="border-[1px] border-gray-100 my-2 py-4">
                    <div className="text-[1.3rem] font-semibold">
                        <span>LEGAL DESCLAIMER</span><span className="font-semibold"></span>
                    </div>
                    <div className="text-[1rem] w-full">
                        <p>Some states prohibit the sale of products intended for weight loss or muscle building to individuals under age 18. Check your local laws prior to purchase.</p>
                    </div>
                </div>
                <div className="border-[1px] border-gray-100 my-2 py-4">
                    <div className="text-[1.3rem] font-semibold">
                        <span>Top Reviews</span><span className="font-semibold"></span>
                    </div>
                    <div className="text-[1rem] w-full flex flex-col gap-2">
                        {
                            allReviews.map(({productID, userID, ...review}) => (
                                <ReviewCard key={productID.name} productID={productID} userID={userID} rating={review.rating} comment={review.comment} createdAt={review.createdAt} updatedAt={review.updatedAt} />
                            ))
                        }
                    </div>
                </div>
            </section>
        </HandlePageUIWithState>
    );
};

export default SingleProduct;