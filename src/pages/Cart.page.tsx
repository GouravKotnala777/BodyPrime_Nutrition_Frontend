import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { addToCart, removeFromCart } from "../apis/cart.api";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { converKgtolbs } from "../utils/functions";
import Skeletan from "../components/Skeletan";
import Spinner from "../components/Spinner.component";
import ImageWithFallback from "../components/ImageWithFallback.component";
//import AddressFormModal from "../components/AddressFormModal.component";

const off = 0;
const shippingTypeOptions = {
    Express:500,
    Standard:300,
    Regular:0
};

function Cart() {
    const {isUserAuthenticated} = useUser();
    const {cartData, setCartData, removeProductFromLocalCart, calculateTotalCartItems, calculateTotalCartValue} = useCart();
    //const [targetedProduct, setTargetedProduct] = useState<string>("");
    const [processState, setProcessState] = useState<"loading"|"success"|"error"|null>(null);
    const navigate = useNavigate();
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
            status:"canceled"|"processing"|"requires_action"|"requires_capture"|"requires_confirmation"|"requires_payment_method"|"succeeded";
        }>({method:"Stripe", status:"processing", transactionID:""});

    function clicked(state:"success"|"error") {
        setProcessState("loading");
        setTimeout(() => {
            if (state === "error") {
                setProcessState("error");
                setTimeout(() => {
                    setProcessState(null);
                }, 1000)
            }
            else{
                setProcessState("success");
                
                setTimeout(() => {
                    setProcessState(null);
                }, 1000)
            }
        }, 2000);
    };

    async function addToCartHandler({productID, variant, quantity}:{productID:string; variant:string; quantity:number;}) {
        try {
            //setTargetedProduct(productID);
            const res = await addToCart({productID, variant, quantity});
    
            const selectedProduct = cartData.find((p) => p._id === res.jsonData.products._id);
    
            if (!selectedProduct) return Error("selectedProduct not found");
    
            if (res.jsonData.quantity < 10) {
                setCartData(cartData.map((p) => p._id === res.jsonData.products._id?{...p, quantity:res.jsonData.quantity}:p));
            } else {
                return Error("Cannot add more than 10 products");
            }
            console.log(res);
        } catch (error) {
            console.log(error);
        }
        finally{
            //setTargetedProduct("");
        }
    };

    async function removeFromCartHandler({productID, variant, quantity}:{productID:string; variant:string; quantity:number;}) {
        try {
            //setTargetedProduct(productID);
            
            const res = await removeFromCart({productID, variant, quantity});
    
            if (res.success) {
                const selectedProduct = cartData.find((p) => p._id === res.jsonData.products);
                
                if (!selectedProduct) return Error("selectedProduct not found");
                if (res.jsonData.quantity < 1) {
                    setCartData(cartData.filter(p => p._id !== res.jsonData.products));
                }
                else{
                    selectedProduct.quantity = res.jsonData.quantity;
                    setCartData(cartData.map(p => p._id === res.jsonData.products?{...p, quantity:res.jsonData.quantity}:p));
                    "agar product ki quantity kam hui lekin poora remove nahi hua to usse handle karna hai"
                }
                clicked("success");
            }
            else{
                clicked("error");
            }
    
        } catch (error) {
            console.log(error);
            clicked("error");
        }
        finally{
            //setTargetedProduct("");
        }
    };

    function handlePageSectionJump(sectionID:string) {
        const section = document.getElementById(sectionID);

        if (section) {
            section.scrollIntoView({behavior:"smooth"});
        }
    };

    function emitAddressFormModalEvent() {
        const event = new CustomEvent<{
            isAddressFormModalOpen:boolean;
            //shippingType:"Express"|"Standard"|"Regular";
            paymentInfo:{
                method:"COD"|"Stripe";
                transactionID?:string;
                status:"canceled"|"processing"|"requires_action"|"requires_capture"|"requires_confirmation"|"requires_payment_method"|"succeeded";
            };
            priceSummary:{
                itemsPrice: number;
                taxPrice: number;
                shippingPrice: number;
                discount: number;
                totalPrice: number;
            };
        }>("toggleAddressFormModal", {
            detail:{isAddressFormModalOpen:true, paymentInfo, priceSummary}
        });

        window.dispatchEvent(event);
    };

    function calculatePriceSummaryHandler() {
        const TAX_PERCENT = 18;
        const itemsPrice = calculateTotalCartValue();
        const taxPrice = (calculateTotalCartValue()*TAX_PERCENT)/100;
        const shippingPrice = shippingTypeOptions[shippingType];
        const discount = 0;
        const totalPrice = Math.round(itemsPrice + taxPrice + shippingPrice - discount);
        setPriceSummary({
            itemsPrice, taxPrice, shippingPrice, discount, totalPrice
        });
    };
    useEffect(() => {
        calculatePriceSummaryHandler();
    }, [cartData, shippingType]);
    
    return(
        <section className="p-0 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-4 relative">
                {/* left part */}
                <div className="border border-gray-200 flex-1 rounded-xl p-4">
                    {/*<pre className="text-xs">{JSON.stringify(cartData, null, `\t`)}</pre>*/}
                    <div className="text-gray-400 text-lg font-semibold">Shopping Cart</div>
                    
                    {
                        // loading
                        cartData[0]?._id === "initialProductId" ?
                            [0,1,2].map((iter) => (
                                    <div key={iter} className="border-b border-gray-100 flex gap-4 mt-15 pb-4">
                                        <div className="relative size-35 group">
                                            <div className="w-full h-full rounded-md overflow-hidden"><Skeletan /></div>
                                            <div className="w-full h-full bg-pink-200 grid place-items-center rounded-md absolute top-0 left-0 opacity-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        pathLength="1"
                                                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                        className="
                                                            fill-none
                                                            stroke-current
                                                            [stroke-dasharray:1]
                                                            [stroke-dashoffset:1]
                                                            transition-[stroke-dashoffset]
                                                            duration-700 delay-200
                                                            group-hover:[stroke-dashoffset:0]
                                                            ease-in-out
                                                        "
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 w-full">
                                            <div className="h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                            <div className="h-5 rounded-md overflow-hidden"><Skeletan /></div>
                                            <div className="flex items-center gap-2 h-10 w-35 rounded-md overflow-hidden">
                                                <Skeletan />
                                            </div>
                                            <div className="flex justify-end flex-wrap gap-4">
                                                <div className="">
                                                    <div className="w-40 h-9 relative">
                                                        <div className={`
                                                            flex justify-center items-center gap-3
                                                            bg-white text-center content-center h-full w-full rounded-md absolute left-0 overflow-hidden
                                                            bottom-0
                                                        `}>
                                                            <div className="border border-red-200 border-r-transparent rounded-l-md basis-1/3 h-full content-center bg-primary-50">
                                                                <div className="w-min mx-auto">
                                                                    <Spinner color="var(--primary-300)" type="secondary" />
                                                                </div>
                                                            </div>
                                                            <div className="basis-1/4 h-full text-lg content-center text-gray-700 bg-white rounded-md overflow-hidden"><Skeletan /></div>
                                                            <div className="border border-green-200 border-l-transparent rounded-r-md basis-1/3 h-full content-center bg-green-50">
                                                                <div className="w-min mx-auto">
                                                                    <Spinner color="var(--color-green-300)" type="secondary" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex w-50 gap-4">
                                                    <div className="h-9 basis-1/2 rounded-md overflow-hidden">
                                                        <Skeletan />
                                                    </div>
                                                    <div className="h-9 basis-1/2 rounded-md overflow-hidden">
                                                        <Skeletan />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            ))
                            :
                            // empty cart
                            <div>
                                {
                                    cartData.length === 0 ?
                                        <div>
                                            <img src="/empty_cart.jpg" alt="/empty_cart.jpg" className="w-full max-w-110 h-100 sm:h-110 mx-auto" />
                                            <div className="text-center">
                                                <button className="bg-primary-100 hover:bg-primary-50 text-primary-800 font-semibold w-full max-w-70 mx-auto py-3 rounded-md flex justify-center items-center gap-1 transition-colors ease-out duration-300 group"
                                                    onClick={() => navigate("/home")}
                                                >
                                                    <span className="ml-4 -translate-y-0.25">Continue Shopping</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 translate-y-0.25 group-hover:translate-x-4 ease-out duration-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        // cart items
                                        <div>
                                            {
                                                cartData.map((p) => (
                                                    <div className="border-b border-gray-100 flex gap-4 mt-15 pb-4">
                                                        <NavLink to={`/single_product/${p._id}`} target="_blank" className="relative size-35 group">
                                                            <div className="w-full h-full min-w-25 rounded-md overflow-hidden">
                                                                <ImageWithFallback src={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.images[0]}`} alt={`${import.meta.env.VITE_SERVER_URL}/api/v1${p.images[0]}`} fallbackSrc={`/placeholders/no_product.jpg`} />
                                                            </div>
                                                            <div className="w-full h-full bg-pink-200 grid place-items-center rounded-md absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity ease-out duration-300 [box-shadow:0px_0px_5px_2px_white_inset]">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="1.5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    className="size-6"
                                                                >
                                                                    <path
                                                                        pathLength="1"
                                                                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                                        className="
                                                                            fill-none
                                                                            stroke-current
                                                                            [stroke-dasharray:1]
                                                                            [stroke-dashoffset:1]
                                                                            transition-[stroke-dashoffset]
                                                                            duration-700 delay-200
                                                                            group-hover:[stroke-dashoffset:0]
                                                                            ease-in-out
                                                                        "
                                                                    />
                                                                </svg>
                                                                {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-white size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                </svg>*/}
                                                            </div>
                                                        </NavLink>
                                                        <div className="">
                                                            <div className="text-gray-800">{p.name} {p.category} {p.brand} {p.flavor} {p.weight} {p.variant.split("#")[1]} {p.variant.split("#")[2]}</div>
                                                            <div className="text-gray-600">{p.variant.split("#")[2]} ({converKgtolbs(p.variant.split("#")[2])} lb), {p.variant.split("#")[1]}</div>
                                                            <div className="flex items-center gap-2 my-2">
                                                                <span><span className="text-gray-700 text-xl">₹</span><span className="text-gray-800 text-2xl font-semibold">{(Number(p.variant.split("#")[3])*(off||100))/100}</span></span>
                                                                {off?<span className="text-gray-400 line-through">₹{p.variant.split("#")[3]}</span>:<></>}
                                                                {off?<span className="text-gray-600">({off}% off)</span>:<></>}
                                                            </div>
                                                            <div className="flex flex-wrap justify-end gap-4 sm:gap-4">
                                                                {/* quantity stepper */}
                                                                <div className="">
                                                                    <div className="ml-auto w-40 h-9 relative">
                                                                        <div className={`
                                                                            flex justify-center items-center
                                                                            bg-primary-100 text-center content-center h-full w-full rounded-md absolute left-0 overflow-hidden
                                                                            ${p.quantity>0?"bottom-0":"-bottom-full"}
                                                                            transition-all ease-in-out duration-300 px-0.25
                                                                        `}>
                                                                            <button className="border border-red-300 border-r-transparent rounded-l-md basis-1/3 h-full content-center bg-primary-100 hover:bg-primary-50"
                                                                                disabled={!!processState}
                                                                                onClick={()=>removeFromCartHandler({productID:p._id, variant:p.variant, quantity:1})}
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 mx-auto text-primary-700">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                                                                </svg>
                                                                            </button>
                                                                            <div className="basis-1/3 h-full text-lg content-center text-gray-700 bg-white">{p.quantity}</div>
                                                                            <button className="border border-green-300 border-l-transparent rounded-r-md basis-1/3 h-full content-center bg-green-100 hover:bg-green-50"
                                                                                disabled={!!processState}
                                                                            onClick={()=>addToCartHandler({productID:p._id, variant:p.variant, quantity:1})}
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5 mx-auto text-green-700">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between gap-4">
                                                                    <button className="border border-gray-200 text-gray-500 bg-gray-50 px-3 py-1 pb-1.5 rounded-sm hover:opacity-70">Save for later</button>
                                                                    <button className="border border-red-200 text-red-500 bg-red-50 px-3 py-1 pb-1.5 rounded-sm hover:opacity-70" onClick={() => {
                                                                        if (isUserAuthenticated()) {
                                                                            removeFromCartHandler({productID:p._id, variant:p.variant, quantity:p.quantity});
                                                                        }
                                                                        else{
                                                                            removeProductFromLocalCart({_id:p._id, variant:p.variant, quantity:1})
                                                                        }
                                                                    }}>Remove</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))
                                            }
                                        </div>


                                }
                            </div>
                    }
                </div>
                {/* right part */}
                <div id="price_details" className="border border-gray-200 min-w-70 h-min rounded-xl sticky top-21 right-0 p-4">{/*give mb-15 sm:mb-0*/}
                    {
                        calculateTotalCartItems() ?
                            <div className="flex flex-col gap-5">

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700">Item Total ({calculateTotalCartItems()})</span>
                                    {off?<span className="text-green-700">Saved ₹3100 isse thik karna h</span>:<></>}
                                    <div className="ml-auto">
                                        <div className="text-gray-700">₹{calculateTotalCartValue()}</div>
                                        {off?<div className="text-gray-500 line-through">₹{calculateTotalCartValue()}</div>:<></>}
                                    </div>
                                </div>

                                {/* shipping types */}
                                <div className="">
                                    <div className="text-gray-400 mb-2">Shipping type</div>
                                    <div className="flex flex-col gap-4">
                                        <div className="ring-1 ring-gray-200 text-gray-700 w-full rounded-md">
                                            <label className="w-full flex justify-between px-3 py-2"><input type="radio" name="shippingType" value="Express" checked={shippingType === "Express"} onChange={(e) => setShippingType(e.target.value as "Express")} /> Express Shipping (1-3 days) : ₹500/-</label>
                                        </div>
                                        <div className="ring-1 ring-gray-200 text-gray-700 w-full rounded-md">
                                            <label className="w-full flex justify-between px-3 py-2"><input type="radio" name="shippingType" value="Standard" checked={shippingType === "Standard"} onChange={(e) => setShippingType(e.target.value as "Standard")} /> Standard Shipping (3-5 days) : ₹300/-</label>
                                        </div>
                                        <div className="ring-1 ring-gray-200 text-gray-700 w-full rounded-md">
                                            <label className="w-full flex justify-between px-3 py-2"><input type="radio" name="shippingType" value="Regular" checked={shippingType === "Regular"} onChange={(e) => setShippingType(e.target.value as "Regular")} /> Regular Shipping (6-7 days) : ₹0/-</label>
                                        </div>
                                    </div>
                                </div>

                                {/* baad me thik karunga */}
                                {/*<div className="border flex gap-1 my-5">
                                    <div>
                                        <div className="text-gray-700">Shipping Charges</div>
                                        <div className="text-sm text-gray-500">Free Shipping on orders above ₹350</div>
                                    </div>
                                    <span className="text-gray-500 line-through ml-auto">₹50</span>
                                    <span className="text-green-600">FREE</span>
                                </div>*/}

                                {/* price summery */}
                                <div>
                                    <div className="text-gray-400 mb-2">Price Summery</div>
                                    <div className="border-1 border-dashed border-gray-200 text-gray-600 text-sm flex flex-col gap-1.5 p-4 rounded-md">
                                        <div className="flex justify-between">
                                            <span>Item Price</span>
                                            <span>₹{priceSummary.itemsPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax Price (18%)</span>
                                            <span>₹{priceSummary.taxPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping Price ({shippingType})</span>
                                            <span>₹{priceSummary.shippingPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Discount</span>
                                            <span>₹{priceSummary.discount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Price</span>
                                            <span>₹{priceSummary.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* mode of payment */}
                                <div className="">
                                    <div className="text-gray-400">Mode of Payment</div>
                                    <div className="text-gray-700 flex justify-around">
                                        <label className="flex items-center gap-2 p-2">Stripe <input type="radio" name="paymentMethod" value="Stripe" checked={paymentInfo.method === "Stripe"} onChange={(e) => setPaymentInfo({...paymentInfo, method:e.target.value as "Stripe"})} /></label>
                                        <label className="flex items-center gap-2 p-2">Cash On Delivery <input type="radio" name="paymentMethod" value="COD" checked={paymentInfo.method === "COD"} onChange={(e) => setPaymentInfo({...paymentInfo, method:e.target.value as "COD"})} /></label>
                                    </div>
                                </div>


                                {/* total payable */}
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex gap-1.5 text-gray-700">
                                        <span>Total Payable</span>
                                        <span className="text-gray-800 text-lg"><span className="font-thin">₹</span><span className="font-semibold">{priceSummary.totalPrice}</span></span>
                                    </div>
                                    <button className="bg-secondary-100 hover:bg-secondary-50 text-secondary-800 font-semibold w-full py-2.5 rounded-md hidden sm:flex justify-center items-center gap-1 transition-colors ease-out duration-300 group"
                                        onClick={emitAddressFormModalEvent}
                                    >
                                        <span className="ml-4">Add Address</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 group-hover:translate-x-4 ease-out duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            :
                            <div className="">
                                <div className="w-70">
                                </div>
                            </div>
                    }
                </div>
            </div>

            {/* bottom fixed container for smaller devices only */}
            {
                calculateTotalCartItems() ?
                    <div className="bg-white block sm:hidden fixed left-0 bottom-0 w-full px-4 py-2 [box-shadow:0px_0px_10px_2px_var(--color-gray-400)]">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="">
                                    <span className="text-gray-700 text-3xl">₹</span>
                                    <span className="text-gray-800 text-3xl font-bold">10997</span>
                                </span>
                                <button className="text-gray-400 flex items-center" onClick={() => handlePageSectionJump("price_details")}>
                                    <span>See Price Details</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 translate-y-0.25">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                            <button className="bg-secondary-100 text-secondary-800 font-semibold w-50 rounded-md flex justify-center items-center gap-1"
                                onClick={emitAddressFormModalEvent}
                            >
                                <span className="ml-4">Add Address</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 translate-y-0.25">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    :
                    <></>
            }
        </section>






        //<section className="max-w-2xl mx-auto px-2">
        //    {
        //        calculateTotalCartItems() ?
        //            <div className="my-2">
        //                <div className="text-3xl"><span>Subtotal</span> <span className="font-semibold">{calculateTotalCartValue()}</span>₹</div>
        //                <div><button className="w-full py-3 mt-2 rounded-4xl bg-yellow-300 text-xl" onClick={() => navigate("/address")}>Proceed to checkout ({calculateTotalCartItems()} items)</button></div>
        //            </div>
        //            :
        //            <div>
        //                <img src="/empty_cart.jpg" alt="/empty_cart.jpg" className="w-[70%] min-w-70 mx-auto" />
        //                <div className="text-center">
        //                    <button className="border-2 px-4 py-2 text-xl rounded-[8px] bg-gradient-to-r from-primary-400 to-secondary-500 text-white hover:opacity-80"
        //                        onClick={() => navigate("/home")}
        //                    >Continue Shopping</button>
        //                </div>
        //            </div>

        //    }
        //    <div className="">
        //        {
        //            cartData.map((p) => (
        //                <div key={p._id} className="border-[1px] border-gray-100 my-4 py-4">
        //                    <div className="flex gap-2 my-2 py-4">
        //                        <div className="w-[20%] bg-gray-100">
        //                            <ImageWithFallback src="/vite.svg" alt="/vite.svg" fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_product.png`} className="w-full h-full"/>
        //                        </div>
        //                        <div className="w-[80%]">    
        //                            <div>
        //                                <NavLink to={`/single_product/${p._id}`} className="font-semibold text-[1.2rem] text-gray-700
        //                                    overflow-hidden 
        //                                    text-ellipsis 
        //                                    [display:-webkit-box] 
        //                                    [-webkit-line-clamp:3] 
        //                                    [-webkit-box-orient:vertical]
        //                                    underline
        //                                    underline-offset-2
        //                                ">{p.name} {p.brand} {p.category} Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, numquam.</NavLink>
        //                                <div className="mt-2">
        //                                    <div>{p.quantity} x</div>
        //                                    <div className="font-semibold text-[1.4rem]">₹{p.price}</div>
        //                                </div>
        //                            </div>
        //                        </div>
        //                    </div>


        //                    <div className="flex justify-between items-center gap-4 mt-2">
        //                        <div className="flex justify-around items-center border-[1px] border-green-500 py-1 rounded-[4px] flex-1/2">
        //                            <button className="text-3xl" name="-1" disabled={targetedProduct===p._id} style={{opacity:(targetedProduct===p._id)?0.2:1}} onClick={(e) => {
        //                                if (isUserAuthenticated()) {
        //                                    removeFromCartHandler({productID:p._id, variant:p.variant, quantity:1});
        //                                }
        //                                else{
        //                                    changeLocalCartProductQuantity(e, p._id);
        //                                }
        //                            }}>-</button>
        //                            <span className="text-xl w-1/3 text-center">{targetedProduct===p._id?<Spinner width="20px" />:p.quantity.toString()}</span>
        //                            <button className="text-3xl" name="1" disabled={targetedProduct===p._id} style={{opacity:(targetedProduct===p._id)?0.2:1}} onClick={(e) => {
        //                                if (isUserAuthenticated()) {
        //                                    addToCartHandler({productID:p._id, variant:p.variant, quantity:1});
        //                                }
        //                                else{
        //                                    changeLocalCartProductQuantity(e, p._id)
        //                                }
        //                            }}>+</button>
        //                        </div>
        //                        {/*<button className="border-[1px] border-green-500 text-white bg-green-500 py-2 rounded-[4px] flex-1/2 mr-2">Buy</button>*/}
        //                        <button className="border-[1px] border-red-500 text-red-500 py-2 rounded-[4px] flex-1/2 text-xl"
        //                            onClick={() => {
        //                                if (isUserAuthenticated()) {
        //                                    removeFromCartHandler({productID:p._id, variant:p.variant, quantity:p.quantity});
        //                                }
        //                                else{
        //                                    removeProductFromLocalCart({_id:p._id, variant:p.variant, quantity:1})
        //                                }
        //                            }}
        //                        >Remove</button>
        //                    </div>
                            
        //                    <div className="flex justify-between items-center gap-2 mt-2">
        //                        <button className="border-[1px] border-gray-300 py-2 px-2 rounded-[4px] text-xl"
        //                            //onClick={() => removeProductFromLocalCart({_id:p._id})}
        //                        >Save for later</button>
        //                        <button className="border-[1px] border-gray-300 py-2 px-2 rounded-[4px] text-xl">Compare with similar items</button>
        //                    </div>
        //                </div>
        //            ))
        //        }
        //    </div>
        //</section>
    )
};

export default Cart;