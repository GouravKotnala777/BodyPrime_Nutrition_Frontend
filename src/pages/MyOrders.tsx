import { useEffect, useState } from "react";
import { myOrders } from "../apis/order.api";
import { type OrderTypesPopulates } from "../utils/types";
import ImageWithFallback from "../components/ImageWithFallback.component";
import Skeletan from "../components/Skeletan";


//const dummyOrders:OrderTypes[] = [
//    {
//        _id:"123456890",
//        userID:"4234567890",
//        products:[
//            {productID:"2234567890", name:"product1", price:1000, quantity:1}
//        ],
//        paymentInfo:{
//            method:"Stripe", transactionID:"3234567890", status:"paid"
//        },
//        priceSummary:{
//            itemsPrice:1000, shippingPrice:0, taxPrice:10, discount:0, totalPrice:1010
//        },
//        shippingInfo:{
//            address:"ho.no.371", city:"faridabad", state:"haryana", country:"india", phone:"8882732859", pincode:"121002"
//        },
//        orderStatus:"pending",
//        createdAt:new Date("01-01-24"),
//        updatedAt:new Date("02-01-24"),
//    },
//    {
//        _id:"123456891",
//        userID:"4234567890",
//        products:[
//            {productID:"2234567891", name:"product2", price:1100, quantity:1},
//            {productID:"2234567892", name:"product3", price:300, quantity:2}
//        ],
//        paymentInfo:{
//            method:"Stripe", transactionID:"3234567891", status:"paid"
//        },
//        priceSummary:{
//            itemsPrice:1700, shippingPrice:0, taxPrice:10, discount:0, totalPrice:1710
//        },
//        shippingInfo:{
//            address:"ho.no.371", city:"faridabad", state:"haryana", country:"india", phone:"8882732859", pincode:"121002"
//        },
//        orderStatus:"pending",
//        createdAt:new Date("07-02-25"),
//        updatedAt:new Date("10-02-25"),
//    },
//    {
//        _id:"123456892",
//        userID:"4234567890",
//        products:[
//            {productID:"2234567893", name:"product4", price:2100, quantity:1},
//            {productID:"2234567894", name:"product1", price:1000, quantity:3}
//        ],
//        paymentInfo:{
//            method:"COD", status:"pending"
//        },
//        priceSummary:{
//            itemsPrice:5100, shippingPrice:0, taxPrice:10, discount:0, totalPrice:5110
//        },
//        shippingInfo:{
//            address:"ho.no.371", city:"faridabad", state:"haryana", country:"india", phone:"8882732859", pincode:"121002"
//        },
//        orderStatus:"pending",
//        createdAt:new Date("15-04-25"),
//        updatedAt:new Date("18-04-25"),
//    },
//    {
//        _id:"123456896",
//        userID:"4234567890",
//        products:[
//            {productID:"2234567896", name:"product5", price:500, quantity:4}
//        ],
//        paymentInfo:{
//            method:"Stripe", transactionID:"3234567890", status:"refunded"
//        },
//        priceSummary:{
//            itemsPrice:2000, shippingPrice:0, taxPrice:10, discount:0, totalPrice:2010
//        },
//        shippingInfo:{
//            address:"ho.no.371", city:"faridabad", state:"haryana", country:"india", phone:"8882732859", pincode:"121002"
//        },
//        orderStatus:"cancelled",
//        createdAt:new Date("22-07-25"),
//        updatedAt:new Date("27-07-25"),
//    }
//];

let timer = 0;
function MyOrders() {
    const [orders, setOrders] = useState<OrderTypesPopulates[]>([]);
    const [skip, setSkip] = useState<number>(0);
    const [isReloading, setIsReloading] = useState<boolean>(false);
    const [isOrdersRefetching, setIsOrdersRefetching] = useState<boolean>(false);
    const [isOrdersFinished, setIsOrdersFinished] = useState<boolean>(false);


    async function myOrdersHandler({calledBy}:{calledBy:"reloading"|"refatchingBtn"}) {
        clearTimeout(timer);
        if (calledBy === "reloading") {
            setIsReloading(true);
        }
        else{
            setIsOrdersRefetching(true);
        }

        timer = setTimeout(async() => {
            const res = await myOrders({skip});
    
            if (res.success) {
                if (res.jsonData.length !== 0) {
                    setOrders(prev => [...prev, ...res.jsonData]);
                    setSkip(skip+1);
                }
                else{
                    setIsOrdersFinished(true);
                }
            }
            setIsReloading(false);
            setIsOrdersRefetching(false);
        }, 2000);
    };

    useEffect(() => {
        if (!skip && typeof skip !== "number") {
            console.log("skip nahi tha");
            return;
        }
        myOrdersHandler({calledBy:"reloading"});
    }, []);
    
    return(
        <section className="border border-gray-200 w-full max-w-3xl mx-auto rounded-xl mt-25 px-4">
            <div className="text-gray-400 text-lg font-semibold py-4">My Orders</div>

            {/* loading */}
            {
                isReloading ?
                    <div className="flex flex-col gap-4 h-[70vh] overflow-hidden">
                        {
                            [0,1,2].map((_, ind) => (
                                <div key={ind} className="flex gap-4">
                                    <div className="basis-1/2">
                                        <div className="w-max flex gap-2">
                                            {
                                                [0,1].map((_, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg flex flex-col justify-between gap-2 w-min h-58 p-2 text-center">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="w-30 h-30 mx-auto rounded-md overflow-hidden">
                                                                <Skeletan />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="font-semibold text-gray-700 w-30 h-4 rounded-sm overflow-hidden">
                                                                    <Skeletan />
                                                                </div>
                                                                <div className="font-semibold text-gray-700 w-30 h-4 rounded-sm overflow-hidden">
                                                                    <Skeletan />
                                                                </div>
                                                                <div className="font-semibold text-gray-700 w-30 h-4 rounded-sm overflow-hidden">
                                                                    <Skeletan />
                                                                </div>
                                                            </div>
                                                            <div className="h-6 rounded-sm overflow-hidden">
                                                                <Skeletan />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-3 basis-1/2 sm:basis-1/3">
                                        <div className="h-7 rounded-sm overflow-hidden">
                                            <Skeletan />
                                        </div>
                                        <div className="h-5 rounded-sm overflow-hidden">
                                            <Skeletan />
                                        </div>
                                        <div className="h-5 rounded-sm overflow-hidden">
                                            <Skeletan />
                                        </div>
                                        <div className="w-[80%] h-3 rounded-sm overflow-hidden">
                                            <Skeletan />
                                        </div>
                                        <div className="w-[60%] h-3 rounded-sm overflow-hidden">
                                            <Skeletan />
                                        </div>
                                        <div className="h-7 rounded-sm overflow-hidden">
                                            <Skeletan />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    :
                    <>
                        {
                            orders.map(({_id, orderStatus, paymentInfo, priceSummary, products, createdAt, deliveredAt}) => (
                                <div className="border-b border-dashed border-b-gray-200 my-4">
                                    <div className={` ${orderStatus === "cancelled"&&"bg-red-200"} flex items-center`}>
                                        <div className="relative w-[50%]">
                                            <div className="w-full overflow-x-scroll scrollbar-thin [box-shadow:0px_0px_5px_0.2px_var(--color-gray-500)_inset]">
                                                <div className={`w-max flex gap-2 ${orderStatus !== "cancelled"&&"fog-x"}`}>
                                                    {
                                                        products.map((p) => (
                                                            <div className="flex flex-col justify-between gap-2 w-min h-58 p-2 text-center">
                                                                <div>
                                                                    <div className="border border-gray-200 w-30 h-30 rounded-md overflow-hidden mx-auto">
                                                                        <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.productID.images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.productID.images[0]}`} fallbackSrc="/public/placeholders/no_product.jpg" />
                                                                    </div>
                                                                    <div className="font-semibold text-gray-700 w-30 line-clamp-3">{p.name} {p.quantity===2?"das sad asdsa asdasas adsasa asdas asdasd":""}</div>
                                                                </div>
                                                                <div><span className="text-gray-700">₹{p.price}</span> <span className="text-gray-500">x {p.quantity}</span></div>
                                                            </div>
                                                        ))
                                                    }
                                                    {
                                                        products.map((p) => (
                                                            <div className="flex flex-col justify-between gap-2 w-min h-58 p-2 text-center">
                                                                <div>
                                                                    <div className="border border-gray-200 w-30 h-30 rounded-md overflow-hidden mx-auto">
                                                                        <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.productID.images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.productID.images[0]}`} fallbackSrc="/public/placeholders/no_product.jpg" />
                                                                    </div>
                                                                    <div className="font-semibold text-gray-700 w-30 line-clamp-3">{p.name} {p.quantity===2?"das sad asdsa asdasas adsasa asdas asdasd":""}</div>
                                                                </div>
                                                                <div><span className="text-gray-700">₹{p.price}</span> <span className="text-gray-500">x {p.quantity}</span></div>
                                                            </div>
                                                        ))
                                                    }
                                                    {
                                                        products.map((p) => (
                                                            <div className="flex flex-col justify-between gap-2 w-min h-58 p-2 text-center">
                                                                <div>
                                                                    <div className="border border-gray-200 w-30 h-30 rounded-md overflow-hidden mx-auto">
                                                                        <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.productID.images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.productID.images[0]}`} fallbackSrc="/public/placeholders/no_product.jpg" />
                                                                    </div>
                                                                    <div className="font-semibold text-gray-700 w-30 line-clamp-3">{p.name} {p.quantity===2?"das sad asdsa asdasas adsasa asdas asdasd":""}</div>
                                                                </div>
                                                                <div><span className="text-gray-700">₹{p.price}</span> <span className="text-gray-500">x {p.quantity}</span></div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm sm:text-md flex flex-col gap-2 px-2">
                                            <span className="text-gray-700">{_id}</span>
                                            <div className={`
                                                w-min rounded-[4px]
                                                ${orderStatus === "cancelled"&&"bg-red-100 text-red-600"}
                                                ${orderStatus === "pending"&&"bg-green-100 text-green-600"}
                                                ${orderStatus === "processing"&&"bg-orange-100 text-orange-600"}
                                                ${orderStatus === "shipped"&&"bg-sky-100 text-sky-600"}
                                                ${orderStatus === "delivered"&&"bg-sky-100 text-sky-600"}
                                                font-semibold px-2 pt-0 pb-0.75
                                            `}>{orderStatus}</div>
                                            <span className="text-gray-600">{paymentInfo.transactionID}</span>
                                            <span className="text-gray-600">{paymentInfo.method}</span>
                                            <span className="text-gray-600">{paymentInfo.status}</span>
                                            <span className="text-gray-600">₹{priceSummary.totalPrice}</span>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-xs text-center mt-4 mb-2">
                                        <span>{deliveredAt?new Date(deliveredAt).toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"}):new Date(createdAt).toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})}</span>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="my-6">
                            <button disabled={(!isOrdersRefetching&&isOrdersFinished)} className={`border relative ${(!isOrdersRefetching&&!isOrdersFinished)?"border-primary-200 text-primary-400 bg-primary-50 hover:bg-primary-50/50":"border-primary-100 text-primary-200 bg-primary-50/50 cursor-no-drop"} rounded-md block mx-auto w-25 h-10`}
                                onClick={() => myOrdersHandler({calledBy:"refatchingBtn"})}
                            >
                                <div className={`${(isOrdersRefetching&&!isOrdersFinished)?"opacity-100 scale-100 blur-0":"opacity-0 scale-0 blur-sm"} h-full absolute top-0 -left-0.25 w-full transition-all ease-in-out duration-300`}>
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
                                <div className={`${(!isOrdersRefetching&&isOrdersFinished)?"opacity-100 scale-100 blur-0":"opacity-0 scale-0 blur-sm"} h-full absolute top-0 -left-0.25 w-full transition-all ease-in-out duration-300`}>
                                    <div className="w-full h-full flex justify-center items-center gap-1.25">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                                            <path d="m2 2 20 20"/>
                                            <path d="M8.35 2.69A10 10 0 0 1 21.3 15.65"/>
                                            <path d="M19.08 19.08A10 10 0 1 1 4.92 4.92"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className={`${(!isOrdersRefetching&&!isOrdersFinished)?"opacity-100 scale-100 blur-0":"opacity-0 scale-0 blur-sm"} font-semibold transition-all ease-in-out duration-300`}>More</div>
                            </button>
                        </div>
                    </>

            }
        </section>
    )
};

export default MyOrders;