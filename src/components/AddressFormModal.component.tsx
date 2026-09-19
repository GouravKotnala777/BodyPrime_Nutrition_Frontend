import { useEffect, useState, type ChangeEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../contexts/CartContext";
import { createOrder } from "../apis/order.api";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm.component";
import Accordion from "./Accordion.component";
import { getMyAddresses } from "../apis/address.api";
import type { AddressFormTypes } from "../utils/types";



const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


function AddressFormModal() {
    const {userData} = useUser();
    const {cartData, setCartData, calculateTotalCartValue} = useCart();
    const [isAddressFormModalOpen, setIsAddressFormModalOpen] = useState<boolean>(false);
    const [addressFormData, setAddressFormData] = useState<AddressFormTypes>({address1:"", address2:"", landmark:"", city:"", state:"", country:"", pincode:""});
    const [previousAddresses, setPreviousAddresses] = useState<AddressFormTypes[]>([]);
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
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState<{
            method:"COD"|"Stripe";
            transactionID?:string;
            status:"canceled"|"processing"|"requires_action"|"requires_capture"|"requires_confirmation"|"requires_payment_method"|"succeeded";
        }>({method:"COD", status:"processing", transactionID:""});
    const [isAccordionManuallyClosed, setIsAccordionManuallyClosed] = useState<boolean>(false);
    const [saveAddressConfirmation, setSaveAddressConfirmation] = useState<boolean>(false);
    const [isOrdering, setIsOrdering] = useState<boolean>(false);



    function onChangeAddressFormHandler(e:ChangeEvent<HTMLInputElement>) {
        setAddressFormData({...addressFormData, [e.target.name]:e.target.value});
    };
    function onClickLocationHandler() {
        const navigator = new Navigator()
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                console.log("abhi is position ko server me bhejna reh raha hai");
            },
            (err) => {console.log(err);},
        )
    };
    function closeAddressFormModal() {
        setIsAddressFormModalOpen(false);
    };
    function receiveAddressFormModalEvent(event:Event) {
        const eventData = (event as CustomEvent<{
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
        }>).detail; // it will be true always whenever event emits it sends {isAddressFormModalOpen:true} (for open modal don't have access to close it) not false so i think property name is not appropriate
        setIsAddressFormModalOpen(eventData.isAddressFormModalOpen);
        setPaymentInfo(eventData.paymentInfo);
        //setShippingType(eventData.shippingType);
        setPriceSummary(eventData.priceSummary);
    };

    async function createOrderHandler() {
        setIsOrdering(true);
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
            ...addressFormData,
            phone:userData?.mobile as string,
            orderStatus:"processing",
            saveAddressConfirmation

        });
        setTimeout(() => {
            console.log(res);

            if (res.success && res.jsonData.newOrder.paymentInfo.method === "COD") {
                setCartData([]);
                setIsOrdering(false);
                closeAddressFormModal();
                navigate("/my_orders");
            }
            else{
                setIsOrdering(false);
            }
        }, 2000);


        return res;
    };

    function onClickAddressBadgesHandler(address:AddressFormTypes) {
        setAddressFormData(address);
        setIsAccordionManuallyClosed(true);
        //setTimeout(() => {
        //    setIsAccordionManuallyClosed(false);
        //}, 1000);
    };

    async function getMyAddressesHandler() {
        const myAddresses = await getMyAddresses();

        if (myAddresses.success) {
            setPreviousAddresses(myAddresses.jsonData);
        }
    };

    useEffect(() => {
        //let timer = 0;

        //clearTimeout(timer);

        //timer = setTimeout(() => {
            getMyAddressesHandler();
        //}, 1000);
    }, []);

    useEffect(() => {
        window.addEventListener("toggleAddressFormModal", receiveAddressFormModalEvent);

        return() => window.removeEventListener("toggleAddressFormModal", receiveAddressFormModalEvent);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isAddressFormModalOpen ? "hidden" : "auto";
    }, [isAddressFormModalOpen]);

    return(
        <div className={`bg-black/70 fixed top-0 left-0 w-full h-full grid place-items-end sm:place-items-center ${isAddressFormModalOpen?"scale-y-100 opacity-100":"scale-y-0 opacity-0"}`}
            onClick={closeAddressFormModal}
        >
            <div className="bg-white w-full sm:max-w-110 mt-0 sm:mt-10 rounded-t-xl sm:rounded-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-100 overflow-y-scroll scrollbar-thin p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-gray-400 font-semibold">Enter address details</div>
                        <button className="border border-red-100 text-red-500 bg-red-50 hover:bg-red-300 hover:text-red-50 font-semibold text-sm rounded-md w-8 h-8 mb-2 transition-colors ease-in duration-75"
                            onClick={closeAddressFormModal}
                        >X</button>
                    </div>


                    {
                        previousAddresses.length !== 0 &&
                            <div className="">
                                <Accordion
                                    data={[
                                        {
                                            heading:(
                                                <div className="text-sm py-3 px-2">choose from previous</div>
                                            ),
                                            para:(
                                                <div className="flex flex-col gap-4 p-4 rounded-lg [box-shadow:0px_0px_4px_1px_var(--color-gray-300)_inset]">
                                                    {
                                                        previousAddresses.map((adrs) => (
                                                            <button className="border border-gray-200 flex justify-between items-center h-12 text-xs p-2 rounded-md group hover:bg-primary-100"
                                                                onClick={() => onClickAddressBadgesHandler(adrs)}
                                                            >
                                                                <span className="">{adrs.address1}, {adrs.address2}, {adrs.landmark}, {adrs.city}, {adrs.state}, {adrs.country}, {adrs.pincode}</span>
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 group-hover:translate-x-4 ease-out duration-300">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                                    </svg>
                                                                </span>
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    ]}
                                    closeManually={isAccordionManuallyClosed}
                                    setCloseManually={setIsAccordionManuallyClosed}
                                />
                            </div>
                    }


                    <div className="">
                        <input type="text" name="address1" placeholder="Flat, House no, Building, Apartment..."
                            value={addressFormData.address1}
                            className="ring-1 ring-gray-200 w-full my-2 px-3 py-2 rounded-md"
                            onChange={onChangeAddressFormHandler}
                        />
                        <input type="text" name="address2" placeholder="Sector, Area, Street, Colony..."
                            value={addressFormData.address2}
                            className="ring-1 ring-gray-200 w-full my-2 px-3 py-2 rounded-md"
                            onChange={onChangeAddressFormHandler}
                        />
                        <input type="text" name="landmark" placeholder="Landmark (Optional)"
                            value={addressFormData.landmark}
                            className="ring-1 ring-gray-200 w-full my-2 px-3 py-2 rounded-md"
                            onChange={onChangeAddressFormHandler}
                        />
                        <div className="flex justify-between my-2 gap-4">
                            <button className="ring-1 ring-orange-200/80 bg-orange-100 hover:bg-orange-50 px-3 py-2 text-orange-800 w-full flex items-center gap-2 rounded-md"
                                onClick={onClickLocationHandler}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
                                    className="size-4.5"
                                >
                                    <line x1="2" x2="5" y1="12" y2="12"/>
                                    <line x1="19" x2="22" y1="12" y2="12"/>
                                    <line x1="12" x2="12" y1="2" y2="5"/>
                                    <line x1="12" x2="12" y1="19" y2="22"/>
                                    <circle cx="12" cy="12" r="7"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                <span>Use my location</span>
                            </button>
                            <input type="text" name="pincode" placeholder="6-digit Pincode"
                                value={addressFormData.pincode}
                                className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                                onChange={onChangeAddressFormHandler}
                            />
                        </div>
                        <div className="flex justify-between my-4 gap-4">
                            <input type="text" name="city" placeholder="City"
                                value={addressFormData.city}
                                className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                                onChange={onChangeAddressFormHandler}
                            />
                            <input type="text" name="state" placeholder="State"
                                value={addressFormData.state}
                                className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                                onChange={onChangeAddressFormHandler}
                            />
                        </div>
                        <input type="text" name="country" placeholder="Country"
                            value={addressFormData.country}
                            className="ring-1 ring-gray-200 w-full my-2 px-3 py-2 rounded-md"
                            onChange={onChangeAddressFormHandler}
                        />

                        <label htmlFor="saveAddressConfirmation" className="ring-1 ring-gray-200 w-full my-2 px-3 py-2 rounded-md flex items-center gap-2">
                            <input id="saveAddressConfirmation" type="checkbox" name="saveAddressConfirmation" checked={saveAddressConfirmation} onChange={() => setSaveAddressConfirmation(!saveAddressConfirmation)} />
                            <span className="text-gray-600 -translate-y-0.25">save this address for future</span>
                        </label>

                        <div>
                            {
                                paymentInfo.method === "Stripe"?
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm
                                            createOrderHandler={createOrderHandler}
                                            totalCartValue={calculateTotalCartValue()}
                                            navigate={navigate}
                                            setCartData={setCartData}
                                        />
                                    </Elements>
                                    :
                                    <button className="relative bg-orange-100 hover:bg-orange-50 text-orange-800 font-semibold mt-4 mb-0.25 w-full px-2 py-2.5 rounded-md flex justify-center items-center gap-1 transition-colors ease-out duration-300"
                                        onClick={createOrderHandler}
                                    >
                                        {
                                            isOrdering ?
                                            <>
                                                <div className={`"opacity-100 scale-100 blur-0" h-full absolute top-0 -left-0.25 w-full transition-all ease-in-out duration-300`}>
                                                    <div className="w-full h-full flex justify-center items-center gap-1.25">
                                                        <div className="size-1.5 bg-secondary-800 rounded-2xl"
                                                            style={{
                                                                animation:"up-down-dot-loading 1s 0s linear infinite"
                                                            }}
                                                        ></div>
                                                        <div className="size-1.5 bg-secondary-800 rounded-2xl"
                                                            style={{
                                                                animation:"up-down-dot-loading 1s 0.2s linear infinite"
                                                            }}
                                                        ></div>
                                                        <div className="size-1.5 bg-secondary-800 rounded-2xl"
                                                            style={{
                                                                animation:"up-down-dot-loading 1s 0.4s linear infinite"
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                
                                                <span className="opacity-0">A</span>
                                            </>
                                            :
                                            <span className="">Save and deliver here</span>
                                        }
                                    </button>
                            }
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    )
};

export default AddressFormModal;