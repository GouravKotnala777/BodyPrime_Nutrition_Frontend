import { useEffect, useState, type ChangeEvent } from "react";
import { addImages, createProduct, getProducts, getSingleProduct, updateProduct } from "../apis/product.api";
import { type ProductTypes, type CreateProductFormTypes, type UpdateProductFormTypes } from "../utils/types";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCamera } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import emptyStateImage from "../../public/empty_cart2.png";
import HandlePageUIWithState from "../components/HandlePageUIWithState";
import { ButtonPrimary } from "../components/Button.component";

type InventoryTabTypes = "all"|"add"|"update"|"tab4";


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
    const [createProductForm, setCreateProductForm] = useState<Omit<CreateProductFormTypes, "tag"|"warning">&{tag:string; warning:string;}>({name:"", brand:"", category:"other", price:0, size:0, weight:"", tag:"", flavor:"", warning:""});
    const [updateProductForm, setUpdateProductForm] = useState<Omit<UpdateProductFormTypes, "tag"|"warning"|"category">&{tag?:string; warning?:string; category?:"protein"|"pre-workout"|"vitamins"|"creatine"|"other";}>({name:"", brand:"", price:0, size:0, weight:"", tag:"", flavor:"", warning:""});
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
            tag:createProductForm.tag.split(","),
            warning:createProductForm.warning.split(",")
        });
        console.log(res);
    };

    async function getProductsHandler() {
        setRefetchDataStatus({isLoading:true, isSuccess:false, error:""});
        const data = await getProducts(skip);
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
            tag:updateProductForm.tag?.split(","),
            warning:updateProductForm.warning?.split(","),
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
        const res = await getSingleProduct(productID);

        setSelectedProduct(res.jsonData);
        console.log(res);
    };

    useEffect(() => {
        setDataStatus({isLoading:true, isSuccess:false, error:""});
        getProductsHandler()
        .then((data) => {
            if (data.success) {
                setDataStatus({isLoading:false, isSuccess:true, error:""});
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    
    return(
        <>
        
        {tab === "all" && (
            <HandlePageUIWithState isLoading={dataStatus.isLoading} isSuccess={dataStatus.isSuccess} error={dataStatus.error} errorChildren={
                <>
                    <img src={emptyStateImage} alt={emptyStateImage} />
                    <h1 className="text-2xl text-center font-bold text-[#f44769] py-1">No Product!</h1>
                    <p className="text-[1.1rem] text-center text-gray-400 font-semibold py-1/2">It looks like there is no product yet.</p>
                    <div className="text-center">
                        <button className="bg-[#f44769] text-white text-[1.2rem] py-2 px-3 font-medium rounded-[8px] my-7" onClick={() => setTab("add")}>Add New Products</button>
                    </div>
                </>
            }>
                <section className="border-2 border-blue-600 flex flex-wrap justify-around gap-4 h-[80vh] overflow-scroll">
                    {
                        products.map((p) => (
                            <div key={p._id} className="border-2 w-[110px] h-[160px]" onClick={() => {
                                setSelectedProduct(p);
                                setTab("update");
                            }}>
                                <div className="border-2 h-[85%]">
                                    <img src={p.images[0]?`${import.meta.env.VITE_SERVER_URL}/api/v1${p.images[0]}`:`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                                        alt={p.images[0]?`${import.meta.env.VITE_SERVER_URL}/api/v1${p.images[0]}`:`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                                    />
                                </div>
                                <div className="border-2 text-center h-[15%]">
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
                            onClickHandler={getProductsHandler}
                        />
                    </div>
                </section>
            </HandlePageUIWithState>
        )}
        
        
        {tab === "add" && (
            <>
                <section className="border-2 border-green-500 px-2 h-[80vh] overflow-scroll">
                    <div className="text-center text-[1.5rem] font-semibold">
                        <h1>Create New Product</h1>
                    </div>
                    <div className="flex flex-col gap-2 text-[1.2rem] mt-4">
                        <input type="text" name="name" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Product Name" onChange={onChangeHandler} />
                        <input type="text" name="brand" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Brand" onChange={onChangeHandler} />
                        <select name="category" className="px-5 py-2" onChange={onChangeHandler}>
                            <option value="protein" disabled>--select--</option>
                            <option value="protein">protein</option>
                            <option value="pre-workout">pre-workout</option>
                            <option value="vitamins">vitamins</option>
                            <option value="creatine">creatine</option>
                            <option value="other">other</option>
                        </select>
                        <input type="text" name="price" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Price" onChange={onChangeHandler} />
                        <input type="text" name="flavor" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Flavor" onChange={onChangeHandler} />
                        <input type="text" name="size" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Size" onChange={onChangeHandler} />
                        <input type="text" name="tag" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Tag" onChange={onChangeHandler} />
                        <input type="text" name="weight" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Weight" onChange={onChangeHandler} />
                        <input type="text" name="warning" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder="Warning" onChange={onChangeHandler} />
                        <button className="font-semibold py-3 rounded-2xl text-white bg-[#f44769]" onClick={createProductHandler}>Create Product</button>
                    </div>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi nam magnam deserunt eligendi illum debitis tenetur optio quae voluptatem officiis quasi perferendis aliquam sequi, voluptatum dolores nostrum eos praesentium laboriosam dolorum. Ipsa repudiandae optio esse, quo explicabo reiciendis tenetur fuga.
                    </p>
                </section>
            </>
        )}
        
        
        {tab === "update" && (
            <>
                <section className="border-2 border-green-500 px-2 h-[80vh] overflow-scroll">
                    {/*<pre>{JSON.stringify(selectedProduct, null, `\t`)}</pre>*/}
                    <div className="text-center text-[1.5rem] font-semibold">
                        <h1>Update Existing Product</h1>
                    </div>
                    <div className="flex justify-between text-[1.2rem] mt-4">
                        <input type="text" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?._id||"Search product by Id"} onChange={(e) => setProductID(e.target.value)} />
                        <button className="text-white font-semibold bg-[#f44769] px-5 py-2 rounded-[4px]" onClick={findSingleProductHandler}>Search</button>
                    </div>
                    <div className="grid place-items-center py-[30px]">
                        <div className="relative w-1/2">
                            <img src={selectedProduct?.images[0]?`${import.meta.env.VITE_SERVER_URL}/api/v1${selectedProduct?.images[0]}`:`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                                alt={selectedProduct?.images[0]?`${import.meta.env.VITE_SERVER_URL}/api/v1${selectedProduct?.images[0]}`:`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`}
                                className="w-full border-[1px] border-gray-400 rounded-[8px] p-1"
                            />
                            <BiCamera className="absolute right-[-25px] bottom-[-25px] w-[50px] h-[50px] rounded-[100%] bg-[#f44769] p-2 text-white" />
                            <input type="file" multiple={true} name="images" className="w-[60px] h-[60px] absolute right-[-30px] bottom-[-30px] opacity-0" onChange={(e) => updateProductImagesHandler(e)} />
                        </div>
                    </div>
                    {/*<pre>{JSON.stringify(selectedProduct, null, `\t`)}</pre>*/}
                    <div className="flex flex-col gap-2 text-[1.2rem] mt-4">
                        <input type="text" name="name" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?.name||"Product name"} onChange={onChangeUpdateHandler} />
                        <input type="text" name="brand" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?.brand||"Product brand"} onChange={onChangeUpdateHandler} />
                        <select name="category" className="px-5 py-2" defaultValue={selectedProduct?.category} onChange={onChangeUpdateHandler}>
                            <option value="null" disabled>--select--</option>
                            <option value="protein">protein</option>
                            <option value="pre-workout">pre-workout</option>
                            <option value="vitamins">vitamins</option>
                            <option value="creatine">creatine</option>
                            <option value="other">other</option>
                        </select>
                        <input type="text" name="price" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?.price.toString()||"Price"} onChange={onChangeUpdateHandler} />
                        <input type="text" name="flavor" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?.flavor||"Flavor"} onChange={onChangeUpdateHandler} />
                        <input type="text" name="size" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?.size.toString()||"Size"} onChange={onChangeUpdateHandler} />
                        <input type="text" name="tag" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?.tag.join(",")||"Tag"} onChange={onChangeUpdateHandler} />
                        <input type="text" name="weight" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?.weight||"Weight"} onChange={onChangeUpdateHandler} />
                        <input type="text" name="warning" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" placeholder={selectedProduct?.warning?.join(",")||"Warning"} onChange={onChangeUpdateHandler} />

                        <button className="font-semibold py-3 rounded-2xl text-white bg-[#f44769]" onClick={updateProductHandler}>Update Product</button>
                    </div>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi nam magnam deserunt eligendi illum debitis tenetur optio quae voluptatem officiis quasi perferendis aliquam sequi, voluptatum dolores nostrum eos praesentium laboriosam dolorum. Ipsa repudiandae optio esse, quo explicabo reiciendis tenetur fuga.
                    </p>
                </section>
            </>
        )}
        
        
        {tab === "tab4" && (
            <>
                <section className="h-[80vh] overflow-scroll"></section>
            </>
        )}
        
        
        <section className="border-2 border-blue-800 text-center fixed left-0 bottom-0 w-full flex justify-around h-[10vh] py-2 bg-white">
            <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("all")}>
                <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                    backgroundColor:tab==="all"?"#f06682bb":"white"
                }} />
                <span className="text-[1rem] font-semibold">All</span>
            </div>
            <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("add")}>
                <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                    backgroundColor:tab==="add"?"#f06682bb":"white"
                }} />
                <span className="text-[1rem] font-semibold">Add</span>
            </div>
            <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("update")}>
                <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                    backgroundColor:tab==="update"?"#f06682bb":"white"
                }} />
                <span className="text-[1rem] font-semibold">Update</span>
            </div>
            <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("tab4")}>
                <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                    backgroundColor:tab==="tab4"?"#f06682bb":"white"
                }} />
                <span className="text-[1rem] font-semibold">Patoni</span>
            </div>
        </section>
        </>
    )
};

export default Inventory;