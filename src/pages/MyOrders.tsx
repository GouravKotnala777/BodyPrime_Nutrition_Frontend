import { useEffect, useState } from "react";
import { myOrders } from "../apis/order.api";
import { type OrderTypes } from "../utils/types";


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

function MyOrders() {
    const [orders, setOrders] = useState<OrderTypes[]>([]);

    async function myOrdersHandler() {
        const res = await myOrders();

        if (res.success) {
            setOrders(res.jsonData);
        }
    };

    useEffect(() => {
        myOrdersHandler();
    }, []);
    
    return(
        <section className="">
            {
                orders.map(({_id, orderStatus, paymentInfo, priceSummary, products, createdAt, deliveredAt}) => (
                    <div className="border-b-[1px] border-b-gray-200 mt-8">
                        <div className="flex items-center"
                            style={{
                                backgroundColor:orderStatus==="cancelled"?"#ffcccc":"unset"
                            }}
                        >
                            <span className="w-full flex overflow-scroll gap-2">
                                {
                                    products.map((p) => (
                                        <span className="flex flex-col p-2 w-[100px] text-center">
                                            <img src="/vite.svg" alt="/vite.svg" className="w-[80px]" />
                                            <span className="text-[1rem] font-semibold text-gray-800 w-[80px]">{p.name}</span>
                                            <span className="w-[80px]">₹{p.price} x {p.quantity}</span>
                                        </span>
                                    ))
                                }
                            </span>
                            <div className="flex flex-col px-2"
                                style={{
                                    color:orderStatus==="cancelled"?"#bb1111":"unset"
                                }}
                            >
                                <span>{_id}</span>
                                <span
                                    className="w-min py-[2px] rounded-[4px]"
                                    style={{
                                        backgroundColor:orderStatus==="cancelled"?"red":"unset",
                                        color:orderStatus==="cancelled"?"white":"unset"
                                    }}
                                >{orderStatus}</span>
                                <span>{paymentInfo.transactionID}</span>
                                <span>{paymentInfo.method}</span>
                                <span>{paymentInfo.status}</span>
                                <span>₹{priceSummary.totalPrice}</span>
                            </div>
                        </div>
                        <div className="text-gray-400 text-[0.8rem] text-center">
                            <span>{deliveredAt?new Date(deliveredAt).toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"}):new Date(createdAt).toLocaleString(undefined, {day:"numeric", month:"short", year:"numeric"})}</span>
                        </div>
                    </div>
                ))
            }
        </section>
    )
};

export default MyOrders;