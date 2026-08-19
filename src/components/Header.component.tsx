import { NavLink } from "react-router-dom";
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { BiSearch } from "react-icons/bi";
import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import { BsArrowRight } from "react-icons/bs";
import { getProducts, searchProducts } from "../apis/product.api";
import type { ProductTypes } from "../utils/types";
import { MdOutlineInventory2 } from "react-icons/md";



export interface HeaderPropTypes {
    isHeaderVisible:boolean;
};

const productsBy = {
    categories:["Performance Nutrition", "VItamins And Supplements", "Health Food And Drinks", "Workout Gear", "Nutrabay Top 10"],
    brands:["asdkajsdlka", "asdasd asdasd", "sakdjasldk asd asdas", "askdlajsd asdkl", "asas asdasdasdad", "asdasdasds adasdasasd"]
};

function Header({isHeaderVisible}:HeaderPropTypes) {
    const {calculateTotalCartItems, wishlistData} = useCart();
    const {loggedInUserName, isUserAuthenticated, userData} = useUser();
    const [searchQry, setSearchQry] = useState<string>("");
    const [isHamburgerSideBarOpen, setIsHamburgerSideBarOpen] = useState<boolean>(false);
    const [isSearchBarSuggessionsOpen, setIsSearchBarSuggessionsOpen] = useState<boolean>(false);
    const [bestSellers, setBestSellers] = useState<ProductTypes[]>([]);
    const [searchedData, setSearchedData] = useState<{names:ProductTypes[]; categories:ProductTypes[]; brands:ProductTypes[]; tags:ProductTypes[];}>({
        names:[
            //{_id:"12345678901", brand:"brand1", category:"protein", images:[], name:"product1", price:1000, size:100, tag:["brand1", "protein"], numReviews:0, weight:"100gm", rating:0}
        ],
        categories:[
            //{_id:"12345678901", brand:"brand1", category:"protein", images:[], name:"product1", price:1000, size:100, tag:["brand1", "protein"], numReviews:0, weight:"100gm", rating:0},
        ],
        brands:[
            //{_id:"12345678901", brand:"brand1", category:"protein", images:[], name:"product1", price:1000, size:100, tag:["brand1", "protein"], numReviews:0, weight:"100gm", rating:0},
        ],
        tags:[
            //{_id:"12345678901", brand:"brand1", category:"protein", images:[], name:"product1", price:1000, size:100, tag:["brand1", "protein"], numReviews:0, weight:"100gm", rating:0},
            //{_id:"12345678902", brand:"brand1", category:"creatine", images:[], name:"product2", price:200, size:100, tag:["brand1", "creatine"], numReviews:0, weight:"100gm", rating:0},
        ]
    });

    const [selectedTab, setSelectedTab] = useState<"categories"|"brands">("categories");


    function searchInpOnChnageHandler(e:ChangeEvent<HTMLInputElement>) {
        setSearchQry(e.target.value);
    };
    function searchInpClearHandler() {
        setSearchQry("");
    };
    function searchInputFocusHandler() {
        setIsSearchBarSuggessionsOpen(true);
    };
    function searchInputBlurHandler() {
        setIsSearchBarSuggessionsOpen(false);
    };
    
    function categoryBrandTabHandler(e:MouseEvent<HTMLButtonElement>) {
        const buttonName = ((e.target as HTMLButtonElement).name as ("categories"|"brands"));
        if (!buttonName) {
            console.log(`buttonName is neither categories nor brands it is ${buttonName}`);
            return;
        }
        setSelectedTab(buttonName);
    };
    function hamburgerSideBarToggleHandler() {
        setIsHamburgerSideBarOpen(!isHamburgerSideBarOpen);
    };
    async function getBestSellersHandler(signal?:AbortSignal) {
        try {
            const res = await getProducts(0, "soldCount", "", signal);

            if (res.success) {
                console.log(res.jsonData);
                
                setBestSellers(res.jsonData);
            }
        } catch (error) {
            console.log(error);
            throw Error(error as string);
        }
    };

    async function getSearchedProductsHandler() {
        if(!searchQry) {
            setSearchedData({names:[],brands:[], categories:[], tags:[]});
            throw Error("searchQuery not found");
        }
        const res = await searchProducts(searchQry);
        if (res.success) {
            setSearchedData(res.jsonData);
        }
        console.log(res);
    };

    useEffect(() => {
        getBestSellersHandler();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            getSearchedProductsHandler();
        }, 2000);

        return () => clearTimeout(timer);
    }, [searchQry]);
    

    useEffect(() => {
        document.body.style.overflow = (isHamburgerSideBarOpen||isSearchBarSuggessionsOpen) ? "hidden" : "auto";
    }, [isHamburgerSideBarOpen, isSearchBarSuggessionsOpen])

    return(
        <header
            className="fixed w-full top-0 left-0 header bg-primary-400 flex justify-between gap-5 sm:gap-10 px-2 sm:px-4 h-[10vh] transition-transform duration-300 ease-in-out z-10"
            style={{
                transform:isHeaderVisible?"translateY(0%)":"translateY(-101%)"
            }}
        >

            {/* ham and logo */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-1 sm:p-3 hover:bg-primary-300/50 rounded-md cursor-pointer"
                    onClick={hamburgerSideBarToggleHandler}
                >
                    <div className="flex flex-col gap-1">
                        <div className="bg-gray-800 rounded-xs h-0.75 w-5 xs:h-1 xs:w-8"></div>
                        <div className="bg-gray-800 rounded-xs h-0.75 w-5 xs:h-1 xs:w-8"></div>
                        <div className="bg-gray-800 rounded-xs h-0.75 w-5 xs:h-1 xs:w-8"></div>
                    </div>
                </div>
                <NavLink to="/home" className="w-10 sm:w-15">
                    <img src="logo.png" alt="logo.png" />
                </NavLink>
            </div>

            {/* search bar */}
            <div className="content-center w-25 xs:w-50 sm:w-80 md:w-200">
                <div className="border border-primary-800 bg-primary-200 placeholder-primary-800 relative rounded-md">
                    {/* search input */}

                    <div className="w-full absolute top-0 left-0 text-gray-700 rounded-md flex overflow-hidden">
                        <input type="text" placeholder=""
                            className="w-full px-3 py-3 caret-gray-700 focus:outline-0 -outline-offset-2 outline-gray-700 lg:focus:outline-3"
                            value={searchQry}
                            style={{
                                color:searchQry?"#364153":"transparent"
                            }}
                            onFocus={searchInputFocusHandler}
                            onBlur={searchInputBlurHandler}
                            onChange={searchInpOnChnageHandler}
                        />
                        <button className="px-3 py-3 border-primary-400 cursor-pointer hover:bg-primary-100 transition-all ease-in-out duration-300"
                            style={{
                                filter:searchQry?"blur(0px)":"blur(2px)",
                                transform:searchQry?"scale(1)":"scale(0)"
                            }}
                            onClick={searchInpClearHandler}
                        >X</button>
                    </div>
                    
                    {   /* search input placeholder */
                        <div className="w-full h-full text-nowrap truncate p-3 rounded-md font-mono flex items-center"
                            style={{
                                color:searchQry?"transparent":"oklch(44.4% 0.177 26.899)"
                                //opacity:0
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            &nbsp;Search Products, Category, Brands and More</div>
                    }

                    {/* search bar suggessions */}
                    <div className={`border border-gray-200 absolute top-[105%] left-[50%] -translate-x-[50%] bg-white rounded-lg h-140 w-full min-w-90 ${isSearchBarSuggessionsOpen?"scale-y-100 opacity-100":"scale-y-0 opacity-0"} origin-top transition-all ease-in-out duration-300 fog-y`}>
                        <div className="border h-full p-4 flex flex-col gap-4 overflow-y-scroll scrollbar-thin">

                            {
                                searchedData["names"].length!==0 &&
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="text-lg font-semibold text-gray-800">Products with Name ( <span className="text-gray-500 bg-primary-200 font-normal px-1">{searchQry}</span> )</div>
                                        </div>
                                        <div className="flex flex-col">
                                            {
                                                searchedData["names"].map((product, index) => (
                                                    <NavLink to="####" key={index} className="flex items-center gap-4 p-2 hover:bg-primary-100 rounded-md">
                                                        <div><BiSearch className="w-5 h-5 text-gray-600" /></div>
                                                        <div>
                                                            <div className="text-gray-700 font-semibold">{product.name}</div>
                                                            <div className="text-sm text-gray-400">{product.brand} | {product.price}₹ | {product.category}</div>
                                                        </div>
                                                        <div className="text-gray-500 ml-auto"><BsArrowRight /></div>
                                                    </NavLink>
                                                ))
                                            }
                                            <NavLink to={`/searched_products/name/${searchQry}`} className="text-sm text-primary-400 my-2 underline underline-offset-2" onClick={searchInputBlurHandler}>Show more</NavLink>
                                        </div>
                                    </div>
                            }
                            {
                                searchedData["brands"].length!==0 &&
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="text-lg font-semibold text-gray-800">Products with Brand ( <span className="text-gray-500 bg-primary-200 font-normal px-1">{searchQry}</span> )</div>
                                        </div>
                                        <div className="flex flex-col">
                                            {
                                                searchedData["brands"].map((product, index) => (
                                                    <NavLink to="####" key={index} className="flex items-center gap-4 p-2 hover:bg-primary-100 rounded-md">
                                                        <div><BiSearch className="w-5 h-5 text-gray-600" /></div>
                                                        <div>
                                                            <div className="text-gray-700 font-semibold">{product.name}</div>
                                                            <div className="text-sm text-gray-400">{product.brand} | {product.price}₹ | {product.category}</div>
                                                        </div>
                                                        <div className="text-gray-500 ml-auto"><BsArrowRight /></div>
                                                    </NavLink>
                                                ))
                                            }
                                            <NavLink to={`/searched_products/brand/${searchQry}`} className="text-sm text-primary-400 my-2 underline underline-offset-2" onClick={searchInputBlurHandler}>Show more</NavLink>
                                        </div>
                                    </div>
                            }
                            {
                                searchedData["categories"].length!==0 &&
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="text-lg font-semibold text-gray-800">Products with Category ( <span className="text-gray-500 bg-primary-200 font-normal px-1">{searchQry}</span> )</div>
                                        </div>
                                        <div className="flex flex-col">
                                            {
                                                searchedData["categories"].map((product, index) => (
                                                    <NavLink to="####" key={index} className="flex items-center gap-4 p-2 hover:bg-primary-100 rounded-md">
                                                        <div><BiSearch className="w-5 h-5 text-gray-600" /></div>
                                                        <div>
                                                            <div className="text-gray-700 font-semibold">{product.name}</div>
                                                            <div className="text-sm text-gray-400">{product.brand} | {product.price}₹ | {product.category}</div>
                                                        </div>
                                                        <div className="text-gray-500 ml-auto"><BsArrowRight /></div>
                                                    </NavLink>
                                                ))
                                            }
                                            <NavLink to={`/searched_products/category/${searchQry}`} className="text-sm text-primary-400 my-2 underline underline-offset-2" onClick={searchInputBlurHandler}>Show more</NavLink>
                                        </div>
                                    </div>
                            }
                            {
                                searchedData["tags"].length!==0 &&
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="text-lg font-semibold text-gray-800">Products with Tag ( <span className="text-gray-500 bg-primary-200 font-normal px-1">{searchQry}</span> )</div>
                                        </div>
                                        <div className="flex flex-col">
                                            {
                                                searchedData["tags"].map((product, index) => (
                                                    product.tag.map((t, ind) => (
                                                        <NavLink to="####" key={t+ind+index} className="flex items-center gap-4 p-2 hover:bg-primary-100 rounded-md">
                                                            <div><BiSearch className="w-5 h-5 text-gray-600" /></div>
                                                            <div>
                                                                <div className="text-gray-700 font-semibold">{t}</div>
                                                                <div className="text-sm text-gray-400">{product.name} | {product.price}₹ | {product.description}</div>
                                                            </div>
                                                            <div className="text-gray-500 ml-auto"><BsArrowRight /></div>
                                                        </NavLink>
                                                    ))
                                                ))
                                            }
                                            <NavLink to={`####`} className="text-sm text-primary-400 my-2 underline underline-offset-2" onClick={searchInputBlurHandler}>Show more</NavLink>
                                        </div>
                                    </div>
                            }



                            <div className="text-lg font-semibold text-gray-800">Trending Searches</div>
                            <div className="flex flex-col">
                                {
                                    [0,1,2].map((_, index) => (
                                        <NavLink to="####" key={index} className="flex items-center gap-4 p-2 hover:bg-primary-100 rounded-md">
                                            <div><BiSearch className="w-5 h-5 text-gray-600" /></div>
                                            <div>
                                                <div className="text-gray-700 font-semibold">Whey Proteins</div>
                                                <div className="text-sm text-gray-400">In all Categories</div>
                                            </div>
                                            <div className="text-gray-500 ml-auto"><BsArrowRight /></div>
                                        </NavLink>
                                    ))
                                }
                                <NavLink to="####" className="text-sm text-primary-400 my-2 underline underline-offset-2">Show more</NavLink>

                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-lg font-semibold text-gray-800">Trending Products</div>
                                <NavLink to="####" className="text-sm text-primary-400 my-2 underline underline-offset-2">See All</NavLink>
                            </div>
                            <div className="border flex gap-3 overflow-x-scroll scrollbar-thin h-100"> //height ka koi asar nahi ho raha
                                {
                                    bestSellers.map((product, index) => (
                                        <div key={index} className="border w-30 rounded-md cursor-pointer hover:bg-primary-100 group">
                                            <div className="bg-gray-50 h-30">
                                                <img src={`${import.meta.env.VITE_SERVER_URL}/api/v1${product.images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${product.images[0]}`} className="w-50 h-full mx-auto group-hover:scale-110 transition-transform ease-in-out duration-300" />
                                            </div>
                                            <div className="border h-20 border-gray-100 border-t-transparent px-2 rounded-b-sm">
                                                <div className="text-xs font-semibold line-clamp-2 mt-2">{product.name}</div>
                                                <div className="flex gap-2 font-semibold text-sm mt-1">
                                                    <div className="text-gray-800">{product.price}</div>
                                                    <div className="text-gray-500 line-through">₹9699</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* login and cart */}
            <div className="flex items-center gap-0 sm:gap-4">
                <div className="hidden p-2 xs:flex items-center gap-1 text-gray-800 hover:bg-primary-300/50 rounded-md cursor-default font-semibold relative group">
                    {/*<BiUser />*/}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-9 bg-primary-200 font-semibold p-2 text-primary-800 rounded-full">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>

                    <span>
                        {isUserAuthenticated()?"Account":"Login"}
                    </span>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>


                    {/* account navigation dialog */}
                    <div className="border border-gray-200 hidden absolute right-0 top-full flex-col p-3 gap-3 sm:p-4 sm:gap-4 rounded-lg bg-white group-hover:flex">
                        {/* profile access*/}
                        <NavLink to={isUserAuthenticated()?"/my_profile":"/login"} className="border border-gray-200 flex gap-4 rounded-md hover:bg-primary-100">
                            <div className="p-3">
                                <div className="w-15 h-15 grid place-items-center rounded-full bg-primary-100/50 p-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className="size-full bg-primary-200 font-semibold p-3 text-primary-800 rounded-full">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-center w-70 p-3">
                                <div className="flex-1">
                                    <div className="text-gray-700 text-lg font-semibold">
                                        <span>Hello! {isUserAuthenticated()&&loggedInUserName()}</span>
                                    </div>

                                    {
                                        isUserAuthenticated() ?
                                            <div className="w-full max-w-58 ">
                                                <div className="text-gray-400 font-normal truncate">{userData?.email}</div>
                                                <div className="text-gray-400 font-normal">{userData?.mobile}</div>
                                            </div>
                                            :
                                            <div className="text-primary-500">Login or Signup</div>
                                    }
                                </div>
                                <div><BsArrowRight /></div>
                            </div>
                        </NavLink>

                        {/* orders, address, location access*/}
                        <div className="flex justify-between">
                            <NavLink to="/my_orders" className="border border-gray-200 rounded-md text-center px-3 py-1.5 hover:bg-primary-100">
                                <div className="w-min mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path d="M15 12h-5"/>
                                        <path d="M15 8h-5"/>
                                        <path d="M19 17V5a2 2 0 0 0-2-2H4"/>
                                        <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Your Orders</div>
                            </NavLink>
                            <NavLink to="####" className="border border-gray-200 rounded-md text-center px-3 py-1.5 hover:bg-primary-100">
                                <div className="w-min mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Address</div>
                            </NavLink>
                            <NavLink to="/about" className="border border-gray-200 rounded-md text-center px-3 py-1.5 hover:bg-primary-100">
                                <div className="w-min mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/>
                                        <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/>
                                        <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/>
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Store Location</div>
                            </NavLink>
                        </div>

                        {/* wallet, wishlist, settings... access*/}
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            {/* wallet */}
                            {/*<NavLink to="####" className="flex items-center gap-2 p-3 hover:bg-primary-100">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
                                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Wallet</div>
                            </NavLink>*/}
                            <NavLink to="/inventory" className="flex items-center gap-2 p-3 hover:bg-primary-100">
                                <div>
                                    <MdOutlineInventory2 className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1" />
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Inventory</div>
                            </NavLink>
                            <NavLink to="/cart" className="flex items-center gap-2 p-3 hover:bg-primary-100">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Cart</div>
                                <div className="text-primary-500/80 bg-primary-100/50 w-6 h-6 rounded-full text-center content-center text-sm">{calculateTotalCartItems()}</div>
                            </NavLink>
                            <NavLink to="/wishlist" className="flex items-center gap-2 p-3 hover:bg-primary-100">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Wishlist</div>
                                <div className="text-primary-500/80 bg-primary-100/50 w-6 h-6 rounded-full text-center content-center text-sm">{wishlistData.length}</div>
                            </NavLink>
                            <NavLink to="/authenticity" className="flex items-center gap-2 p-3 hover:bg-primary-100">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                                        <path d="m9 12 2 2 4-4"/>
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Authenticity</div>
                            </NavLink>
                            <NavLink to="####" className="flex items-center gap-2 p-3 hover:bg-primary-100">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
                                        <path d="M21 16v2a4 4 0 0 1-4 4h-5"/>
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Customer Service</div>
                            </NavLink>
                            <NavLink to="/my_profile" className="flex items-center gap-2 p-3 hover:bg-primary-100">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                        <path d="M11.5 15H7a4 4 0 0 0-4 4v2"/>
                                        <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
                                        <circle cx="10" cy="7" r="4"/>
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Your Profile</div></NavLink>
                            <NavLink to="/settings" className="flex items-center gap-2 p-3 hover:bg-primary-100">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </div>
                                <div className="text-gray-500 text-shadow-xs text-shadow-gray-100">Settings</div></NavLink>
                        </div>
                    </div>

                </div>
                <div className="border border-primary-800/50 hidden xs:block h-6"></div>
                <NavLink to="/cart" className="p-2 sm:p-3 flex items-center gap-1 text-gray-800 hover:bg-primary-300/50 rounded-md cursor-default font-semibold relative">
                    <div className="absolute -top-0.5 left-4 text-primary-800 bg-primary-200 h-5 w-5 grid place-items-center rounded-full text-xs">{calculateTotalCartItems()}</div>
                        
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>

                    <span>Cart</span>
                </NavLink>

            </div>

            <div className={`w-screen h-screen fixed top-0 left-0 bg-gray-800/80 ${isHamburgerSideBarOpen?"block":"hidden"}`}></div>

            {/* hamburger sidebar */}
            <div className={`h-screen flex fixed gap-0.5 sm:gap-2 top-0 ${isHamburgerSideBarOpen?"left-0":"-left-[150%]"} transition-all ease-in-out duration-300`}>
                {/* hamburger sidebar content */}
                <div className="flex flex-col bg-white">
                    {
                        isUserAuthenticated() ?
                            <div className="text-md sm:text-lg font-semibold p-4 flex justify-start gap-1 items-center hover:bg-primary-200">
                                <span>{loggedInUserName()}</span>
                            </div>
                            :
                            <NavLink to="/login" className="text-md sm:text-lg font-semibold p-4 flex justify-start gap-1 items-center hover:bg-primary-200">
                                <span>Login/Register</span> <BsArrowRight />
                            </NavLink>
                    }
                    <div className="grid grid-cols-3 text-sm sm:text-md">
                        <NavLink to="/my_profile" className="border border-gray-200 text-center px-1 py-2 sm:px-3 sm:py-3 hover:bg-primary-100">
                            <div className="w-min mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                            <div>My Account</div>
                        </NavLink>
                        <NavLink to="/my_orders" className="border border-gray-200 text-center px-1 py-2 sm:px-3 sm:py-3 hover:bg-primary-100">
                            <div className="w-min mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                    <path d="M15 12h-5"/>
                                    <path d="M15 8h-5"/>
                                    <path d="M19 17V5a2 2 0 0 0-2-2H4"/>
                                    <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>
                                </svg>
                            </div>
                            <div>Your Orders</div>
                        </NavLink>
                        <NavLink to="/cart" className="border border-gray-200 text-center px-1 py-2 sm:px-3 sm:py-3 hover:bg-primary-100">
                            <div className="w-min mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </div>
                            <div>Your Cart</div>
                        </NavLink>
                        <NavLink to="/authenticity" className="border border-gray-200 text-center px-1 py-2 sm:px-3 sm:py-3 hover:bg-primary-100">
                            <div className="w-min mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                                    <path d="m9 12 2 2 4-4"/>
                                </svg>
                            </div>
                            <div>Authenticity</div>
                        </NavLink>
                        <NavLink to="/####" className="border border-gray-200 text-center px-1 py-2 sm:px-3 sm:py-3 hover:bg-primary-100">
                            <div className="w-min mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
                                    <path d="m15 9-6 6"/>
                                    <path d="M9 9h.01"/>
                                    <path d="M15 15h.01"/>
                                </svg>
                            </div>
                            <div>Offers</div>
                        </NavLink>
                        <NavLink to="/support" className="border border-gray-200 text-center px-1 py-2 sm:px-3 sm:py-3 hover:bg-primary-100">
                            <div className="w-min mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 text-primary-500/80 bg-primary-100/50 rounded-md p-1">
                                    <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
                                    <path d="M21 16v2a4 4 0 0 1-4 4h-5"/>
                                </svg>
                            </div>
                            <div>Support</div>
                        </NavLink>
                    </div>
                    <div className="flex justify-around p-4 text-md sm:text-lg">
                        <button name="categories" className={`border-b-3 font-semibold ${selectedTab==="categories"?"border-primary-500 text-gray-800":"border-transparent text-gray-400"}`} onClick={categoryBrandTabHandler}>CATEGORIES</button>
                        <button name="brands" className={`border-b-3 font-semibold ${selectedTab==="brands"?"border-primary-500 text-gray-800":"border-transparent text-gray-400"}`} onClick={categoryBrandTabHandler}>BRANDS</button>
                    </div>
                    <div className="flex-1 overflow-x-hidden overflow-y-scroll text-sm sm:text-md">
                        {
                            productsBy[selectedTab].map((iter, ind) => (
                                <div key={ind} className="flex items-center gap-2 p-3 hover:bg-primary-100 cursor-pointer">
                                    <div>O</div><div className="text-gray-500 text-shadow-xs text-shadow-gray-100">{iter}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="border border-gray-200 w-full p-4 text-center text-primary-400 tracking-widest font-mono text-shadow-md text-shadow-primary-200/80">
                        BodyPrime Nutrition
                    </div>
                </div>
                {/* hamburger sidebar closer */}
                <div className="">
                    <button className="size-10 sm:size-15 rounded-full bg-white hover:bg-primary-300 text-primary-500 font-bold" onClick={hamburgerSideBarToggleHandler}>X</button>
                </div>
                
            </div>        
        </header>


        //<header
        //    className="fixed w-full top-0 left-0 header bg-primary-400 flex justify-between gap-10 items-center h-[9vh] px-3 transition-transform duration-300 ease-in-out"
        //    style={{
        //        transform:isHeaderVisible?"translateY(0%)":"translateY(-101%)"
        //    }}
        //>
        //    <section className="logo_section flex items-center gap-4">
        //        <NavLink to={"/home"}>
        //            <ImageWithFallback src="/logo.png" alt="/logo.png" fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_user.png`} className="w-[55px] h-[55px]" />
        //        </NavLink>
        //        <NavLink to={isUserAuthenticated()?"/my_profile":"/login"} className="text-xl font-semibold text-white">{isUserAuthenticated()?loggedInUserName():"Login"}</NavLink>
        //    </section>
        //    <section
        //        className="nav_section block"
        //    >
        //        <nav className="nav_nav flex w-[500px] justify-around text-white">
        //        <NavLink to="/home" className="nav_item">Home</NavLink>
        //        <NavLink to="/my_profile" className="nav_item">Profile</NavLink>
        //        {isUserAdmin() && <NavLink to="/inventory" className="nav_item">Inventory</NavLink>}
        //        <NavLink to="/wishlist" className="relative nav_item">
        //            <span>Wishlist</span>
        //            <span className="text-[10px] font-semibold w-[18px] h-[18px] grid place-items-center rounded-2xl absolute right-[-11px] top-[-11px] bg-white text-[#b11433]">{wishlistData.length}</span>
        //        </NavLink>
        //        <NavLink to="/my_orders" className="nav_item">My Orders</NavLink>
        //        {
        //            isUserAdmin() &&
        //                <NavLink to="/delivery" className="nav_item">Delivery</NavLink>
        //        }
        //        {
        //            !isUserAuthenticated() &&
        //            <>
        //                <NavLink to="/register" className="nav_item">Register</NavLink>
        //                <NavLink to="/login" className="nav_item">Login</NavLink>
        //            </>
        //        }
        //        <NavLink to="/cart" className="relative nav_item">
        //            <span>Cart</span>
        //            <span className="text-[10px] font-semibold w-[18px] h-[18px] grid place-items-center rounded-2xl absolute right-[-11px] top-[-11px] bg-white text-[#b11433]">{calculateTotalCartItems()}</span>
        //        </NavLink>
        //        </nav>
        //    </section>
        //    <section className="mobile_nav hidden items-center justify-end gap-8">
        //        <section className="relative w-[22px] h-[22px]">
        //            <BiSearch className="absolute text-3xl bottom-0 left-0" onClick={() => setIsSearchActive(true)} />
        //        </section>
        //        <section>
        //            <NavLink to="/cart" className="relative w-[45px] h-[30px]">
        //                <FiShoppingCart className="text-3xl" />
        //                <span className="text-[11px] font-semibold w-[20px] h-[20px] grid place-items-center rounded-2xl absolute right-[-8px] top-[-8px] bg-white text-[#b11433]">{calculateTotalCartItems()}</span>
        //            </NavLink>
        //        </section>
        //        <section className="ham_section w-[22px] h-[22px] relative">
        //            <div className="w-full h-full flex flex-col justify-between">
        //                <div className="border-b-[3px]"></div>
        //                <div className="border-b-[3px]"></div>
        //                <div className="border-b-[3px]"></div>
        //            </div>
        //            <input type="checkbox" name="" id=""
        //                className="absolute top-0 left-0 w-full h-full opacity-0"
        //                onClick={() => setIsHamActive(!isHamActive)}
        //            />
        //        </section>
        //    </section>
        //</header>
    )
};

export default Header;