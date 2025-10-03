import { useEffect, useState, type ChangeEvent } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { createOrder } from "../apis/order.api";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm.component";

const addressDummyData = [
    {address:"New bhoor colony", city:"Old Faridabad", country:"India", phone:"08882732859", pincode:"121002", state:"Haryana"},
    {address:"Ho.No.371, lal mandir ke pichhe", city:"Faridabad", country:"India", phone:"08882732859", pincode:"121002", state:"Haryana"},
    {address:"Baselwa colony", city:"Old Faridabad", country:"India", phone:"08882732859", pincode:"121002", state:"Haryana"},
    {address:"Parwatiya colony", city:"Dabua, Faridabad", country:"India", phone:"08882732859", pincode:"121009", state:"Haryana"}
];
const shippingTypeOptions = {
    Express:500,
    Standard:300,
    Regular:0
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Address() {
    const {cartData, calculateTotalCartValue} = useCart();
    const {userData} = useUser();
    const [shippingInfo, setShippingInfo] = useState<{address:string; city:string; state:string; country:string; pincode:string;}>({address:"", city:"", state:"", country:"", pincode:""});
    const [isAddressFormHidden, setIsAddressFormHidden] = useState<boolean>(true);
    const [isPreviousAddressHidden, setIsPreviousAddressHidden] = useState<boolean>(true);
    const [shippingType, setShippingType] = useState<"Express"|"Standard"|"Regular">("Regular");
    const [priceSummary, setPriceSummary] = useState<{
        itemsPrice: number;
        taxPrice: number;
        shippingPrice: number;
        discount: number;
        totalPrice: number;
    }>({itemsPrice:0,
        taxPrice:0,
        shippingPrice:0,
        discount:0,
        totalPrice:0});
    const [paymentInfo, setPaymentInfo] = useState<{
        method:"COD"|"Stripe";
        transactionID?:string;
        status:"pending"|"paid"|"failed"|"refunded";
    }>({method:"COD", status:"pending", transactionID:""});


    function calculatePriceSummaryHandler() {
        const itemsPrice = calculateTotalCartValue();
        const taxPrice = (calculateTotalCartValue()*18)/100;
        const shippingPrice = shippingTypeOptions[shippingType];
        const discount = 0;
        const totalPrice = itemsPrice + taxPrice + shippingPrice - discount;
        setPriceSummary({
            itemsPrice, taxPrice, shippingPrice, discount, totalPrice
        });
    };


    function addressOnChangeHandler(e:ChangeEvent<HTMLInputElement>) {
        setShippingInfo({...shippingInfo, [e.target.name]:e.target.value})
    };

    function createAddressHandler() {
        setIsAddressFormHidden(true);
    };

    
    async function createOrderHandler() {
        const transformedCartData = cartData.map((p) => ({
            name:p.name,
            price:p.price,
            productID:p._id,
            quantity:p.quantity
        }));

        const res = await createOrder({
            products:transformedCartData,
            ...paymentInfo,
            ...priceSummary,
            ...shippingInfo,
            phone:userData?.mobile as string,
            orderStatus:"processing"
        });
        console.log(res);

        return res;
    };
    
    useEffect(() => {
        calculatePriceSummaryHandler();
    }, [cartData, shippingType]);

    return(
        <section className="">
            <div className="">
                <h3 className="text-2xl text-center py-2 font-semibold">Deliver to this address</h3>
                <div className="border-amber-400 mb-3">
                    <h4>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}, {shippingInfo.pincode}</h4>
                </div>

                <button className="flex items-center gap-2 text-center text-[1rem] text-blue-600 my-3 underline underline-offset-1" onClick={() => setIsPreviousAddressHidden(!isPreviousAddressHidden)}>Select from previous <span>{isPreviousAddressHidden?<BiDownArrow/>:<BiUpArrow/>}</span></button>
                <div style={{
                    height:isPreviousAddressHidden?"0":"340px",
                    //height:"max-content",
                    transition:"0.5s",
                    overflow:"hidden"
                }}>
                    <h3 className="text-2xl text-center py-2 font-semibold">Select shipping address</h3>
                    <div className="border-amber-400 flex flex-col gap-4">
                        {
                            addressDummyData.map((item) => (
                                <div className="border-[1px] border-[#f44769] flex gap-4 pl-2 py-2 rounded-[8px] active:bg-[#f4476a58]" onClick={() => {setShippingInfo(item); setIsAddressFormHidden(true); setIsPreviousAddressHidden(true);}}>
                                    <FaLocationDot className="text-2xl" />
                                    <span>{item.address}, {item.city}, {item.state}, {item.country}, {item.pincode}, {item.phone}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <button className="flex items-center gap-2 text-center text-[1rem] text-blue-600 my-3 underline underline-offset-1" onClick={() => setIsAddressFormHidden(!isAddressFormHidden)}>Add new address <span>{isAddressFormHidden?<BiDownArrow/>:<BiUpArrow/>}</span></button>

                <div className="flex flex-col gap-3 mt-3" style={{
                    height:isAddressFormHidden?"0":"340px",
                    //height:"max-content",
                    transition:"0.5s",
                    overflow:"hidden"
                }}>
                    <input type="text" name="address" placeholder="Address" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" onChange={addressOnChangeHandler} />
                    <input type="text" name="city" placeholder="City" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" onChange={addressOnChangeHandler} />
                    <input type="text" name="state" placeholder="State" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" onChange={addressOnChangeHandler} />
                    <input type="text" name="country" placeholder="Country" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" onChange={addressOnChangeHandler} />
                    <input type="text" name="pincode" placeholder="Pincode" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" onChange={addressOnChangeHandler} />
                    <input type="text" name="phone" placeholder="Phone" className="border-[1px] border-[#f44769] px-5 py-2 rounded-[4px]" onChange={addressOnChangeHandler} />
                    <button className="py-3 rounded-4xl bg-[#4d80ff] text-white text-xl font-semibold" onClick={createAddressHandler}>Save</button>
                </div>

                <div className="my-4">
                    <h4 className="text-[1rem] text-gray-800 py-2">Mode of Payment :</h4>
                    <div className="flex justify-around">
                        <label className="flex items-center gap-2 p-2">Stripe <input type="radio" name="paymentMethod" value="Stripe" onChange={(e) => setPaymentInfo({...paymentInfo, method:e.target.value as "Stripe"})} /></label>
                        <label className="flex items-center gap-2 p-2">Cash On Delivery <input type="radio" name="paymentMethod" value="COD" onChange={(e) => setPaymentInfo({...paymentInfo, method:e.target.value as "COD"})} /></label>
                    </div>
                </div>

                <h3 className="text-2xl text-center py-2 font-semibold">Shipping type</h3>
                <div className="border-amber-400 flex flex-col gap-4">
                    <div className="border-[1px] border-[#f44769] flex gap-4 px-2 rounded-[8px] active:bg-[#f4476a58]">
                        <label className="w-full flex justify-between py-2"><input type="radio" name="shippingType" value="Express" onChange={(e) => setShippingType(e.target.value as "Express")} /> Express Shipping (1-3 days) : ₹500/-</label>
                    </div>
                    <div className="border-[1px] border-[#f44769] flex gap-4 px-2 rounded-[8px] active:bg-[#f4476a58]">
                        <label className="w-full flex justify-between py-2"><input type="radio" name="shippingType" value="Standard" onChange={(e) => setShippingType(e.target.value as "Standard")} /> Standard Shipping (3-5 days) : ₹300/-</label>
                    </div>
                    <div className="border-[1px] border-[#f44769] flex gap-4 px-2 rounded-[8px] active:bg-[#f4476a58]">
                        <label className="w-full flex justify-between py-2"><input type="radio" name="shippingType" value="Regular" onChange={(e) => setShippingType(e.target.value as "Regular")} /> Regular Shipping (6-7 days) : ₹0/-</label>
                    </div>
                    <div className="border-[1px] border-[#f44769] flex justify-between rounded-[8px] active:bg-[#f4476a58]">
                        <h4>Total</h4> <span>₹{priceSummary.totalPrice} + {shippingType} {`(₹${shippingTypeOptions[shippingType]})`} = ₹{priceSummary.totalPrice}/-</span>
                    </div>
                </div>

                <h1>
                    {
                        paymentInfo.method === "Stripe"?
                        "Stripe"
                        :
                        "COD"
                    }
                </h1>


                <Elements stripe={stripePromise}>
                    <CheckoutForm createOrderHandler={createOrderHandler} />
                </Elements>


                {/*<button onClick={createOrderHandler}>Confirm pay ₹{priceSummary.totalPrice}</button>*/}


            </div>
        </section>
    )
};

export default Address;