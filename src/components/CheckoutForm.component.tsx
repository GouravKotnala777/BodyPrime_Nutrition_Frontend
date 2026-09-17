import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { LocalCartTypes, OrderTypes, PaymentStatusType } from "../utils/types";
import { type NavigateFunction } from "react-router-dom";
import { updateOrder } from "../apis/order.api";
import type { PaymentIntentResult } from "@stripe/stripe-js";



function CheckoutForm({createOrderHandler, totalCartValue, navigate, setCartData}:{createOrderHandler:()=>Promise<{
    success: boolean;
    message: string;
    jsonData: {
        clientSecret: string;
        newOrder: OrderTypes;
    };
}>; totalCartValue:number; navigate:NavigateFunction; setCartData:Dispatch<SetStateAction<LocalCartTypes[]>>}) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e:FormEvent) {
        e.preventDefault();
        setLoading(true);


        setTimeout(async() => {
            const res = await createOrderHandler();
    
            console.log(res);
    
            let result:PaymentIntentResult|undefined = undefined;
            if (res.success) {
                result = await stripe?.confirmCardPayment(res.jsonData.clientSecret, {
                    payment_method:{
                        card:elements?.getElement(CardElement)!
                    }
                });
            }
    
            console.log({result});
    
            if (result?.error) {
                console.error(result.error.message);
                updateOrder(res.jsonData.newOrder._id, {transactionID:result.error.payment_intent?.id as string, message:result.error.message as string, status:result.error.payment_intent?.status as PaymentStatusType, error:result.error.message});
            } else if (result?.paymentIntent?.status === "succeeded") {
                console.log("Payment successful!");
                setCartData([]);
                navigate("/home");
                updateOrder(res.jsonData.newOrder._id, {transactionID:result.paymentIntent.id, message:result.paymentIntent.description, status:"succeeded"});
            }
            setLoading(false);
        }, 2500);
    };


    return(
        <form onSubmit={handleSubmit}>
            <CardElement />

            <button
                disabled={!stripe || loading}
                className={`hover:bg-secondary-50 text-secondary-800 ${(!stripe||loading)?"bg-secondary-50":"bg-secondary-100"} font-semibold mt-4 mb-0.25 w-full px-2 py-2.5 rounded-md flex justify-center items-center gap-1 transition-colors ease-out duration-300`}
            >
                {
                    loading ?
                    <div className="relative w-full">
                        <div className="opacity-100 scale-100 blur-0 h-full absolute top-0 -left-0.25 w-full transition-all ease-in-out duration-300">
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
                        {/* only to occupy height */}
                        <div className="opacity-0">aaaa</div>
                    </div>
                    :
                    <div className={`${(!stripe)?"text-secondary-800/30":"text-secondary-800"}`}>Pay <span className="font-light">₹</span><span className="font-semibold">{totalCartValue}</span> and deliver here</div>
                }
            </button>
        </form>
    )
};

export default CheckoutForm;