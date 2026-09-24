import { useState, type ReactNode } from "react";


type DashboardTabTypes = "Dashboard"|"Analytics"|"Orders"|"Customer"|"Reviews"|"Logout";
const DASHBOARD_TABS:{heading:DashboardTabTypes; icon:ReactNode;}[] = [
    {heading:"Dashboard", icon:"O"},
    {heading:"Analytics", icon:"O"},
    {heading:"Orders", icon:"O"},
    {heading:"Customer", icon:"O"},
    {heading:"Reviews", icon:"O"},
    {heading:"Logout", icon:"O"}
];
const STATISTICS1 = [
    {heading:"Total Order", value:450, icon:"O"},
    {heading:"Total Customers", value:955, icon:"O"},
    {heading:"Total Revenue", value:50, icon:"O"},
    {heading:"Total Menu", value:250, icon:"O"},
    {heading:"Total Workers", value:30, icon:"O"},
];
const ORDER_SUMMARY = [
    {heading:"On Delivery", value:25, color:"var(--color-green-500)"},
    {heading:"Delivery", value:85, color:"var(--color-sky-500)"},
    {heading:"Cancelled", value:7, color:"var(--color-red-500)"}
];
const TOP_SELLING = [
    {img:"/vite.svg", name:"Product1", soldCount:150},
    {img:"/vite.svg", name:"Product2", soldCount:100},
    {img:"/vite.svg", name:"Product3", soldCount:80}
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


function Dashboard() {
    const [activeTab, setActiveTab] = useState<DashboardTabTypes>("Dashboard");

    
    return(
        <section className="border border-red-500">
            <div className="flex">
                {/* left part */}
                <div className="w-50 relative">
                    <div className="flex flex-col sticky top-20 left-0 w-full py-1">
                        {
                            DASHBOARD_TABS.map(({heading, icon}) => (
                                <div className={`
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
                <div className="flex-1 p-4">
                    {
                        activeTab === "Dashboard" &&
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-center sm:justify-between flex-wrap gap-4">
                                    {
                                        STATISTICS1.map(({heading, value, icon}, index) => (
                                            <div key={index} className="border border-gray-200 flex justify-between rounded-lg p-4 gap-4 min-w-54 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                                <div className="flex flex-col gap-4">
                                                    <div className="text-2xl text-gray-700 font-bold">{value}</div>
                                                    <div className="text-sm text-gray-500 font-semibold">{heading}</div>
                                                </div>
                                                <div className="w-15 h-15 rounded-full grid place-items-center"
                                                    style={{
                                                        background:"conic-gradient(at center, var(--color-primary-100) 0% 10%, var(--color-primary-500) 10% 100%)"
                                                    }}
                                                >
                                                    <div className="bg-white w-[88%] h-[88%] rounded-full text-center content-center">
                                                        {icon}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                    <div className="border border-gray-200 w-full max-w-xl flex flex-col gap-8 rounded-lg p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="flex justify-between text-gray-700 text-xl font-semibold">
                                            <div>Order Summary</div>
                                            <div>Today</div>
                                        </div>
                                        <div className="flex flex-wrap justify-around">
                                            {
                                                ORDER_SUMMARY.map(({heading, value, color}) => (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-30 h-30 grid place-items-center rounded-full"
                                                            style={{
                                                                background:`conic-gradient(at center, ${color.split("-500)")[0]+"-100)"} 0% 10%, ${color} 10% 100%)`
                                                            }}
                                                        >
                                                            <div className="text-2xl text-gray-700 font-bold bg-white w-[80%] h-[80%] rounded-full text-center content-center">{value}%</div>
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-semibold">{heading}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                    </div>

                                    <div className="border border-gray-200 w-full max-w-xs rounded-xl p-4 [box-shadow:0px_0px_4px_0.5px_var(--color-gray-300)]">
                                        <div className="flex justify-between text-gray-700 text-xl font-semibold">
                                            <div>Top Selling Items</div>
                                            <div>View All</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600">The top ordered products this week</div>
                                        </div>
                                        <div>
                                            {
                                                TOP_SELLING.map(({img, name, soldCount}) => (
                                                    <div className="flex items-center gap-2 p-2">
                                                        <div className="w-12 h-12 grid place-items-center rounded-full overflow-hidden"><img src={img} alt={img} /></div>
                                                        <div className="text-sm text-gray-600 flex-1 truncate">{name} asdkln nsjkdajsdla asldkajsd </div>
                                                        <div className="w-12 h-12 text-center content-center text-gray-700 font-semibold">{soldCount}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>
                    }

                    {
                        activeTab === "Orders" &&
                            <div>
                                <div className="">
                                    <div className="text-lg text-gray-700 font-semibold flex gap-10 py-2 px-4">
                                        <div className="w-40 ">Order ID</div>
                                        <div className="w-70 ">Customer Name</div>
                                        <div className="w-30 ">Payment</div>
                                        <div className="w-40 ">Location</div>
                                        <div className="w-20 ">Status</div>
                                        <div className="w-25 ">Contact</div>
                                    </div>

                                    {
                                        ORDER_DETAILS.map(({orderID, customerName, mop, location, status, contact}) => (
                                            <div className="border text-gray-600 flex gap-10 py-3 hover:bg-primary-50 border-transparent hover:border-primary-200 hover:text-primary-400 transition-all ease-in-out duration-100 px-4 rounded-md">
                                                <div className="w-40">{orderID}</div>
                                                <div className="w-70">{customerName}</div>
                                                <div className="w-30">{mop}</div>
                                                <div className="w-40">{location}</div>
                                                <div className="flex items-center gap-1 w-25">
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
                                                <div className="w-25">{contact}</div>
                                            </div>
                                        ))
                                    }


                                </div>
                            </div>
                    }
                </div>
            </div>
        </section>
    )
};

export default Dashboard;