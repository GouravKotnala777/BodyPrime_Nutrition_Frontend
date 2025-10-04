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
    };


    return(
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button
             className="p-2 w-full text-2xl bg-yellow-400 rounded-2xl"
             disabled={!stripe || loading}
             >
                {loading ? "Processing..." : <>Pay <span className="font-light">₹</span><span className="font-semibold">{totalCartValue}</span></>}
            </button>
        </form>
    )
};

export default CheckoutForm;