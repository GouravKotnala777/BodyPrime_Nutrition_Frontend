import { useEffect, useState, type ChangeEvent } from "react";
import { getProducts } from "../apis/product.api";
import { type ProductTypes } from "../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.component";
import RangeInput from "../components/RangeInput.component";
import Accordion from "../components/Accordion.component";
import Spinner from "../components/Spinner.component";
import Skeletan from "../components/Skeletan";
//import { capitalizeString } from "../utils/functions";
import { BiFilter } from "react-icons/bi";
import FilterControlPanel from "../components/FilterControlPanel.component";
import { FILTER_CATEGORIES_OBJECT, FILTER_SUB_CATEGORIES_OBJECT, MAX_PRICE_INITIALLY, MIN_PRICE_INITIALLY } from "../utils/constants";

interface FilterInterface{
    dietaryTypes:("veg"|"nonveg"|"vegan")[];
    categories:string[];
    subCategories:string[];
    price:{min:number; max:number;};
    brands:string[];
    rating:0|1|2|3|4|5;
    flavors:string[];
};

//const dummyProducts:ProductTypes[] = [
//    {_id:"1246891", brand:"brand1", category:"protein", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore.", images:["/public/vite.svg"], name:"product1", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246892", brand:"brand2", category:"pre-workout", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product2", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246893", brand:"brand3", category:"protein", description:"Lorem ipsum dolor sit amet.", images:["/public/vite.svg"], name:"product3", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246894", brand:"brand4", category:"vitamins", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore. consectetur adipisicing elit. Ipsa numquam aliquid voluptas itaque mollitia quasi modi! Est quis alias tempore.", images:["/public/vite.svg"], name:"product4", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246895", brand:"brand5", category:"creatine", description:"this is my coment", images:["/public/vite.svg"], name:"product5", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//    {_id:"1246896", brand:"brand6", category:"other", description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa numquam aliquid.", images:["/public/vite.svg"], name:"product6", numReviews:0, price:3000, rating:0, size:1, stock:1, tag:["powder"], weight:"1kg", flavor:"chocolate"},
//];

let timer = 0;
function SearchedProducts() {
    const {searchField, searchQuery, subCategory} = useParams();
    const [skip, setSkip] = useState<number>(0);
    const [products, setProducts] = useState<ProductTypes[]>([]);
    const navigate = useNavigate();
    //const {isUserAdmin} = useUser();
    //const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    //const [refetchDataStatus, setRefetchDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    const [isReloading, setIsResloading] = useState<boolean>(true);
    const [isFiltersMutating, setIsFiltersMutating] = useState<boolean>(false);
    const [isProductsRefetching, setIsProductsRefetching] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isProductsFinished, setIsProductsFinished] = useState<boolean>(false);
    //const [selectedProduct, setSelectedProduct] = useState<string|null>(null);
    //const {isUserAuthenticated} = useUser();
    //const {cartData, setCartData, addToLocalCart} = useCart();
    const [min, setMin] = useState(MIN_PRICE_INITIALLY);
    const [max, setMax] = useState(MAX_PRICE_INITIALLY);
    const [filterParams, setFilterParams] = useState<string>("");
    const [filters, setFilters] = useState<FilterInterface>({
        dietaryTypes:[],
        categories:[],
        subCategories:[],
        price:{min:0, max:Infinity},
        brands:[],
        rating:0,
        flavors:[]
    });

    async function getProductsFromNextBtn(){
        // it will fetch products whenever we click next button
        // it is dependent on skip
        // each time skip will increase by 1
        // new fetched products will add in products array state to end of array 

        clearTimeout(timer);
        setIsProductsRefetching(true);

        timer = setTimeout(async() => {
            try {
                const data = await getProducts(skip+1, searchField as "name"|"brand"|"category", searchQuery, subCategory, filterParams);
                if (data.success) {                    
                    if (data.jsonData.length !== 0) {
                        setSkip(skip+1);
                        setProducts(prev => ([...prev, ...data.jsonData]));
                        setIsProductsFinished(false);
                    }
                    else{
                        setIsProductsFinished(true);
                    }
                }
                else{
                    setError(data.message);
                    throw new Error(data.message);
                }
                setIsProductsRefetching(false);
            } catch (error) {
                console.log(error);
                setIsProductsRefetching(false);
                setIsResloading(false);
                setIsFiltersMutating(false);
                setError(new Error(error as string).message);
            }
        }, 2000);
    };
    async function getProductsFromChangingFilters(){
        // it will fetch products whenever we change filters
        // it will reset skip to 0 whenever we change filters
        // it will reset products array state to [] whenever we change filters

        const filterParamsLocal = new URLSearchParams();
        filters.dietaryTypes.forEach(type => {
            filterParamsLocal.append("dietaryTypes", type);
        });
        filters.categories.forEach(category => {
            filterParamsLocal.append("categories", category);
        });
        filters.brands.forEach(brand => {
            filterParamsLocal.append("brands", brand);
        });
        filters.flavors.forEach(flavor => {
            filterParamsLocal.append("flavors", flavor);
        });
        filterParamsLocal.append("minPrice", String(filters.price.min));
        filterParamsLocal.append("maxPrice", String((filters.price.max<MAX_PRICE_INITIALLY)?MAX_PRICE_INITIALLY:Infinity));
        filterParamsLocal.append("rating", String(filters.rating));

        setIsFiltersMutating(true);
        setSkip(0);
        clearTimeout(timer);
        timer = setTimeout(async() => {
            try {
                const data = await getProducts(0, searchField as "name"|"brand"|"category", searchQuery, subCategory, filterParamsLocal.toString());
                
                if (data.success) {
                    setProducts(data.jsonData);
                    setFilterParams(filterParamsLocal.toString());
                    if (data.jsonData.length === 0) {
                        setIsProductsFinished(true);
                    }
                    else{
                        setIsProductsFinished(false);
                    }
                }
                else{
                    setIsProductsFinished(false);
                    throw new Error(data.message);
                }
                setIsFiltersMutating(false);
            } catch (error) {
                console.log(error);
                setIsProductsRefetching(false);
                setIsResloading(false);
                setIsFiltersMutating(false);
                setIsProductsFinished(false);
                setError(new Error(error as string).message);
            }
        }, 2000);
    };
    async function getProductsAfterReloadingPage({skip, filterParamsLocal}:{skip:number; filterParamsLocal:URLSearchParams;}){
        // it will fetch products whenever we reload page
        // it will reset skip to 0 automaticaly
        // it will reset products array state to [] automaticaly
        
        try {
            const data = await getProducts(skip, searchField as "name"|"brand"|"category", searchQuery, subCategory, filterParamsLocal.toString());
            
            if (data.success) {
                setIsResloading(false);
                if (data.jsonData.length !== 0) {
                    setFilterParams(filterParamsLocal.toString());
                    setProducts(data.jsonData);
                }
                else{
                    setIsProductsFinished(true);
                    setIsFiltersMutating(false);
                    setIsProductsRefetching(false);
                }
            }
            else{
                throw new Error(data.message);
            }
        } catch (error) {
            console.log(error);
            setIsProductsRefetching(false);
            setIsResloading(false);
            setIsFiltersMutating(false);
            setError(new Error(error as string).message);
        }
    };


    useEffect(() => {
        let timer = 0;

        timer = setTimeout(() => {
            const filterParamsLocal = new URLSearchParams();
            filters.dietaryTypes.forEach(type => {
                filterParamsLocal.append("dietaryTypes", type);
            });
            filters.categories.forEach(category => {
                filterParamsLocal.append("categories", category);
            });
            filters.brands.forEach(brand => {
                filterParamsLocal.append("brands", brand);
            });
            filters.flavors.forEach(flavor => {
                filterParamsLocal.append("flavors", flavor);
            });
            filterParamsLocal.append("minPrice", String(filters.price.min));
            filterParamsLocal.append("maxPrice", String((filters.price.max<MAX_PRICE_INITIALLY)?filters.price.max:Infinity));
            filterParamsLocal.append("rating", String(filters.rating));

            getProductsAfterReloadingPage({skip, filterParamsLocal});
        }, 3000);

        return() => clearTimeout(timer);
    }, []);

    // ------------  addToWishlistHandler, addToCartHandler and onClickEventHandlers are redeclared at Home.page.tsx
    //async function addToWishlistHandler(selectedProduct:{_id:string; name:string; brand:string; category:ProductTypes["category"]; dietaryType:"veg"|"nonveg"|"vegan"; images:string[]; price:number; variant:string;}) {
    //    const res = await addToWishlist({productID:selectedProduct._id, variant:selectedProduct.variant});
    //    if (res.success) {
    //        setWishlistData((prev) => {
    //            if (res.jsonData.operation === 1) {
    //                return [...prev, selectedProduct];
    //            }
    //            else if (res.jsonData.operation === -1) {
    //                return prev.filter((p) => (p._id !== res.jsonData.productID && p.variant !== res.jsonData.variant));
    //            }
    //            else{
    //                return prev;
    //            }
    //        })
    //    }
    //};


    //async function addToCartHandler({productID, variant}:{productID:string; variant:string;}) {
    //    try {
    //        setSelectedProduct(productID);
    //        const res = await addToCart({productID, variant, quantity:1});
    
    //        if (cartData.length === 0) {
    //            setCartData([{...res.jsonData.products, variant, quantity:res.jsonData.quantity}]);
    //        }
    //        else{
    //            setCartData((prev) => {
    //                const findResult = prev.find(p => (p._id === res.jsonData.products._id && p.variant===variant));
    
    //                if (findResult) {
    //                    return prev.map((p) => (p._id === res.jsonData.products._id && p.variant===variant)?{...p, quantity:res.jsonData.quantity, variant}:p);
    //                }
    //                else{
    //                    return [...prev, {...res.jsonData.products, variant, quantity:res.jsonData.quantity}];
    //                }
    //            });
    //        }
    //    } catch (error) {
    //        console.log("failed to mutate cart");
    //        console.log(error);
    //    }
    //    finally{
    //        setSelectedProduct(null);
    //    }
    //};

    //async function onClickEventHandlers({product, variant}:{product:LocalCartTypes; variant:string;}) {
    //    //const buttonData = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("data-set");
    //    //const buttonName = (e.target as HTMLElement).parentElement?.parentElement?.getAttribute("name") as (keyof(typeof buttonNames));

    //    //if (!buttonData) throw Error("nothing will happen because buttonData is undefined");
    //    //const parsedData = JSON.parse(buttonData) as LocalCartTypes;
    //    //if (!parsedData?._id) throw Error("nothing will happen because productID is undefined");

    //    if (isUserAuthenticated()) {
    //        addToCartHandler({productID:product._id, variant});
    //    }
    //    else{
    //        addToLocalCart(product);
    //    }

    //    //if (buttonName === "addToCartHandler") {
    //    //}
    //    //else if(buttonName === "addToWishlistHandler"){
    //    //    //addToWishlistHandler(parsedData);
    //    //}
        
    //};
    // ------------

    function filterOnChangeHandler(e:ChangeEvent<HTMLInputElement>) {
        const filtersLocal:{
            dietaryTypes: ("veg" | "nonveg" | "vegan")[];
            categories:string[],
            subCategories:string[],
            price: {
                min: number;
                max: number;
            };
            brands: string[];
            rating: 0 | 1 | 2 | 3 | 4 | 5;
            flavors: string[];
        } = filters;

        if (e.target.name === "dietaryType") {
            const dietaryTypeFilterArray = filters.dietaryTypes;
            if (dietaryTypeFilterArray.includes(e.target.value as "veg"|"nonveg"|"vegan")) {
                filtersLocal.dietaryTypes = dietaryTypeFilterArray.filter(prev => prev !== e.target.value);
            }
            else{
                dietaryTypeFilterArray.push(e.target.value as "veg"|"nonveg"|"vegan");
                filtersLocal.dietaryTypes = dietaryTypeFilterArray;
            }
        }
        else if (e.target.name === "categories") {
            const categoriesFilterArray = filters.categories;
            if (categoriesFilterArray.includes(e.target.value)) {
                filtersLocal.categories = categoriesFilterArray.filter(prev => prev !== e.target.value);
            }
            else{
                categoriesFilterArray.push(e.target.value as "veg"|"nonveg"|"vegan");
                filtersLocal.categories = categoriesFilterArray;
            }
        }
        else if (e.target.name === "brands") {
            const brandsFilterArray = filters.brands;
            if (brandsFilterArray.includes(e.target.value)) {
                filtersLocal.brands = brandsFilterArray.filter(prev => prev !== e.target.value);
            }
            else{
                brandsFilterArray.push(e.target.value as "veg"|"nonveg"|"vegan");
                filtersLocal.brands = brandsFilterArray;
            }
        }
        else if (e.target.name === "minPrice") {
            filtersLocal.price.min = Number(e.target.value);
        }
        else if (e.target.name === "maxPrice") {
            filtersLocal.price.max = Number(e.target.value);
        }
        else if (e.target.name === "rating") {
            filtersLocal.rating = Number(e.target.value) as 0|1|2|3|4|5;
        }
        else if (e.target.name === "flavors") {
            const flavorsFilterArray = filters.flavors;
            if (flavorsFilterArray.includes(e.target.value)) {
                filtersLocal.flavors = flavorsFilterArray.filter(prev => prev !== e.target.value);
            }
            else{
                flavorsFilterArray.push(e.target.value);
                filtersLocal.flavors = flavorsFilterArray;
            }
        }
        
        setFilters(filtersLocal);
        getProductsFromChangingFilters()
    };
    function clearFiltersHandler() {
        setFilters({
            dietaryTypes:[],
            categories:[],
            subCategories:[],
            price:{min:0, max:MAX_PRICE_INITIALLY},
            brands:[],
            rating:0,
            flavors:[]
        });
        setMin(0);
        setSkip(0);
        setMax(MAX_PRICE_INITIALLY);
        clearTimeout(timer);
        setIsResloading(true);
        setProducts([]);
        timer = setTimeout(() => {
            const filterParamsLocal = new URLSearchParams();
            filterParamsLocal.append("dietaryTypes", "");
            filterParamsLocal.append("categories", "");
            filterParamsLocal.append("brands", "");
            filterParamsLocal.append("flavors", "");
            filterParamsLocal.append("minPrice", String(0));
            filterParamsLocal.append("maxPrice", String(Infinity));
            filterParamsLocal.append("rating", String(0));

            getProductsAfterReloadingPage({skip:0, filterParamsLocal});
        }, 3000);
    };
    function clearSingleFilterByBadge({filterName, filterValue}:{filterName:keyof FilterInterface; filterValue:(string|("veg"|"nonveg"|"vegan"));}) {
        const filtersLocal:{
            dietaryTypes:("veg" | "nonveg" | "vegan")[];
            categories:string[],
            subCategories:string[],
            price: {
                min: number;
                max: number;
            };
            brands: string[];
            rating: 0 | 1 | 2 | 3 | 4 | 5;
            flavors: string[];
        } = filters;

        if (filterName === searchField) {
            
        }

        if (filterName !== "price" && filterName !== "rating" && filterName !== "dietaryTypes") {
            const filteredArray = filtersLocal[filterName].filter((filter) => (filter !== filterValue));
            filtersLocal[filterName] = filteredArray;
            //setFilters(prev => ({...prev, [filterName]:filteredArray}));
        }
        else if (filterName === "dietaryTypes") {
            const filteredArray = filtersLocal[filterName].filter((filter) => (filter !== filterValue));
            filtersLocal[filterName] = filteredArray;
            //setFilters(prev => ({...prev, [filterName]:filteredArray}));
        }
        else if(filterName === "price"){
            setMin(MIN_PRICE_INITIALLY);
            setMax(MAX_PRICE_INITIALLY);
            //setFilters(prev => ({...prev, price:{min:0, max:Infinity}}));
            filtersLocal.price = {min:0, max:Infinity};
        }
        else{
            filtersLocal.rating = 0;
            //setFilters(prev => ({...prev, rating:0}))
        }
        setFilters(filtersLocal);
        getProductsFromChangingFilters();
    };

    function emitFilterControlPanelEvent() {
        const event = new CustomEvent<{isFilterControlPanelOpen:boolean;}>("toggleFilterControlPanel", {
            detail:{isFilterControlPanelOpen:true}
        });

        window.dispatchEvent(event);
    };

    return(
        <section className="">
            <div className="flex flex-col sm:flex-row gap-4 sm:p-4 bg-primary-50">

                {/* upper part heading and apply filters button only for smaller devices */}
                <div className="bg-white flex sm:hidden justify-between items-center py-2 px-2">
                    <div className="text-gray-500 font-semibold">Apply Filters</div>
                    <button className="flex items-center gap-2 py-2"
                        onClick={emitFilterControlPanelEvent}
                    >
                        <span>Filters</span>
                        <BiFilter />
                    </button>
                </div>


                {/* left part only for larger devices */}
                <div className="sm:border border-gray-200 bg-transparent sm:bg-white sm:sticky top-20 left-0 w-full sm:w-60 h-max rounded-2xl">
                    <div className="hidden sm:block">

                        {/* heading and clear filters button only for larger devices */}
                        <div className="hidden sm:flex justify-between p-4">
                            <span className="text-gray-500 font-semibold">FILTERS</span>
                            {
                                (isReloading||isFiltersMutating||isProductsRefetching) ?
                                    <div className="border border-gray-200 w-18 rounded-lg">
                                        <div className="w-min mx-auto mt-0.5">
                                            <Spinner color="var(--color-gray-400)" type="secondary" thickness="1.5px" width="15px" />
                                        </div>
                                    </div>
                                    :
                                    <button className="text-secondary-400" onClick={clearFiltersHandler}>Clear Filter</button>
                            }
                        </div>

                        {/* filter badges */}
                        <div className="flex flex-wrap gap-4 p-4">
                            {
                                (searchQuery&&searchQuery!=="null") &&
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={()=>{window.location.href = `/searched_products/null/null/null`;}}
                                    >
                                        <span>{searchQuery}</span>
                                        <span>x</span>
                                    </button>
                                
                            }
                            {
                                (subCategory&&subCategory!=="null") &&
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={()=>{
                                            if(searchField&&searchQuery){
                                                window.location.href = `/searched_products/${searchField}/${searchQuery}/null`;
                                            }
                                            else{
                                                window.location.href = `/searched_products/null/null/null`;
                                            }
                                        }}
                                    >
                                        <span>{subCategory}</span>
                                        <span>x</span>
                                    </button>
                                
                            }
                            {
                                filters.dietaryTypes.map((filterValue) => (
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={() => clearSingleFilterByBadge({filterName:"dietaryTypes", filterValue})}
                                    >
                                        <span>{filterValue}</span>
                                        <span>x</span>
                                    </button>
                                ))
                            }
                            {
                                filters.categories.map((filterValue) => (
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={() => clearSingleFilterByBadge({filterName:"categories", filterValue})}
                                    >
                                        <span>{filterValue}</span>
                                        <span>x</span>
                                    </button>
                                ))
                            }
                            {
                                filters.subCategories.map((filterValue) => (
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={() => clearSingleFilterByBadge({filterName:"subCategories", filterValue})}
                                    >
                                        <span>{filterValue}</span>
                                        <span>x</span>
                                    </button>
                                ))
                            }
                            {
                                (filters.price.min > 0 || filters.price.max < MAX_PRICE_INITIALLY) &&
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={() => clearSingleFilterByBadge({filterName:"price", filterValue:""})}
                                    >
                                        <span>Price ₹{filters.price.min} - ₹{filters.price.max}</span>
                                        <span>x</span>
                                    </button>
                            }
                            {
                                filters.brands.map((filterValue) => (
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={() => clearSingleFilterByBadge({filterName:"brands", filterValue})}
                                    >
                                        <span>{filterValue}</span>
                                        <span>x</span>
                                    </button>
                                ))
                            }
                            {
                                filters.rating!==0 && 
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={() => clearSingleFilterByBadge({filterName:"rating", filterValue:""})}
                                    >
                                        <span>{filters.rating} {filters.rating===1?"star":"stars"}</span>
                                        <span>x</span>
                                    </button>
                            }
                            {
                                filters.flavors.map((filterValue) => (
                                    <button className="border border-gray-200 bg-gray-200/40 rounded-full text-gray-600 text-xs pl-3.25 pr-3 pt-1 pb-1.5 flex items-center gap-1.5 hover:bg-primary-100 hover:scale-90 transition-all ease-out duration-300"
                                        onClick={() => clearSingleFilterByBadge({filterName:"flavors", filterValue})}
                                    >
                                        <span>{filterValue}</span>
                                        <span>x</span>
                                    </button>
                                ))
                            }

                        </div>
                        
                        {
                            isReloading ?
                            <div className="flex flex-col gap-4 p-4">
                                {
                                    [0,1,2,3,4,5].map((iter) => (
                                        <div key={iter} className="w-full h-9 rounded-md overflow-hidden">
                                            <Skeletan />
                                        </div>
                                    ))
                                }
                            </div>
                            :
                            <Accordion chevronSize="xs" data={[
                                {
                                    // dietaryType
                                    heading:(<div className="text-sm font-semibold px-4 py-3">Preference</div>),
                                    para:(
                                        <div className="text-sm flex flex-col gap-2 px-4 py-3 bg-primary-50/30 [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] rounded-lg">
                                            <div className="flex items-center gap-2 hover:text-primary-400">
                                                <input id="veg" type="checkbox" name="dietaryType" value="veg" checked={filters.dietaryTypes.includes("veg")} onChange={filterOnChangeHandler} />
                                                <label htmlFor="veg" className="w-full">Vegetarian</label>
                                            </div>
                                            <div className="flex items-center gap-2 hover:text-primary-400">
                                                <input id="nonveg" type="checkbox" name="dietaryType" value="nonveg" checked={filters.dietaryTypes.includes("nonveg")} onChange={filterOnChangeHandler} />
                                                <label htmlFor="nonveg" className="w-full">Non-Vegetarian</label>
                                            </div>
                                            <div className="flex items-center gap-2 hover:text-primary-400">
                                                <input id="vegan" type="checkbox" name="dietaryType" value="vegan" checked={filters.dietaryTypes.includes("vegan")} onChange={filterOnChangeHandler} />
                                                <label htmlFor="vegan" className="w-full">Vegan</label>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    // category
                                    heading:(<div className="text-sm font-semibold px-4 py-3">Category</div>),
                                    para:(
                                        <div className="bg-primary-50/30 [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] rounded-lg">
                                            <input name="categories" placeholder="Enter category name"
                                                className="border border-gray-200 bg-white text-sm w-full mt-4 px-3 py-3 sm:py-2.5 rounded-sm"
                                            />
                                            <div className="text-sm flex flex-col gap-2 h-40 max-h-min px-4 py-3 overflow-y-scroll scrollbar-thin">
                                                {    FILTER_CATEGORIES_OBJECT.map(({heading, category}) => (
                                                        <div key={category} className="flex items-center gap-2 hover:text-primary-400">
                                                            <input id={category} type="checkbox" name="categories" value={category} checked={filters.categories.includes(category)} onChange={filterOnChangeHandler} />
                                                            <label htmlFor={category} className="w-full">{heading}</label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    // sub category
                                    heading:(<div className="text-sm font-semibold px-4 py-3">Sub Category</div>),
                                    para:(
                                        <div className="bg-primary-50/30 [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] rounded-lg">
                                            <div className="text-sm flex flex-col gap-2 h-40 max-h-min p-4 overflow-y-scroll scrollbar-thin">
                                                {
                                                    filters.categories.map((category) => (
                                                        (category !== ""
                                                        &&
                                                        FILTER_SUB_CATEGORIES_OBJECT[category as keyof typeof FILTER_SUB_CATEGORIES_OBJECT] !== null
                                                        &&
                                                        typeof FILTER_SUB_CATEGORIES_OBJECT[category as keyof typeof FILTER_SUB_CATEGORIES_OBJECT] === "object")
                                                        &&
                                                        FILTER_SUB_CATEGORIES_OBJECT[category as keyof typeof FILTER_SUB_CATEGORIES_OBJECT].map(({heading, subCategory}) => (
                                                            <div key={subCategory} className="flex items-center gap-2 hover:text-primary-400">
                                                                <input id={subCategory} type="checkbox" name="subCategories" value={subCategory} checked={filters.subCategories.includes(subCategory)} onChange={filterOnChangeHandler} />
                                                                <label htmlFor={subCategory} className="w-full">{heading}</label>
                                                            </div>
                                                        ))
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    // price
                                    heading:(<div className="text-sm font-semibold px-4 py-3">Price</div>),
                                    para:(
                                        <div className="flex flex-col gap-4 px-4 py-3 bg-primary-50/30 [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] rounded-lg">
                                            <div className="w-full">
                                                <RangeInput minState={min} setMinState={setMin} maxState={max} setMaxState={setMax} minValue={MIN_PRICE_INITIALLY} maxValue={MAX_PRICE_INITIALLY}
                                                    thumbSize="xs" rangeThickness="sm" onChangeHandlers={{
                                                        maxChangeHandler(e) {filterOnChangeHandler(e)},
                                                        minChangeHandler(e) {filterOnChangeHandler(e)}
                                                    }}
                                                />
                                            </div>
                                            <div className="flex justify-around items-center text-sm gap-2">
                                                <div className="text-gray-700 px-2 py-1.5 w-20 text-right rounded-sm [box-shadow:0px_0px_3px_0.1px_var(--color-gray-400)_inset]">₹{min}</div>
                                                <div className="text-gray-500">to</div>
                                                <div className="text-gray-700 px-2 py-1.5 w-20 text-right rounded-sm [box-shadow:0px_0px_3px_0.1px_var(--color-gray-400)_inset]">₹{max}</div>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    // brand
                                    heading:(<div className="text-sm font-semibold px-4 py-3">Brand</div>),
                                    para:(
                                        <div className="bg-primary-50/30 [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] rounded-lg">
                                            <input name="brands" placeholder="Enter brand name"
                                                className="border border-gray-200 bg-white text-sm w-full mt-4 px-3 py-3 sm:py-2.5 rounded-sm"
                                            />
                                            <div className="text-sm flex flex-col gap-2 h-40 max-h-min px-4 py-3 overflow-y-scroll scrollbar-thin">
                                                {
                                                    ["brand1", "brand2", "Viado's Himalayan Organics", "Neuherbs", "HealthyHey Nutrition", "Dr. Morepen", "HealthAid", "Zeroharm", "Nutrabay", "Optimum", "Patoni"].map((brand) => (
                                                        <div key={brand} className="flex items-center gap-2 hover:text-primary-400">
                                                            <input id={brand} type="checkbox" name="brands" value={brand} checked={filters.brands.includes(brand)} onChange={filterOnChangeHandler} />
                                                            <label htmlFor={brand} className="w-full">{brand}</label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    // rating
                                    heading:(<div className="text-sm font-semibold px-4 py-3">Rating</div>),
                                    para:(
                                        <div className="text-sm flex flex-col gap-2 px-4 py-3 bg-primary-50/30 [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] rounded-lg">
                                            {
                                                [{label:"⭐⭐⭐⭐⭐ Only", value:5}, {label:"⭐⭐⭐⭐ & Up", value:4}, {label:"⭐⭐⭐ & Up", value:3}, {label:"⭐⭐ & Up", value:2}, {label:"⭐ & Up", value:1}].map((iter) => (
                                                    <div key={iter.value} className="flex items-center gap-2 hover:text-primary-400">
                                                        <input id={iter.label} type="radio" name="rating" value={iter.value} checked={filters.rating === iter.value} onChange={filterOnChangeHandler} />
                                                        <label htmlFor={iter.label} className="w-full">{iter.label}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                },
                                {
                                    // flavor
                                    heading:(<div className="text-sm font-semibold px-4 py-3">Flavor</div>),
                                    para:(
                                        <div className="bg-primary-50/30 [box-shadow:0px_0px_4px_0px_var(--primary-300)_inset] rounded-lg">
                                            <input name="" placeholder="Enter flavor name"
                                                className="border border-gray-200 bg-white text-sm w-full mt-4 px-3 py-3 sm:py-2.5 rounded-sm"
                                            />
                                            <div className="text-sm flex flex-col gap-2 h-40 max-h-min px-4 py-3 overflow-y-scroll scrollbar-thin">
                                                {
                                                    ["Chocolate Milk", "Mango Shake", "Banana Shake", "Pista Badam", "Strawberry Milk", "Vanilla", "Butter Scotch", "Orange", "Unflavored", "Lemon"].map((flavor) => (
                                                        <div key={flavor} className="flex items-center gap-2 hover:text-primary-400">
                                                            <input id={flavor} type="checkbox" name="flavors" value={flavor} checked={filters.flavors.includes(flavor)} onChange={filterOnChangeHandler} />
                                                            <label htmlFor={flavor} className="w-full">{flavor}</label>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            ]} />
                        }

                    </div>
                </div>
                {/* right part */}
                <div className="border border-gray-200 bg-white flex-1 rounded-t-2xl">
                    {/*<pre className="text-sm">{JSON.stringify({searchField, searchQuery}, null, `\t`)}</pre>*/}

                    {
                        (isReloading||isFiltersMutating) ?
                            // loading
                            <div className="w-full h-125 relative">
                                <div className="w-min absolute top-[50%] left-[50%] -translate-[50%]">
                                    <Spinner color="var(--color-primary-400)" width="100px" thickness="4px" text="Loading..." fontWeight="bold"  />
                                </div>
                            </div>
                            :
                            // error
                            error ?
                                <div className="w-full h-full grid place-items-center">
                                    <div className="border border-gray-200 w-full max-w-md rounded-md p-4">
                                        <h1 className="text-lg text-gray-700 font-semibold text-center">Error Occured</h1>
                                        <p className="text-gray-600 text-center">{error}</p>
                                    </div>
                                </div>
                                :
                                // no products
                                products.length === 0 ?
                                    <div className="">
                                        <img src="/empty_cart2.png" alt="/empty_cart2.png" className="w-xl mx-auto" />
                                        <h1 className="text-2xl text-center font-bold text-gray-800 py-1">Product Not Found!</h1>
                                        <p className=" text-center text-gray-400 font-semibold py-1/2">It looks like {searchField} of {searchQuery} and subCategory of {subCategory} does not exist</p>
                                        <div className="my-8">
                                            <button className="bg-primary-100 hover:bg-primary-50 text-primary-800 font-semibold w-full max-w-70 mx-auto py-3 rounded-md flex justify-center items-center gap-1 transition-colors ease-out duration-300 group"
                                                onClick={() => navigate("/home")}
                                            >
                                                <span className="ml-4 -translate-y-0.25">Continue Shopping</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 group-hover:translate-x-4 ease-out duration-300">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </button>
                                            {/*<button className="bg-[#f44769] text-white text-[1.2rem] py-2 px-3 font-medium rounded-[8px] my-7" onClick={navigateToInventoryHandler}>Add New Products</button>*/}
                                        </div>
                                    </div>
                                    :
                                    // products
                                    <div>
                                        <div className="flex flex-wrap justify-around gap-2 px-2 sm:p-4">
                                            {
                                                products.map((product, index) => (
                                                    <div key={index} className="w-full sm:max-w-60 mt-10">
                                                        <ProductCard product={product} isVeg={product.dietaryType!=="nonveg"} isBestseller={false} isCartMutating={false} />
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        {/* fetch more button */}
                                        {
                                            (!isReloading && !error) &&
                                                <div className="my-6">
                                                    <button disabled={(!isProductsRefetching&&isProductsFinished)} className={`border relative ${(!isProductsRefetching&&!isProductsFinished)?"border-primary-200 text-primary-400 bg-primary-50 hover:bg-primary-50/50":"border-primary-100 text-primary-200 bg-primary-50/50 cursor-no-drop"} rounded-md block mx-auto w-25 h-10`}
                                                        onClick={getProductsFromNextBtn}
                                                    >
                                                        <div className={`${(isProductsRefetching&&!isProductsFinished)?"opacity-100 scale-100 blur-0":"opacity-0 scale-0 blur-sm"} h-full absolute top-0 -left-0.25 w-full transition-all ease-in-out duration-300`}>
                                                            <div className="w-full h-full flex justify-center items-center gap-1.25">
                                                                <div className="size-1.5 bg-primary-400 rounded-2xl"
                                                                    style={{
                                                                        animation:"up-down-dot-loading 1s 0s linear infinite"
                                                                    }}
                                                                ></div>
                                                                <div className="size-1.5 bg-primary-400 rounded-2xl"
                                                                    style={{
                                                                        animation:"up-down-dot-loading 1s 0.2s linear infinite"
                                                                    }}
                                                                ></div>
                                                                <div className="size-1.5 bg-primary-400 rounded-2xl"
                                                                    style={{
                                                                        animation:"up-down-dot-loading 1s 0.4s linear infinite"
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className={`${(!isProductsRefetching&&isProductsFinished)?"opacity-100 scale-100 blur-0":"opacity-0 scale-0 blur-sm"} h-full absolute top-0 -left-0.25 w-full transition-all ease-in-out duration-300`}>
                                                            <div className="w-full h-full flex justify-center items-center gap-1.25">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                                                                    <path d="m2 2 20 20"/>
                                                                    <path d="M8.35 2.69A10 10 0 0 1 21.3 15.65"/>
                                                                    <path d="M19.08 19.08A10 10 0 1 1 4.92 4.92"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className={`${(!isProductsRefetching&&!isProductsFinished)?"opacity-100 scale-100 blur-0":"opacity-0 scale-0 blur-sm"} font-semibold transition-all ease-in-out duration-300`}>More</div>
                                                    </button>
                                                </div>
                                        }
                                    </div>
                    }

                </div>


                {/* filters controller panel for mobiles only */}
                <FilterControlPanel filterOnChangeHandler={filterOnChangeHandler} clearFiltersHandler={clearFiltersHandler} min={min} setMin={setMin} max={max} setMax={setMax} />

                

            </div>
        </section>


        //<HandlePageUIWithState isLoading={dataStatus.isLoading} isSuccess={dataStatus.isSuccess} error={dataStatus.error}>
        //    <section className="pt-10">
        //        <div className="flex flex-wrap gap-10">
        //            {
        //                products.map((p) => (
        //                    <div className="w-90 sm:w-70 mx-auto">
        //                        <ProductCard
        //                            key={p._id}
        //                            product={p}
        //                            isBestseller={false}
        //                            isVeg={p.dietaryType === "nonveg"?false:true}
        //                            isCartMutating={selectedProduct === p._id}
        //                            off={20}
        //                        />
        //                    </div>
        //                ))
        //            }
        //        </div>
                
                
                
                

        //        <ButtonPrimary
        //            isLoading={refetchDataStatus.isLoading}
        //            isSuccess={refetchDataStatus.isSuccess}
        //            isDisabled={(refetchDataStatus.error !== "")}
        //            onClickHandler={() => getProductsHandler()}
        //        />
        //    </section>
        //</HandlePageUIWithState>
    )
};

export default SearchedProducts;




    //function filterOnChangeHandler(e:ChangeEvent<HTMLInputElement>) {
    //    console.log(filters); // log 1
              
    //    if (e.target.name === "dietaryType") {
    //        const dietaryTypeFilterArray = filters.dietaryTypes;
    //        if (dietaryTypeFilterArray.includes(e.target.value as "veg"|"nonveg"|"vegan")) {
    //            setFilters(prev => ({...prev, dietaryTypes:dietaryTypeFilterArray.filter(prev => prev !== e.target.value)}));
    //        }
    //        else{
    //            dietaryTypeFilterArray.push(e.target.value as "veg"|"nonveg"|"vegan");
    //            setFilters(prev => ({...prev, dietaryTypes:dietaryTypeFilterArray}));
    //        }
    //    }
    //    else if (e.target.name === "brands") {
    //        const brandsFilterArray = filters.brands;
    //        if (brandsFilterArray.includes(e.target.value)) {
    //            setFilters(prev => ({...prev, brands:brandsFilterArray.filter(prev => prev !== e.target.value)}));
    //        }
    //        else{
    //            brandsFilterArray.push(e.target.value as "veg"|"nonveg"|"vegan");
    //            setFilters(prev => ({...prev, brands:brandsFilterArray}));
    //        }
    //    }
    //    else if (e.target.name === "rating") {
            
    //        //const ratingFilter = filters.rating;
    //        setFilters(prev => ({...prev, rating:Number(e.target.value) as 0|1|2|3|4|5}));
    //        //if (ratingFilter === Number(e.target.value)) {
    //        //}
    //    }
    //    else if (e.target.name === "flavors") {
    //        const flavorsFilterArray = filters.flavors;
    //        if (flavorsFilterArray.includes(e.target.value)) {
    //            setFilters(prev => ({...prev, flavors:flavorsFilterArray.filter(prev => prev !== e.target.value)}));
    //        }
    //        else{
    //            flavorsFilterArray.push(e.target.value);
    //            setFilters(prev => ({...prev, flavors:flavorsFilterArray}));
    //        }
    //    }
    //    console.log(filters); // log 2

    //};