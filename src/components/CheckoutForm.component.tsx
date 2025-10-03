import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, type FormEvent } from "react";
import type { OrderTypes } from "../utils/types";




function CheckoutForm({createOrderHandler}:{createOrderHandler:()=>Promise<{
    success: boolean;
    message: string;
    jsonData: {
        clientSecret: string;
        newOrder: OrderTypes;
    };
}>}) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e:FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await createOrderHandler();

        console.log(res);

        const result = await stripe?.confirmCardPayment(res.jsonData.clientSecret, {
            payment_method:{
                card:elements?.getElement(CardElement)!
            }
        });

        if (result?.error) {
            console.error(result.error.message);
        } else if (result?.paymentIntent?.status === "succeeded") {
            console.log("Payment successful!");
        }

        setLoading(false);
    };


    return(
        <form onSubmit={handleSubmit} className="border-2">
            <CardElement className="border-2" />
            <button
             className="border-2 border-amber-500"
             disabled={!stripe || loading}
             >
                {loading ? "Processing..." : "Pay"}
            </button>
        </form>
    )
};

export default CheckoutForm;