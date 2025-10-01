import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, type FormEvent } from "react";
import { createPaymentIntent } from "../apis/order.api";




function CheckoutForm({totalPrice}:{totalPrice:number;}) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e:FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await createPaymentIntent({totalPrice});

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
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button disabled={!stripe || loading}>
                {loading ? "Processing..." : "Pay"}
            </button>
        </form>
    )
};

export default CheckoutForm;