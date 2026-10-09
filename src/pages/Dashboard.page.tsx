import { useEffect, useState, type ReactNode } from "react";
import AreaChart from "../components/charts/AreaChart.component";
import BarChart from "../components/charts/BarChart.component";
import type { CategoryTypes, DateRangeType, OrderSummaryDataType, ProductSummaryDataType, ProductTypes, UserSummaryDataType } from "../utils/types";
import { getUserSummaryData, getProductSummaryData, getOrderSummaryData, getBrandToCategoryStockData, getAllOutStockedProducts } from "../apis/dashboard.api";
import { capitalizeString } from "../utils/functions";
import { getProducts, restockProduct } from "../apis/product.api";
import DoughnutChart from "../components/charts/DoughnutChart.component";
import { BiUser } from "react-icons/bi";
import { FILTER_CATEGORIES_OBJECT } from "../utils/constants";
import {motion, AnimatePresence} from "motion/react";
import ImageWithFallback from "../components/ImageWithFallback.component";
import Spinner from "../components/Spinner.component";

type DashboardTabTypes = "Dashboard"|"Analytics"|"Orders"|"Customer"|"Reviews"|"Logout";
const DASHBOARD_TABS:{heading:DashboardTabTypes; icon:ReactNode;}[] = [
    {heading:"Dashboard", icon:"O"},
    {heading:"Analytics", icon:"O"},
    {heading:"Orders", icon:"O"},
    {heading:"Customer", icon:"O"},
    {heading:"Reviews", icon:"O"},
    {heading:"Logout", icon:"O"}
];
const ORDER_DETAILS = [
    {orderID:"#45231", customerName:"Gourav Kotnala", mop:"transfer", location:"bhoor colony", status:"Delivered", contact:8123092930},
    {orderID:"#23409", customerName:"Naruto Uzumaki", mop:"cash on delivery", location:"baselwa colony", status:"Pending", contact:8123092930},
    {orderID:"#44431", customerName:"Sasuke Uchiha", mop:"cash on delivery", location:"ahir wada", status:"Pending", contact:8123092930},
    {orderID:"#64395", customerName:"Sakura Haruno", mop:"cash on delivery", location:"baselwa colony", status:"Delivered", contact:8123092930},
    {orderID:"#59303", customerName:"Kakashi Hatake", mop:"transfer", location:"bhoor colony", status:"Cancelled", contact:8123092930},
    {orderID:"#83028", customerName:"Itachi Uchiha", mop:"transfer", location:"ahir wada", status:"Delivered", contact:8123092930},
    {orderID:"#45231", customerName:"Gourav Kotnala", mop:"transfer", location:"bhoor colony", status:"Delivered", contact:8123092930},
    {orderID:"#23409", customerName:"Naruto Uzumaki", mop:"cash on delivery", location:"baselwa colony", status:"Pending", contact:8123092930},
    {orderID:"#44431", customerName:"Sasuke Uchiha", mop:"cash on delivery", location:"ahir wada", status:"Pending", contact:8123092930},
    {orderID:"#64395", customerName:"Sakura Haruno", mop:"cash on delivery", location:"baselwa colony", status:"Delivered", contact:8123092930},
    {orderID:"#59303", customerName:"Kakashi Hatake", mop:"transfer", location:"bhoor colony", status:"Cancelled", contact:8123092930},
    {orderID:"#83028", customerName:"Itachi Uchiha", mop:"transfer", location:"ahir wada", status:"Delivered", contact:8123092930},
    {orderID:"#45231", customerName:"Gourav Kotnala", mop:"transfer", location:"bhoor colony", status:"Delivered", contact:8123092930},
    {orderID:"#23409", customerName:"Naruto Uzumaki", mop:"cash on delivery", location:"baselwa colony", status:"Pending", contact:8123092930},
    {orderID:"#44431", customerName:"Sasuke Uchiha", mop:"cash on delivery", location:"ahir wada", status:"Pending", contact:8123092930},
    {orderID:"#64395", customerName:"Sakura Haruno", mop:"cash on delivery", location:"baselwa colony", status:"Delivered", contact:8123092930},
    {orderID:"#59303", customerName:"Kakashi Hatake", mop:"transfer", location:"bhoor colony", status:"Cancelled", contact:8123092930},
    {orderID:"#83028", customerName:"Itachi Uchiha", mop:"transfer", location:"ahir wada", status:"Delivered", contact:8123092930},
    {orderID:"#45231", customerName:"Gourav Kotnala", mop:"transfer", location:"bhoor colony", status:"Delivered", contact:8123092930},
    {orderID:"#23409", customerName:"Naruto Uzumaki", mop:"cash on delivery", location:"baselwa colony", status:"Pending", contact:8123092930},
    {orderID:"#44431", customerName:"Sasuke Uchiha", mop:"cash on delivery", location:"ahir wada", status:"Pending", contact:8123092930},
    {orderID:"#64395", customerName:"Sakura Haruno", mop:"cash on delivery", location:"baselwa colony", status:"Delivered", contact:8123092930},
    {orderID:"#59303", customerName:"Kakashi Hatake", mop:"transfer", location:"bhoor colony", status:"Cancelled", contact:8123092930},
    {orderID:"#83028", customerName:"Itachi Uchiha", mop:"transfer", location:"ahir wada", status:"Delivered", contact:8123092930},
    {orderID:"#45231", customerName:"Gourav Kotnala", mop:"transfer", location:"bhoor colony", status:"Delivered", contact:8123092930},
    {orderID:"#23409", customerName:"Naruto Uzumaki", mop:"cash on delivery", location:"baselwa colony", status:"Pending", contact:8123092930},
    {orderID:"#44431", customerName:"Sasuke Uchiha", mop:"cash on delivery", location:"ahir wada", status:"Pending", contact:8123092930},
    {orderID:"#64395", customerName:"Sakura Haruno", mop:"cash on delivery", location:"baselwa colony", status:"Delivered", contact:8123092930},
    {orderID:"#59303", customerName:"Kakashi Hatake", mop:"transfer", location:"bhoor colony", status:"Cancelled", contact:8123092930},
    {orderID:"#83028", customerName:"Itachi Uchiha", mop:"transfer", location:"ahir wada", status:"Delivered", contact:8123092930},
    {orderID:"#45231", customerName:"Gourav Kotnala", mop:"transfer", location:"bhoor colony", status:"Delivered", contact:8123092930},
    {orderID:"#23409", customerName:"Naruto Uzumaki", mop:"cash on delivery", location:"baselwa colony", status:"Pending", contact:8123092930},
    {orderID:"#44431", customerName:"Sasuke Uchiha", mop:"cash on delivery", location:"ahir wada", status:"Pending", contact:8123092930},
    {orderID:"#64395", customerName:"Sakura Haruno", mop:"cash on delivery", location:"baselwa colony", status:"Delivered", contact:8123092930},
    {orderID:"#59303", customerName:"Kakashi Hatake", mop:"transfer", location:"bhoor colony", status:"Cancelled", contact:8123092930},
    {orderID:"#83028", customerName:"Itachi Uchiha", mop:"transfer", location:"ahir wada", status:"Delivered", contact:8123092930},
];

let timer = 0;
function Dashboard() {
    const [activeTab, setActiveTab] = useState<DashboardTabTypes>("Dashboard");
    const [range, setRange] = useState<DateRangeType>("today");
    const [selectedCategory, setSelectedCategory] = useState<CategoryTypes>("protein");
    const [customDate, setCustomDate] = useState<{startDateParam:string; endDateParam:string;}>({startDateParam:"", endDateParam:""});
    const [orderSummaryData, setOrderSummaryData] = useState<OrderSummaryDataType>({data:[{_id:"pending", count:0}, {_id:"processing", count:0}, {_id:"shipped", count:0}, {_id:"delivered", count:0}, {_id:"cancelled", count:0}], totalOrders:0});
    const [bestSellers, setBestSellers] = useState<ProductTypes[]>([]);
    const [userSummaryData, setUserSummaryData] = useState<UserSummaryDataType>({data:[{_id:false, count:0}], totalUsers:0});
    const [productSummaryData, setProductSummaryData] = useState<ProductSummaryDataType>({data:{protein:0, weight:0, "pre-workout":0, "fatty acids":0, "health food":0, ayurvedic:0, minerals:0, vitamins:0, wellness:0}, totalProducts:0});
    const [categoryBrandStockData, setCategoryBrandStockData] = useState<{ brand: string; stock: number; }[]>([]);
    const [allOutStockedProductsData, setAllOutStockedProductsData] = useState<string[]>([]);
    const [isRestocking, setIsRestocking] = useState<string>("");


    async function getOrderSummaryDataHandler() {
        if (range === "today" || range === "week" || range === "month") {
            const res = await getOrderSummaryData({range});
            // res.json is array because aggregate wraps result in square brackets so we are taking 0th value which is an object
            setOrderSummaryData(res.jsonData[0]);
        }
        else if (range === "custom" && customDate.startDateParam && customDate.endDateParam) {
            const res = await getOrderSummaryData({range, startDateParam:customDate.startDateParam, endDateParam:customDate.endDateParam});
            // res.json is array because aggregate wraps result in square brackets
            setOrderSummaryData(res.jsonData[0]);
        }
    };
    async function getBestSellersHandler() {
        try {
            const res = await getProducts(0, "soldCount", "", "", "");
            if (res.success) {
                setBestSellers(res.jsonData);
            }
        } catch (error) {
            console.log(error);
            throw Error(error as string);
        }
    };
    async function getUserSummaryDataHandler() {
        try {
            const res = await getUserSummaryData();
            console.log(res.jsonData);
            


            if (res.success) {
                //setFirstSectionSummary(res.jsonData);
                setUserSummaryData(res.jsonData[0])

            }
        } catch (error) {
            console.log(error);
            throw Error(error as string);
        }
    };
    async function getProductSummaryDataHandler() {
        try {
            const res = await getProductSummaryData();
            console.log(res.jsonData);
            


            if (res.success) {
                //setFirstSectionSummary(res.jsonData);
                setProductSummaryData(res.jsonData[0])

            }
        } catch (error) {
            console.log(error);
            throw Error(error as string);
        }
    };
    async function getBrandToCategoryStockDataHandler() {
        try {
            const res = await getBrandToCategoryStockData({category:selectedCategory});
            console.log(res.jsonData);
            


            if (res.success) {
                setCategoryBrandStockData(res.jsonData);
            }
        } catch (error) {
            console.log(error);
            throw Error(error as string);
        }
    };
    async function getAllOutStockedProductsHandler() {
        try {
            const res = await getAllOutStockedProducts();
            if (res.success) {
                setAllOutStockedProductsData(res.jsonData.map((p) => p.outOfStocked).flat());
            }
        } catch (error) {
            console.log(error);
            throw Error(error as string);
        }
    };
    async function restockProductHandler(outOfStockedVariant:string, restockValue:number) {
        // outOfStockedVariant contains 'productID#brand#category#sub-category#flavor#weight'

        clearTimeout(timer);
        setIsRestocking(outOfStockedVariant);
        const productID = outOfStockedVariant.split("#")[0];
        const flavor = outOfStockedVariant.split("#")[4];
        const weight = outOfStockedVariant.split("#")[5];
        try {
            timer = setTimeout(async() => {
                const res = await restockProduct({productID, flavor, weight, restockValue});
                if (res.success) {
                    console.log(res);
                }
                setAllOutStockedProductsData(allOutStockedProductsData.filter(i => i !== outOfStockedVariant));
                setIsRestocking("");
            }, 2000);
        } catch (error) {
            setIsRestocking("");
            console.log(error);
            throw Error(error as string);
        }
    };


    useEffect(() => {
        getBrandToCategoryStockDataHandler();
    }, [selectedCategory]);
    useEffect(() => {
        getAllOutStockedProductsHandler();
        getUserSummaryDataHandler();
        getProductSummaryDataHandler();
        getBestSellersHandler();
    }, []);
    useEffect(() => {
        getOrderSummaryDataHandler();
    }, [range, customDate]);
    
    return(
        <section className="">
            <div className="flex">
                {/* left part */}
                <div className="hidden sm:block w-50 relative">
                    <div className="flex flex-col sticky top-20 left-0 w-full py-1">
                        {
                            DASHBOARD_TABS.map(({heading, icon}, index) => (
                                <div key={index} className={`
                                    border-l-4 text-gray-600 font-semibold flex gap-4 py-4 px-8 cursor-pointer rounded-r-md transition-all ease-in-out duration-100
                                    ${activeTab === heading ? "bg-primary-200 border-primary-500":"bg-white border-transparent hover:bg-primary-100/80"}
                                `}
                                onClick={() => setActiveTab(heading)}    
                            >
                                    <span>{icon}</span>
                                    <span>{heading}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* right part */}
                <div className="flex-1 p-4 mb-25 max-w-screen overflow-x-scroll">
                    {
                        activeTab === "Dashboard" &&
                            <div className="flex flex-col gap-4">
                                {/* first part */}
                                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                    <div className="border border-gray-200 w-full max-w-60 rounded-lg p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="text-gray-600 text-lg font-semibold pb-4 flex gap-1">
                                            <div className="text-shadow-sm">Total Users</div> <div className="text-gray-500 text-sm w-5.5 h-5.5 rounded-full  flex gap-0.25"><span className="text-gray-400">(</span><span className="text-gray-500">{userSummaryData.totalUsers}</span><span className="text-gray-400">)</span></div>
                                        </div>
                                        <div className="h-35 w-35 mx-auto relative">
                                            <DoughnutChart
                                                labels={["Verified Users", "Non Verified Users"]}
                                                datasets={[
                                                    {
                                                        data: [12, 19],
                                                        backgroundColor: [
                                                            "oklch(80.8% 0.114 19.571)",
                                                            "oklch(97.1% 0.013 17.38)"
                                                        ],
                                                        borderColor: [
                                                            "oklch(70.4% 0.191 22.216)",
                                                            "oklch(88.5% 0.062 18.334)"
                                                        ],
                                                        borderWidth: 1,
                                                    },
                                                ]}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            display:false
                                                        },
                                                        title: {
                                                            display: false,
                                                            //font:{size:5, weight:"lighter", style:"italic"}
                                                        }
                                                    },
                                                    scales:{
                                                        x:{ticks:{display:false}, border:{display:false}, grid:{display:false}},
                                                        y:{ticks:{display:false}, border:{display:false}, grid:{display:false}},
                                                    }
                                                }}
                                            />
                                            <BiUser className="text-gray-600 size-8 absolute top-[47%] left-[53%] -translate-[50%]" />
                                        </div>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="text-gray-600 text-lg font-semibold pb-4 flex gap-1">
                                            <div className="text-shadow-sm">Total Products</div> <div className="text-gray-500 text-sm w-5.5 h-5.5 rounded-full  flex gap-0.25"><span className="text-gray-400">(</span><span className="text-gray-500">{productSummaryData.totalProducts}</span><span className="text-gray-400">)</span></div>
                                        </div>
                                        <BarChart
                                            labels={Object.keys(productSummaryData.data)}
                                            datasets={[
                                                {
                                                    data:Object.values(productSummaryData.data),
                                                    backgroundColor:"oklch(70.4% 0.191 22.216)"
                                                }
                                            ]}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend:{
                                                        display:false
                                                    },
                                                    title: {
                                                        display: false
                                                    }
                                                },
                                                scales:{
                                                    x:{grid:{display:false}},
                                                    y:{grid:{display:false}},
                                                }
                                            }}
                                        />
                                    </div>
                                </div>


                                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                    <div className="border border-gray-200 rounded-lg p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="text-gray-600 text-lg font-semibold pb-4 flex justify-between">
                                            <div className="text-gray-600 text-lg font-semibold pb-4 flex gap-1">
                                                <div className="text-shadow-sm">Total {capitalizeString(selectedCategory)} Stocks</div>
                                                <div className="text-gray-500 text-sm w-5.5 h-5.5 rounded-full  flex gap-0.25">
                                                    <span className="text-gray-400">(</span><span className="text-gray-500">{categoryBrandStockData.reduce((acc, iter) => acc+=iter.stock, 0)}</span><span className="text-gray-400">)</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col relative">
                                                <select
                                                    className="border border-gray-200 h-full text-sm pt-0.5 pb-1.5 px-1 rounded-md"
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value as CategoryTypes)}
                                                >
                                                    {
                                                        FILTER_CATEGORIES_OBJECT.map(i => i.queryName).map((iter, index) => (
                                                            <option key={index} value={iter}>{capitalizeString(iter)}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <BarChart
                                            labels={categoryBrandStockData.map(i => i.brand)}
                                            datasets={[
                                                {
                                                    data:categoryBrandStockData.map(i => i.stock),
                                                    backgroundColor:"oklch(70.4% 0.191 22.216)"
                                                }
                                            ]}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend:{
                                                        display:false
                                                    },
                                                    title: {
                                                        display: false
                                                    }
                                                },
                                                scales:{
                                                    x:{grid:{display:false}},
                                                    y:{grid:{display:false}},
                                                }
                                            }}
                                        />
                                    </div>


                                    {/*<pre>{JSON.stringify(allOutStockedProductsData, null, `\t`)}</pre>*/}

                                    {/* out of stock products */}
                                    <div className="border border-gray-200 w-full max-w-md rounded-xl p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">

                                        <div className="text-gray-600 text-lg font-semibold flex justify-between">
                                            <div className="text-gray-600 text-lg font-semibold pb-4 flex gap-1">
                                                <div className="text-shadow-sm">Out of Stock Products</div>
                                                <div className="text-gray-500 text-sm w-5.5 h-5.5 rounded-full flex gap-0.25">
                                                    <span className="text-gray-400">(</span><span className="text-gray-500">{allOutStockedProductsData.length}</span><span className="text-gray-400">)</span>
                                                </div>
                                            </div>
                                            <div className="">
                                                View All
                                            </div>
                                        </div>

                                        {
                                            allOutStockedProductsData.length === 0 ?
                                                <div className="border text-center">
                                                    <div className="text-xl text-gray-700 font-semibold">All Is Well</div>
                                                    <div className="text-gray-500">skdla salkdj lkasdj kas ld jlaskdj lksadjlk jlsd kj</div>
                                                </div>
                                                :
                                                <>
                                                    <div>
                                                        <div className="text-gray-600">Restock a product by 3 stocks</div>
                                                    </div>
                                                    <div className="relative fog-y">
                                                        <div className="h-50 overflow-x-hidden overflow-y-scroll scrollbar-thin pr-1">
                                                            <AnimatePresence>
                                                                {
                                                                    allOutStockedProductsData.map((outStocked) => (
                                                                        <motion.div key={outStocked} className="flex items-center gap-2 p-2"
                                                                            layout
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{
                                                                                opacity: 0,
                                                                                x: -20,
                                                                            }}
                                                                            transition={{
                                                                                layout: { duration: 0.3 },
                                                                                opacity: { duration: 0.2 }
                                                                            }}
                                                                        >
                                                                            <div className="w-12 h-12 grid place-items-center rounded-full overflow-hidden"><img src={"/placeholders/no_product.jpg"} alt={"/placeholders/no_product.jpg"} /></div>
                                                                            {/*<div className="text-md text-gray-600 flex-1 truncate">{outStocked.split("#")[0]} {outStocked.split("#")[1]} {outStocked.split("#")[3]} {outStocked.split("#")[4]}</div>*/}
                                                                            <div className="text-sm text-gray-600 flex-1 truncate">{outStocked.split("#")[1]} {outStocked.split("#")[2]} {outStocked.split("#")[4]} {outStocked.split("#")[5]}</div>
                                                                            <div className="text-center content-center">
                                                                                <button disabled={isRestocking!==""} className="border border-secondary-200 bg-secondary-50 tracking-wider text-secondary-600 text-xs w-14 px-1.5 pt-0.75 pb-1 rounded-md cursor-pointer hover:bg-white"
                                                                                    onClick={()=>restockProductHandler(outStocked, 3)}
                                                                                >
                                                                                    {isRestocking===outStocked ? <div className="w-min h-4 mx-auto"><Spinner width="14px" thickness="1.5px" /></div>:"Restock"}
                                                                                </button>
                                                                            </div>
                                                                        </motion.div>
                                                                    ))
                                                                }
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                </>
                                        }
                                        
                                    </div>
                                </div>







                                <div className="flex justify-center sm:justify-between flex-wrap gap-4">
                                    {
                                        userSummaryData.data.map(({_id, count}, index) => (
                                            <div key={index} className="border border-gray-200 flex justify-between rounded-lg p-4 gap-4 min-w-54 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                                <div className="flex flex-col gap-4">
                                                    <div className="text-2xl text-gray-700 font-bold">{count}</div>
                                                    <div className="text-sm text-gray-500 font-semibold">{_id?"Verified":"Not Verified"}</div>
                                                </div>
                                                <div className="w-15 h-15 rounded-full grid place-items-center"
                                                    style={{
                                                        background:"conic-gradient(at center, var(--color-primary-400) 0% 85%, var(--color-primary-100) 85% 100%)"
                                                    }}
                                                >
                                                    <div className="bg-white w-[88%] h-[88%] rounded-full text-center content-center">
                                                        O
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        //productSummaryData.data.map(({_id, count}, index) => (
                                        //    <div key={index} className="border border-gray-200 flex justify-between rounded-lg p-4 gap-4 min-w-54 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        //        <div className="flex flex-col gap-4">
                                        //            <div className="text-2xl text-gray-700 font-bold">{count}</div>
                                        //            <div className="text-sm text-gray-500 font-semibold">{_id}</div>
                                        //        </div>
                                        //        <div className="w-15 h-15 rounded-full grid place-items-center"
                                        //            style={{
                                        //                background:"conic-gradient(at center, var(--color-primary-400) 0% 85%, var(--color-primary-100) 85% 100%)"
                                        //            }}
                                        //        >
                                        //            <div className="bg-white w-[88%] h-[88%] rounded-full text-center content-center">
                                        //                O
                                        //            </div>
                                        //        </div>
                                        //    </div>
                                        //))
                                    }
                                </div>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                    <div className="border border-gray-200 w-full max-w-xl flex flex-col gap-8 rounded-lg p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="flex justify-between text-gray-600 text-lg font-semibold pb-4 text-shadow-sm">
                                            <div>Order Summary</div>
                                            <div className="flex flex-col relative">
                                                <select
                                                    className="border border-gray-200 h-full text-sm pt-0.5 pb-1.5 px-1 rounded-md"
                                                    value={range}
                                                    onChange={(e) => setRange(e.target.value as DateRangeType)}
                                                >
                                                    <option value="today">Today</option>
                                                    <option value="week">This Week</option>
                                                    <option value="month">This Month</option>
                                                    <option value="custom">Custom Range</option>
                                                </select>
                                                <div
                                                    className={`text-gray-600 text-lg
                                                        [text-shadow:0px_0px_2px_var(--color-gray-300)]
                                                        tracking-wide text-left  origin-top grid rounded-sm px-1
                                                        ${range==="custom"?"border border-gray-200 grid-rows-[1fr]":"grid-rows-[0fr]"}
                                                        transition-[grid-template-rows] ease-in-out duration-400 absolute top-full right-0
                                                    `}
                                                >
                                                    <div className="flex gap-1 w-max text-xs overflow-hidden">
                                                        <input type="date" className="w-25 h-full" onChange={(e) => setCustomDate((prev) => ({...prev, startDateParam:e.target.value}))} />
                                                        <div className="w-0.5 bg-gray-300 rounded-full"></div>
                                                        <input type="date" className="w-25 h-full" onChange={(e) => setCustomDate((prev) => ({...prev, endDateParam:e.target.value}))} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap justify-around">
                                            {
                                                orderSummaryData?.data?.map(({_id, count}, index) => (
                                                    <div key={index} className="flex flex-col items-center gap-4">
                                                        <div className="w-30 h-30 grid place-items-center rounded-full"
                                                            style={{
                                                                background:`conic-gradient(at center, var(--color-primary-400) 0% ${Math.round((count/orderSummaryData.totalOrders)*100)}%, var(--color-primary-100) ${Math.round((count/orderSummaryData.totalOrders)*100)}% 100%)`
                                                            }}
                                                        >
                                                            <div className="text-2xl text-gray-700 font-bold bg-white w-[80%] h-[80%] rounded-full text-center content-center">{((count/orderSummaryData.totalOrders)*100).toFixed(1)}%</div>
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-semibold">{capitalizeString(_id)}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                    </div>

                                    {/* top selling products */}
                                    <div className="border border-gray-200 w-full max-w-md rounded-xl p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="flex justify-between text-gray-600 text-lg font-semibold pb-4 text-shadow-sm">
                                            <div>Top Selling Items</div>
                                            <div>View All</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600">The top ordered products this week</div>
                                        </div>
                                        <div>
                                            {
                                                bestSellers.map(({name, brand, category, subCategory, flavor, weight, images, soldCount}, index) => (
                                                    <div key={index} className="flex items-center gap-2 p-2">
                                                        <div className="w-12 h-12 grid place-items-center rounded-full overflow-hidden">
                                                            <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${images[0]}`} fallbackSrc="/placeholders/no_product.jpg" />
                                                        </div>
                                                        <div className="text-sm text-gray-600 flex-1 truncate">{name} {brand} {category} {subCategory} {flavor} {weight}</div>
                                                        <div className="w-12 h-12 text-center content-center text-gray-700 font-semibold">{soldCount}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                    <div className="border border-gray-200 rounded-lg p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="text-gray-600 text-lg font-semibold pb-4 text-shadow-sm">Total Revenue</div>
                                        <AreaChart
                                            labels={["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]}
                                            data={[10, 10, 20, 5, 10, 5, 5, 4, 11, 15, 19, 25]}
                                            borderColor="#fb2c36"
                                            backgroundColor="#ffe2e2"
                                            borderWidth={0.5}
                                            tension={0.5}
                                            fill={true}
                                        />
                                    </div>
                                    <div className="border border-gray-200  rounded-lg p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="text-gray-600 text-lg font-semibold pb-4 text-shadow-sm">Customer Map</div>
                                        <BarChart
                                            labels={["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]}
                                            datasets={[
                                                {
                                                    label:"Last Month",
                                                    data:[10, 10, 20, 5, 10, 5, 5, 4, 11, 15, 19, 25],
                                                    backgroundColor:"oklch(88.5% 0.062 18.334)"
                                                },
                                                {
                                                    label:"This Month",
                                                    data:[15, 10, 10, 5, 10, 10, 20, 10, 14, 15, 19, 15],
                                                    backgroundColor:"oklch(70.4% 0.191 22.216)"
                                                },
                                            ]}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'top' as const,
                                                    },
                                                    title: {
                                                        display: false
                                                    }
                                                },
                                                scales:{
                                                    x:{grid:{display:false}},
                                                    y:{grid:{display:false}},
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>
                    }

                    {
                        activeTab === "Orders" &&
                            <div className="">
                                <div className="w-250">
                                    <div className="text-lg text-gray-700 font-semibold grid grid-cols-6 py-2 px-4">
                                        <div className="">Order ID</div>
                                        <div className="">Customer Name</div>
                                        <div className="">Payment</div>
                                        <div className="">Location</div>
                                        <div className="">Status</div>
                                        <div className="">Contact</div>
                                    </div>

                                    {
                                        ORDER_DETAILS.map(({orderID, customerName, mop, location, status, contact}) => (
                                            <div className="border text-gray-600 grid grid-cols-6 py-3 hover:bg-primary-50 border-transparent hover:border-primary-200 hover:text-primary-400 transition-all ease-in-out duration-100 px-4 rounded-md">
                                                <div className="">{orderID}</div>
                                                <div className="">{customerName}</div>
                                                <div className="">{mop}</div>
                                                <div className="">{location}</div>
                                                <div className="flex items-center gap-1">
                                                    <div className={`size-1.5 rounded-full
                                                        ${status === "Pending" && "bg-green-500"}
                                                        ${status === "Delivered" && "bg-sky-500"}
                                                        ${status === "Cancelled" && "bg-red-500"}
                                                    `}></div>
                                                    <div className={`
                                                        ${status === "Pending" && "text-green-500"}
                                                        ${status === "Delivered" && "text-sky-500"}
                                                        ${status === "Cancelled" && "text-red-500"}
                                                    `}>{status}</div>
                                                </div>
                                                <div className="">{contact}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                    }

                    {
                        activeTab === "Analytics" &&
                        <div className="border text-primary-200">
                        </div>
                    }
                </div>
            </div>

            {/* dashboard navigation tabs for small devices only */}
            <div className="block sm:hidden fixed left-0 bottom-0 w-screen h-20 z-2 [box-shadow:0px_0px_10px_2px_var(--color-gray-300)]">
                <div className="bg-white flex justify-between w-full h-full">
                    {
                        DASHBOARD_TABS.map(({heading, icon}, index) => (
                            // don't add logout tab for small devices
                            heading !== "Logout"&&
                            <button key={index} className={`
                                border-b-4 text-gray-600 font-semibold flex flex-col gap-1 p-2 cursor-pointer rounded-t-lg transition-all ease-in-out duration-100
                                ${activeTab === heading ? "bg-primary-200 border-primary-500":"bg-white border-transparent hover:bg-primary-100/80"}
                            `}
                            onClick={() => setActiveTab(heading)}    
                        >
                                <span>{icon}</span>
                                <span className="text-sm">{heading}</span>
                            </button>
                        ))
                    }
                </div>
            </div>
        </section>
    )
};

export default Dashboard;