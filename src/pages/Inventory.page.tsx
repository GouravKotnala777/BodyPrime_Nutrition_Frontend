import { useEffect, useState, type ChangeEvent } from "react";
import { addImages, addProductVariant, createProduct, getProducts, getSingleProduct, updateProduct } from "../apis/product.api";
import { type ProductTypes, type CreateProductFormTypes, type UpdateProductFormTypes, type CategoryTypes } from "../utils/types";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCamera } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import HandlePageUIWithState from "../components/HandlePageUIWithState";
import { ButtonPrimary } from "../components/Button.component";
import ImageWithFallback from "../components/ImageWithFallback.component";
import { FILTER_CATEGORIES_OBJECT, FILTER_SUB_CATEGORIES_OBJECT } from "../utils/constants";

type InventoryTabTypes = "all"|"add"|"update"|"addVariant";


//const dummyProducts:ProductTypes[] = [
//    {_id:"1246891", brand:"brand1", category:"protein", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore.", images:["/public/vite.svg"], name:"product1", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246892", brand:"brand2", category:"pre-workout", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product2", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246893", brand:"brand3", category:"protein", description:"Lorem ipsum dolor sit amet.", images:["/public/vite.svg"], name:"product3", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246894", brand:"brand4", category:"vitamins", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore. consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore.", images:["/public/vite.svg"], name:"product4", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246895", brand:"brand5", category:"creatine", description:"this is my coment", images:["/public/vite.svg"], name:"product5", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246896", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246897", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246898", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246899", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246810", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246811", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//];

function Inventory() {
    const {state} = useLocation();
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductTypes|null>(null);
    const [tab, setTab] = useState<InventoryTabTypes>(state?.tab||"all");
    const [skip, setSkip] = useState<number>(0);
    const [productID, setProductID] = useState<string>("");
    const [createProductForm, setCreateProductForm] = useState<Omit<CreateProductFormTypes, "tags"|"warnings">&{tags:string; warnings:string; weight:string;}>({name:"", brand:"", category:"protein", subCategory:"whey", price:0, description:"", dietaryType:"veg", weight:"", tags:"", flavor:"", warnings:""});
    const [updateProductForm, setUpdateProductForm] = useState<Omit<UpdateProductFormTypes, "tags"|"warnings"|"category">&{tags?:string; warnings?:string; weight?:string; category?:CategoryTypes}>({name:"", brand:"", price:0, weight:"", tags:"", flavor:"", warnings:""});
    const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    const [refetchDataStatus, setRefetchDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});

    function onChangeHandler(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
        setCreateProductForm({...createProductForm, [e.target.name]:e.target.value});
    };

    function onChangeUpdateHandler(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
        setUpdateProductForm({...updateProductForm, [e.target.name]:e.target.value});
    };

    async function createProductHandler() {
        const res = await createProduct({
            ...createProductForm,
            tags:`${createProductForm.brand},${createProductForm.category},${createProductForm.subCategory}`.split(","),
            warnings:createProductForm.warnings.split(",")
        });
        console.log(res);
    };

    async function getProductsHandler(signal?:AbortSignal) {
        setRefetchDataStatus({isLoading:true, isSuccess:false, error:""});
        const data = await getProducts(skip, "", "", "", "", signal);

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

    async function updateProductHandler() {
        if (!selectedProduct || !selectedProduct._id) return Error("ProductID not found");
        const res = await updateProduct({
            ...updateProductForm,
            tags:updateProductForm.tags?.split(","),
            warnings:updateProductForm.warnings?.split(","),
            category:updateProductForm.category,
            subCategory:updateProductForm.subCategory
        }, selectedProduct._id);

        console.log(res);
    };
    async function addProductVariantHandler() {
        if (!selectedProduct || !selectedProduct._id) return Error("ProductID not found");
        console.log(updateProductForm);
        
        const res = await addProductVariant({
            ...updateProductForm,
            tags:updateProductForm.tags?.split(","),
            warnings:updateProductForm.warnings?.split(","),
            category:updateProductForm.category
        }, selectedProduct._id);

        console.log(res);
    };

    async function updateProductImagesHandler(e:ChangeEvent<HTMLInputElement>) {
        const images = e.target.files;

        console.log({e:e.target.files});
        console.log({images});
        

        const formData = new FormData();

        if (!selectedProduct || !selectedProduct._id) throw new Error("selectedProduct._id not found");
        if (!images || images.length === 0) throw new Error("Please select atlest one image");

        formData.append("productID", selectedProduct._id);
        Array.from(images).forEach((image) => {
            formData.append("images", image);
        });

        const res = await addImages(formData);

        setSelectedProduct({...selectedProduct, images:res.jsonData.images})

        console.log({res});
        
    };

    async function findSingleProductHandler() {
        const res = await getSingleProduct({productID});

        setSelectedProduct(res.jsonData);
        console.log(res);
    };

    useEffect(() => {
        //const controller = new AbortController();
        //const signal = controller.signal;
        let timer = 0;

        clearTimeout(timer);


        setDataStatus({isLoading:true, isSuccess:false, error:""});
        timer = setTimeout(() => {
            //getProductsHandler(signal)
            getProductsHandler()
            .then((data) => {
                if (data.success) {
                    setDataStatus({isLoading:false, isSuccess:true, error:""});
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }, 3000);

        return() => clearTimeout(timer);
        //return() => {controller.abort()}
    }, []);

    
    return(
        <>
        
        {tab === "all" && (
            <HandlePageUIWithState isLoading={dataStatus.isLoading} isSuccess={dataStatus.isSuccess} error={dataStatus.error} errorChildren={
                <>
                    <img src="/empty_cart2.png" alt="/empty_cart2.png" />
                    <h1 className="text-2xl text-center font-bold text-[#f44769] py-1">No Product!</h1>
                    <p className="text-[1.1rem] text-center text-gray-400 font-semibold py-1/2">It looks like there is no product yet.</p>
                    <div className="text-center">
                        <button className="bg-primary-400 text-white text-[1.2rem] py-2 px-3 font-medium rounded-[8px] my-7" onClick={() => setTab("add")}>Add New Products</button>
                    </div>
                </>
            }>
                <section className="h-[75vh] overflow-y-scroll px-2 py-4">
                    <div className="text-2xl text-gray-800 font-bold text-center py-2 sm:py-4 mb-10">
                        <div>All Products</div>
                    </div>
                    <div className="flex flex-wrap justify-around gap-4">
                        {
                            products.map((p) => (
                                <div key={p._id} className="border border-gray-200 w-30 h-46 rounded-lg overflow-hidden" onClick={() => {
                                    setSelectedProduct(p);
                                    setTab("update");
                                }}>
                                    <div className="h-[85%]">
                                        <ImageWithFallback
                                            src={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.images[0]}`}
                                            alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.images[0]}`}
                                            fallbackSrc="/placeholders/no_product.jpg"
                                        />
                                    </div>
                                    <div className="text-gray-600 text-center">
                                        <h3>₹ {p.price}/-</h3>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="w-full h-fit text-xl text-center font-semibold mt-8 mb-4">
                            <ButtonPrimary
                                isLoading={refetchDataStatus.isLoading}
                                isSuccess={refetchDataStatus.isSuccess}
                                isDisabled={(refetchDataStatus.error !== "")}
                                onClickHandler={() => getProductsHandler()}
                            />
                        </div>
                    </div>
                </section>
            </HandlePageUIWithState>
        )}
        
        
        {tab === "add" && (
            <>
                <section className="px-2 h-[75vh] overflow-y-scroll max-w-2xl mx-auto">
                    <div className="text-2xl text-gray-800 font-bold text-center py-2 sm:py-4 mt-5 mb-5">
                        <div>Create New Product</div>
                    </div>
                    <div className="flex flex-col gap-2 text-lg mt-4">
                        <input type="text" name="name" className="border border-primary-200 px-5 py-2 rounded-md" placeholder="Product Name" onChange={onChangeHandler} />
                        <input type="text" name="brand" className="border border-primary-200 px-5 py-2 rounded-md" placeholder="Brand" onChange={onChangeHandler} />
                        <select name="category" defaultValue="null" className="px-5 py-2 text-gray-500" onChange={onChangeHandler}>
                            <option value="null" disabled>--select category--</option>
                            {
                                FILTER_CATEGORIES_OBJECT.map(({heading, queryName}, index) => (
                                    <option key={index} value={queryName}>{heading}</option>
                                ))
                            }
                        </select>
                        <select name="subCategory" defaultValue="null" className="px-5 py-2 text-gray-500" onChange={onChangeHandler}>
                            <option value="null" disabled>--select subCategory--</option>
                            {
                                FILTER_SUB_CATEGORIES_OBJECT[createProductForm.category].map((iter) => (
                                    <option value={iter.subCategory}>{iter.heading}</option>
                                    
                                ))
                            }
                        </select>
                        <select name="dietaryType" defaultValue="null" className="px-5 py-2 text-gray-500" onChange={onChangeHandler}>
                            <option value="null" disabled>--select dietaryType--</option>
                            <option value="veg">veg</option>
                            <option value="nonveg">nonveg</option>
                            <option value="vegan">vegan</option>
                        </select>
                        <input type="text" name="price" className="border border-primary-200 px-5 py-2 rounded-md" placeholder="Price" onChange={onChangeHandler} />
                        <input type="text" name="flavor" className="border border-primary-200 px-5 py-2 rounded-md" placeholder="Flavor" onChange={onChangeHandler} />
                        <input type="text" name="description" maxLength={200} className="border border-primary-200 px-5 py-2 rounded-md" placeholder="Description..." onChange={onChangeHandler} />
                        <input type="text" name="tags" className="border border-primary-200 px-5 py-2 rounded-md" placeholder="Tags" value={`${createProductForm.brand},${createProductForm.category},${createProductForm.subCategory}`} onChange={onChangeHandler} />
                        <select name="weight" defaultValue="null" className="px-5 py-2 text-gray-500" onChange={onChangeHandler}>
                            <option value="null" disabled>--select weight--</option>
                            {
                                ["50g", "100g", "200g", "500g", "1kg", "2kg", "5kg"].map((iter) => (
                                    <option value={iter}>{iter}</option>
                                ))
                            }
                        </select>
                        <input type="text" name="warnings" className="border border-primary-200 px-5 py-2 rounded-md" placeholder="Warnings" onChange={onChangeHandler} />
                        <button className="font-semibold py-2 rounded-md text-white bg-primary-400 hover:opacity-80" onClick={createProductHandler}>Create Product</button>
                    </div>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi nam magnam deserunt eligendi illum debitis tenetur optio quae voluptatem officiis quasi perferendis aliquam sequi, voluptatum dolores nostrum eos praesentium laboriosam dolorum. Ipsa repudiandae optio esse, quo explicabo reiciendis tenetur fuga.
                    </p>
                </section>
            </>
        )}
        
        
        {tab === "update" && (
            <section className="px-2 h-[75vh] overflow-y-scroll max-w-2xl mx-auto">
                {/*<pre>{JSON.stringify(selectedProduct, null, `\t`)}</pre>*/}
                <div className="text-2xl text-gray-800 font-bold text-center py-2 sm:py-4 mt-5 mb-5">
                    <div>Update Existing Product</div>
                </div>
                <div className="flex justify-between gap-3 text-md mt-2">
                    <input type="text" className="border border-primary-200 w-full px-3 py-2 rounded-md" placeholder={selectedProduct?._id||"Search product by Id"} onChange={(e) => setProductID(e.target.value)} />
                    <button className="text-white font-semibold bg-primary-400 px-3 py-2 rounded-md hover:opacity-80" onClick={findSingleProductHandler}>Search</button>
                </div>
                <div className="grid place-items-center py-10">
                    <div className="relative w-60 h-60">
                        <ImageWithFallback
                            src={`${import.meta.env.VITE_SERVER_URL}/api/v1${selectedProduct?.images[0]}`}
                            alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${selectedProduct?.images[0]}`}
                            fallbackSrc="/placeholders/no_product.jpg"
                            className="border border-gray-200 w-full h-full rounded-lg p-1"
                        />
                        <div className="absolute -right-6 -bottom-6 w-[50px] h-[50px] rounded-[100%] bg-primary-400 p-2 text-white hover:opacity-80">
                            <BiCamera className="w-full h-full" />
                            <input type="file" multiple={true} name="images" className="absolute top-0 left-0 w-full h-full opacity-0" onChange={(e) => updateProductImagesHandler(e)} />
                        </div>
                    </div>
                </div>
                {/*<pre>{JSON.stringify(selectedProduct, null, `\t`)}</pre>*/}
                <div className="flex flex-col gap-2 text-md mt-4">
                    <input type="text" name="name" className="border border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.name||"Product name"} onChange={onChangeUpdateHandler} />
                    <input type="text" name="brand" className="border border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.brand||"Product brand"} onChange={onChangeUpdateHandler} />
                    <select name="category" className="px-5 py-2 text-gray-500" defaultValue={selectedProduct?.category} onChange={onChangeUpdateHandler}>
                        <option value="null" disabled>--select category--</option>
                        {
                            FILTER_CATEGORIES_OBJECT.map(({heading, queryName}, index) => (
                                <option key={index} value={queryName}>{heading}</option>
                            ))
                        }
                    </select>
                    <select name="subCategory" defaultValue={selectedProduct?.subCategory}  className="px-5 py-2 text-gray-500" onChange={onChangeUpdateHandler}>
                        <option value="null" disabled>--select subCategory--</option>
                        {
                            FILTER_SUB_CATEGORIES_OBJECT[createProductForm.category].map((iter) => (
                                <option value={iter.subCategory}>{iter.heading}</option>
                                
                            ))
                        }
                    </select>
                    <select name="dietaryType" defaultValue={selectedProduct?.dietaryType} className="px-5 py-2 text-gray-500" onChange={onChangeUpdateHandler}>
                        <option value="null" disabled>--select dietaryType--</option>
                        <option value="veg">veg</option>
                        <option value="nonveg">nonveg</option>
                        <option value="vegan">vegan</option>
                    </select>
                    <input type="text" name="price" className="border border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.price.toString()||"Price"} onChange={onChangeUpdateHandler} />
                    <input type="text" name="flavor" className="border border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.flavor||"Flavor"} onChange={onChangeUpdateHandler} />
                    {/*<input type="text" name="size" className="border border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.size.toString()||"Size"} onChange={onChangeUpdateHandler} />*/}
                    <input type="text" name="tags" className="border border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.tags.join(",")||"Tags"} onChange={onChangeUpdateHandler} />
                    <select name="weight" defaultValue="null" className="px-5 py-2 text-gray-500" onChange={onChangeUpdateHandler}>
                        <option value="null" disabled>--select weight--</option>
                        {
                            ["50g", "100g", "200g", "500g", "1kg", "2kg", "5kg"].map((iter) => (
                                <option value={iter}>{iter}</option>
                            ))
                        }
                    </select>
                    <input type="text" name="warnings" className="border border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.warnings?.join(",")||"Warnings"} onChange={onChangeUpdateHandler} />

                    <button className="font-semibold py-2 rounded-md text-white bg-primary-400 hover:opacity-80" onClick={updateProductHandler}>Update Product</button>
                </div>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi nam magnam deserunt eligendi illum debitis tenetur optio quae voluptatem officiis quasi perferendis aliquam sequi, voluptatum dolores nostrum eos praesentium laboriosam dolorum. Ipsa repudiandae optio esse, quo explicabo reiciendis tenetur fuga.
                </p>
            </section>
        )}
        
        
        {tab === "addVariant" && (
            
            <section className="px-2 h-[75vh] overflow-y-scroll max-w-2xl mx-auto">
                {/*<pre>{JSON.stringify(selectedProduct, null, `\t`)}</pre>*/}
                <div className="text-2xl text-gray-800 font-bold text-center py-2 sm:py-4 mt-5 mb-5">
                    <div>Add A Product Variant</div>
                </div>
                <div className="flex justify-between text-[1.2rem] mt-4">
                    <input type="text" className="border-[1px] border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?._id||"Search product by Id"} onChange={(e) => setProductID(e.target.value)} />
                    <button className="text-white font-semibold bg-primary-400 px-5 py-2 rounded-md" onClick={findSingleProductHandler}>Search</button>
                </div>
                <div className="grid place-items-center py-[30px]">
                    <div className="relative w-1/2">
                        <img src={selectedProduct?.images[0]?`${import.meta.env.VITE_SERVER_URL}/api/v1${selectedProduct?.images[0]}`:`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                            alt={selectedProduct?.images[0]?`${import.meta.env.VITE_SERVER_URL}/api/v1${selectedProduct?.images[0]}`:`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                            className="w-full border-[1px] border-gray-400 rounded-[8px] p-1"
                        />
                        <BiCamera className="absolute right-[-25px] bottom-[-25px] w-[50px] h-[50px] rounded-[100%] bg-primary-400 p-2 text-white" />
                        {/*<input type="file" multiple={true} name="images" className="w-[60px] h-[60px] absolute right-[-30px] bottom-[-30px] opacity-0" onChange={(e) => updateProductImagesHandler(e)} />*/}
                    </div>
                </div>
                <div className="flex flex-col gap-2 text-md mt-4">
                    <select name="dietaryType" defaultValue="null" className="px-5 py-2 text-gray-500" onChange={onChangeUpdateHandler}>
                        <option value="null" disabled>--select category--</option>
                        <option value="veg">veg</option>
                        <option value="nonveg">nonveg</option>
                        <option value="vegan">vegan</option>
                    </select>
                    <input type="text" name="price" className="border-[1px] border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.price.toString()||"Price"} onChange={onChangeUpdateHandler} />
                    <input type="text" name="flavor" className="border-[1px] border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.flavor||"Flavor"} onChange={onChangeUpdateHandler} />
                    <input type="text" name="description" maxLength={200} className="border border-primary-200 px-5 py-2 rounded-md" placeholder="Description..." onChange={onChangeUpdateHandler} />
                    <input type="text" name="tags" className="border-[1px] border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.tags.join(",")||"Tags"} onChange={onChangeUpdateHandler} />
                    <input type="text" name="weight" className="border-[1px] border-primary-200 px-5 py-2 rounded-md" placeholder="Weight" onChange={onChangeUpdateHandler} />
                    <input type="text" name="warnings" className="border-[1px] border-primary-200 px-5 py-2 rounded-md" placeholder={selectedProduct?.warnings?.join(",")||"Warnings"} onChange={onChangeUpdateHandler} />

                    <button className="font-semibold py-3 rounded-2xl text-white bg-primary-400" onClick={addProductVariantHandler}>Add Product Variant</button>
                </div>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi nam magnam deserunt eligendi illum debitis tenetur optio quae voluptatem officiis quasi perferendis aliquam sequi, voluptatum dolores nostrum eos praesentium laboriosam dolorum. Ipsa repudiandae optio esse, quo explicabo reiciendis tenetur fuga.
                </p>
            </section>
        )}
        
        
        <section className="border border-primary-100 text-center fixed left-[50%] bottom-0 -translate-x-[50%] w-full max-w-3xl min-w-max h-max flex justify-around gap-2 p-2 bg-white rounded-xl">
            <button className="border border-gray-200 py-2 block basis-1/4 h-max rounded-lg hover:bg-primary-50" onClick={() => setTab("all")}>
                <div className={`size-7 p-1 rounded-md mx-auto ${tab==="all"?"bg-primary-100 text-primary-700":"bg-white text-gray-600"}`}>
                    <AiOutlineProduct className="w-full h-full" />
                </div>
                <div className="text-sm sm:text-md font-semibold text-gray-700 text-shadow-sm">All</div>
            </button>
            <button className="border border-gray-200 py-2 block basis-1/4 h-max rounded-lg hover:bg-primary-50" onClick={() => setTab("add")}>
                <div className={`size-7 p-1 rounded-md mx-auto ${tab==="add"?"bg-primary-100 text-primary-700":"bg-white text-gray-600"}`}>
                    <AiOutlineProduct className="w-full h-full" />
                </div>
                <div className="text-sm sm:text-md font-semibold text-gray-700 text-shadow-sm">Add</div>
            </button>
            <button className="border border-gray-200 py-2 block basis-1/4 h-max rounded-lg hover:bg-primary-50" onClick={() => setTab("update")}>
                <div className={`size-7 p-1 rounded-md mx-auto ${tab==="update"?"bg-primary-100 text-primary-700":"bg-white text-gray-600"}`}>
                    <AiOutlineProduct className="w-full h-full" />
                </div>
                <div className="text-sm sm:text-md font-semibold text-gray-700 text-shadow-sm">Update</div>
            </button>
            <button className="border border-gray-200 py-2 block basis-1/4 h-max rounded-lg hover:bg-primary-50" onClick={() => setTab("addVariant")}>
                <div className={`size-7 p-1 rounded-md mx-auto ${tab==="addVariant"?"bg-primary-100 text-primary-700":"bg-white text-gray-600"}`}>
                    <AiOutlineProduct className="w-full h-full" />
                </div>
                <div className="text-sm sm:text-md font-semibold text-gray-700 text-shadow-sm">Add Variant</div>
            </button>
        </section>
        </>
    )
};

export default Inventory;