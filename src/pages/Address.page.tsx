import { useState, type ChangeEvent } from "react";


function Address() {
    const [shippingInfo, setShippingInfo] = useState<{address:string; city:string; state:string; country:string; pincode:string;}>({address:"", city:"", state:"", country:"", pincode:""});
    
    function addressOnChangeHandler(e:ChangeEvent<HTMLInputElement>) {
        setShippingInfo({...shippingInfo, [e.target.name]:e.target.value})
    };

    function createAddressHandler() {
        console.log(shippingInfo);
    };


    return(
        <section className="border-2">
            <div className="border-2">
                <h3 className="border-2 text-2xl text-center py-2 font-semibold">Deliver to this address</h3>
                <div className="border-2 border-amber-500 flex flex-col gap-3 mt-3">
                    <input type="text" name="address" placeholder="Address" className="border-2 border-amber-300 text-xl px-4 py-2" onChange={addressOnChangeHandler} />
                    <input type="text" name="city" placeholder="City" className="border-2 border-amber-300 text-xl px-4 py-2" onChange={addressOnChangeHandler} />
                    <input type="text" name="state" placeholder="State" className="border-2 border-amber-300 text-xl px-4 py-2" onChange={addressOnChangeHandler} />
                    <input type="text" name="country" placeholder="Country" className="border-2 border-amber-300 text-xl px-4 py-2" onChange={addressOnChangeHandler} />
                    <input type="text" name="pincode" placeholder="Pincode" className="border-2 border-amber-300 text-xl px-4 py-2" onChange={addressOnChangeHandler} />
                    <input type="text" name="phone" placeholder="Phone" className="border-2 border-amber-300 text-xl px-4 py-2" onChange={addressOnChangeHandler} />
                    <button className="py-3 rounded-4xl bg-[#4d80ff] text-white text-xl font-semibold" onClick={createAddressHandler}>Save</button>
                </div>
            </div>
        </section>
    )
};

export default Address;