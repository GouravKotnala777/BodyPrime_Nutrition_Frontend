import { useEffect, useState } from "react";
import HandlePageUIWithState from "../components/HandlePageUIWithState";
import { type OrderStatusTypes, type OrderTypes } from "../utils/types";
import { allOrders, sendDeliveryConfirmation, verifyDeliveryConfirmation } from "../apis/order.api";
import { AiOutlineProduct } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { BiCalendarEvent, BiPhone } from "react-icons/bi";


function Delivery() {
    const [allOrdersData, setAllOrdersData] = useState<{pending:OrderTypes[], processing:OrderTypes[], shipped:OrderTypes[], delivered:OrderTypes[], cancelled:OrderTypes[]}>({pending:[], processing:[], shipped:[], delivered:[], cancelled:[]});
    const [dataStatus, setDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    //const [refetchDataStatus, setRefetchDataStatus] = useState<{isLoading:boolean, isSuccess:boolean, error:string}>({isLoading:true, isSuccess:false, error:""});
    const [tab, setTab] = useState<OrderStatusTypes>("pending");
    const [otp, setOtp] = useState<string>("");
    const [a, setA] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<string>("");
    
    async function getProductsBeingDelivered() {
        //setDataStatus({isLoading:true, isSuccess:false, error:""});
        //setRefetchDataStatus({isLoading:true, isSuccess:false, error:""});
        const res = await allOrders();
        
        
        console.log({res1:res});
        setDataStatus({isLoading:false, isSuccess:true, error:""});
        
        if (res.success) {
            setAllOrdersData(res.jsonData);
        }
        else{
            //setDataStatus({isLoading:false, isSuccess:true, error:res.message});
            //setRefetchDataStatus({isLoading:false, isSuccess:true, error:""});
        }
    };

    async function sendDeliveryConfirmationHandler({orderID}:{orderID:string;}) {
        try {
            const res = await sendDeliveryConfirmation({orderID});

            console.log(res);
        } catch (error) {
            console.log(error);
            throw Error(error as string);
        }
    };
    
    async function verifyDeliveryConfirmationHandler({orderID, otp}:{orderID:string; otp:string;}) {
        try {
            const res = await verifyDeliveryConfirmation({orderID, otp});

            console.log(res);            
        } catch (error) {
            console.log(error);
            throw Error(error as string);
        }
    };

    useEffect(() => {
        getProductsBeingDelivered();
    }, []);

    return(
        <HandlePageUIWithState isLoading={dataStatus.isLoading} isSuccess={dataStatus.isSuccess} error={dataStatus.error} errorChildren={
                <>
                    <img src="/empty_cart2.png" alt="/empty_cart2.png" />
                    <h1 className="text-2xl text-center font-bold text-[#f44769] py-1">No Product!</h1>
                    <p className="text-[1.1rem] text-center text-gray-400 font-semibold py-1/2">It looks like there is no product yet.</p>
                    <div className="text-center">
                        <button className="bg-[#f44769] text-white text-[1.2rem] py-2 px-3 font-medium rounded-[8px] my-7" onClick={() =>{console.log("qwertyu");
                        }}>Add New Products</button>
                    </div>
                </>
            }>


                {
                    tab === "pending" &&
                    (
                        <section className="overflow-scroll">
                            {allOrdersData.pending.map((o) => (    
                                <div className="border-b-1 border-gray-300 flex items-center">
                                    <div className="flex px-4 py-2 mt-10 overflow-hidden transition-all ease-out duration-300"
                                        style={{...((a&&selectedOrder===o._id)&&{
                                            width:"0px",
                                            paddingLeft:"0px",
                                            paddingRight:"0px",
                                            transform:"scaleX(0)",
                                            transformOrigin:"left"
                                        })}}
                                    >
                                        <div>
                                            <div className="text-gray-600 font-semibold my-2 flex flex-nowrap whitespace-nowrap items-center gap-3">
                                                <span>Order ID : </span>
                                                <p>{o._id}</p>
                                            </div>
                                            {
                                                o.products.map((p, i) => (
                                                    <div className="flex gap-1 flex-nowrap whitespace-nowrap">
                                                        <span>{i+1}. &nbsp; </span><span className="text-gray-600 font-semibold">{p.productID.slice(14)}</span> || <span className="text-gray-600">{p.name}</span> || <span className="text-gray-600">{p.price}₹</span> x <span className="text-gray-600">{p.quantity}</span>
                                                    </div>
                                                ))
                                            }
                                            <div className="my-2 flex items-center gap-3">
                                                <span></span>
                                                <p className="border-t-1 border-gray-200 w-full mr-5"></p>
                                            </div>
                                            <div className="my-2 flex items-center gap-3">
                                                <span><CiLocationOn /></span>
                                                <p>{o.shippingInfo.address}, {o.shippingInfo.city}, {o.shippingInfo.state}, {o.shippingInfo.pincode}, {o.shippingInfo.country}</p>
                                            </div>
                                            <div className="my-2 flex items-center gap-3">
                                                <span></span>
                                                <p className="border-t-1 border-gray-200 w-full mr-5"></p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span><BiPhone /></span>
                                                <p>{o.shippingInfo.phone}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="bg-linear-to-br from-[#f44669] to-[#f46f46] text-white px-2 rounded-[4px] active:opacity-60"
                                            onClick={() => {
                                                sendDeliveryConfirmationHandler({orderID:o._id});
                                                setA(true);
                                                setSelectedOrder(o._id);
                                            }}
                                        >
                                            Send OTP
                                        </button>
                                    </div>


                                    <div className="flex justify-between w-full px-4 py-4 mt-10 overflow-hidden transition-all ease-out duration-300"
                                        style={{...(!(a&&selectedOrder===o._id)&&{
                                            width:"0px",
                                            paddingLeft:"0px",
                                            paddingRight:"0px",
                                            transform:"scaleX(0)",
                                            transformOrigin:"right"
                                        })}}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <h1 className="text-xl font-semibold">Verify Confirmation</h1>
                                            <p>to confirm delivery of Order ID</p>
                                            <p>{o._id}</p>
                                            <input type="text" placeholder="Verification OTP"
                                                maxLength={6}
                                                className="border-1 border-gray-400 p-2 rounded-[4px] tracking-[2px]"
                                                onChange={(e) => setOtp(e.target.value)}
                                            />

                                        </div>
                                        <button
                                            className="bg-linear-to-br from-[#f44669] to-[#f46f46] text-white px-2 rounded-[4px] active:opacity-60"
                                            onClick={() => {
                                                verifyDeliveryConfirmationHandler({orderID:o._id, otp});
                                                setA(false);
                                                console.log(otp);
                                            }}
                                        >
                                            Verify OTP
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </section>
                    )
                }
                {
                    tab === "processing" &&
                    (
                        <section>Processing</section>
                    )
                }
                {
                    tab === "shipped" &&
                    (
                        <section>Shipped</section>
                    )
                }
                {
                    tab === "delivered" &&
                    (
                        <section className="overflow-scroll">
                            {allOrdersData.delivered.map((o) => (    
                                <div className="border-b-1 border-gray-300 flex items-center">
                                    <div className="flex px-4 py-2 mt-10 overflow-hidden transition-all ease-out duration-300"
                                        style={{...((a&&selectedOrder===o._id)&&{
                                            width:"0px",
                                            paddingLeft:"0px",
                                            paddingRight:"0px",
                                            transform:"scaleX(0)",
                                            transformOrigin:"left"
                                        })}}
                                    >
                                        <div>
                                            <div className="text-gray-600 font-semibold my-2 flex flex-nowrap whitespace-nowrap items-center gap-3">
                                                <span>Order ID : </span>
                                                <p>{o._id}</p>
                                            </div>
                                            {
                                                o.products.map((p, i) => (
                                                    <div className="flex gap-1 flex-nowrap whitespace-nowrap">
                                                        <span>{i+1}. &nbsp; </span><span className="text-gray-600 font-semibold">{p.productID.slice(14)}</span> || <span className="text-gray-600">{p.name}</span> || <span className="text-gray-600">{p.price}₹</span> x <span className="text-gray-600">{p.quantity}</span>
                                                    </div>
                                                ))
                                            }
                                            <div className="my-2 flex items-center gap-3">
                                                <span></span>
                                                <p className="border-t-1 border-gray-200 w-full mr-5"></p>
                                            </div>
                                            <div className="my-2 flex items-center gap-3">
                                                <span><CiLocationOn /></span>
                                                <p>{o.shippingInfo.address}, {o.shippingInfo.city}, {o.shippingInfo.state}, {o.shippingInfo.pincode}, {o.shippingInfo.country}</p>
                                            </div>
                                            <div className="my-2 flex items-center gap-3">
                                                <span></span>
                                                <p className="border-t-1 border-gray-200 w-full mr-5"></p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span><BiPhone /></span>
                                                    <p>{o.shippingInfo.phone}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span><BiCalendarEvent /></span>
                                                    <p>{new Date(o.deliveredAt?.toString() as string).toLocaleString(undefined, {day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"numeric"})}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<button
                                            className="bg-linear-to-br from-[#f44669] to-[#f46f46] text-white px-2 rounded-[4px] active:opacity-60"
                                            onClick={() => {
                                                sendDeliveryConfirmationHandler({orderID:o._id});
                                                setA(true);
                                                setSelectedOrder(o._id);
                                            }}
                                        >
                                            Send OTP
                                        </button>*/}
                                    </div>


                                    {/*<div className="flex justify-between w-full px-4 py-4 mt-10 overflow-hidden transition-all ease-out duration-300"
                                        style={{...(!(a&&selectedOrder===o._id)&&{
                                            width:"0px",
                                            paddingLeft:"0px",
                                            paddingRight:"0px",
                                            transform:"scaleX(0)",
                                            transformOrigin:"right"
                                        })}}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <h1 className="text-xl font-semibold">Verify Confirmation</h1>
                                            <p>to confirm delivery of Order ID</p>
                                            <p>{o._id}</p>
                                            <input type="text" placeholder="Verification OTP"
                                                maxLength={6}
                                                className="border-1 border-gray-400 p-2 rounded-[4px] tracking-[2px]"
                                                onChange={(e) => setOtp(e.target.value)}
                                            />

                                        </div>
                                        <button
                                            className="bg-linear-to-br from-[#f44669] to-[#f46f46] text-white px-2 rounded-[4px] active:opacity-60"
                                            onClick={() => {
                                                verifyDeliveryConfirmationHandler({orderID:o._id, otp});
                                                setA(false);
                                                console.log(otp);
                                            }}
                                        >
                                            Verify OTP
                                        </button>
                                    </div>*/}
                                </div>
                            ))}
                        </section>
                    )
                }
                {
                    tab === "cancelled" &&
                    (
                        <section>Cancelled</section>
                    )
                }


                    <section className="fixed left-0 bottom-0 bg-[#f4466940] backdrop-blur-md text-center w-full flex justify-around h-[10vh] py-2">
                        <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("pending")}>
                            <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                                backgroundColor:tab==="pending"?"#f06682bb":"white"
                            }} />
                            <span className="text-[1rem] font-semibold">Pending</span>
                        </div>
                        <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("processing")}>
                            <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                                backgroundColor:tab==="processing"?"#f06682bb":"white"
                            }} />
                            <span className="text-[1rem] font-semibold">Processing</span>
                        </div>
                        <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("shipped")}>
                            <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                                backgroundColor:tab==="shipped"?"#f06682bb":"white"
                            }} />
                            <span className="text-[1rem] font-semibold">Shipped</span>
                        </div>
                        <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("delivered")}>
                            <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                                backgroundColor:tab==="delivered"?"#f06682bb":"white"
                            }} />
                            <span className="text-[1rem] font-semibold">Delivered</span>
                        </div>
                        <div className="flex flex-col items-center w-[6rem]" onClick={() => setTab("cancelled")}>
                            <AiOutlineProduct className="tab_icon text-3xl px-1 rounded-[10px]" style={{
                                backgroundColor:tab==="cancelled"?"#f06682bb":"white"
                            }} />
                            <span className="text-[1rem] font-semibold">Cancelled</span>
                        </div>
                </section>
            </HandlePageUIWithState>
    )
};

export default Delivery;