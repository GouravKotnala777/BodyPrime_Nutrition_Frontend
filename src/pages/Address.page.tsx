import { useEffect, useState, type ChangeEvent } from "react";
import { createAddress, deleteMyAddress, getMyAddresses } from "../apis/address.api";
import Spinner from "../components/Spinner.component";
import type { AddressFormTypes } from "../utils/types";
import toast from "react-hot-toast";
import Skeletan from "../components/Skeletan";



let timer = 0;

function Address() {
    const [addressFormData, setAddressFormData] = useState<AddressFormTypes>({address1:"", address2:"", landmark:"", city:"", state:"", country:"", pincode:""});
    const [address, setAddress] = useState<{_id:string, address1:string; address2:string; landmark:string; city:string; state:string; country:string; pincode:string;}[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [processingAddress, setProcessingAddress] = useState<string>("");
    const [isAddressCreating, setIsAddressCreating] = useState<boolean>(false);
  

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
    async function getMyAddressesHandler() {
        const res = await getMyAddresses();
        if (res.success) {
            console.log(res);
            setAddress(res.jsonData);
        }

    };
    async function createAddressHandler() {
        try {
            if (!addressFormData.address1 || !addressFormData.address2 || !addressFormData.city || !addressFormData.state || !addressFormData.country || !addressFormData.pincode) {
                throw new Error("All fields are required");
            }
            if (addressFormData.pincode.length < 6 || addressFormData.pincode.length > 6) {
                throw new Error("Pincode must be 6 digit");
            }
            clearTimeout(timer);
            setIsAddressCreating(true);
            timer = setTimeout(async() => {
                const res = await createAddress(addressFormData);
                if (res.success) {
                    setAddress(prev => [...prev, res.jsonData]);
                    setIsAddressCreating(false);
                    setAddressFormData({address1:"", address2:"", landmark:"", city:"", state:"", country:"", pincode:""});
                }
            }, 2000);
        } catch (error) {
            toast.error(new Error(error as string).message, {position:"top-center", duration:2000});
            return;
        }
    };
    async function deleteMyAddressHandler({addressID}:{addressID:string}) {
        setProcessingAddress(addressID);
        clearTimeout(timer);
        timer = setTimeout(() => {
            setProcessingAddress("");
            deleteMyAddress({addressID});
            setAddress((prev) => prev.filter((adrs) => adrs._id !== addressID));
        }, 2000);
    };

    useEffect(() => {
        let timera = 0;
        setIsLoading(true);

        timera = setTimeout(() => {
            setIsLoading(false);
            getMyAddressesHandler();
        }, 2000);

        return() => clearTimeout(timera);
    }, []);

    return(
        <section className="flex flex-col sm:flex-row gap-4 p-4">
            {/* left part */}
            <div className="border-0 sm:border border-gray-200 basis-2/3 rounded-2xl py-4">

                {
                    // loading
                    isLoading ?
                        <div className="h-[80vh] flex flex-col items-center gap-4 overflow-hidden">
                            {
                                [0,1].map((_, index) => (
                                    <div key={index} className="border border-gray-200 grid grid-cols-2 px-6 py-4 rounded-lg w-full max-w-100 gap-4 leading-5 relative">
                                        <div className="text-gray-700 font-semibold h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-600">
                                            <div className="flex flex-col gap-2">
                                                <div className="h-4 rounded-sm overflow-hidden"><Skeletan /></div>
                                                <div className="w-[70%] h-4 rounded-sm overflow-hidden"><Skeletan /></div>
                                                <div className="w-[90%] h-4 rounded-sm overflow-hidden"><Skeletan /></div>
                                                <div className="w-[40%] h-4 rounded-sm overflow-hidden"><Skeletan /></div>
                                            </div>
                                        </div>
                                        <div className="text-gray-700 font-semibold h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-600">
                                            <div className="flex flex-col gap-2">
                                                <div className="h-4 rounded-sm overflow-hidden"><Skeletan /></div>
                                                <div className="w-[90%] h-4 rounded-sm overflow-hidden"><Skeletan /></div>
                                                <div className="h-4 rounded-sm overflow-hidden"><Skeletan /></div>
                                                <div className="w-[60%] h-4 rounded-sm overflow-hidden"><Skeletan /></div>
                                            </div>
                                        </div>
                                        <div className="text-gray-700 font-semibold h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-600 h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-700 font-semibold h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-600 h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-700 font-semibold h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-600 h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-700 font-semibold h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-600 w-[70%] h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-700 font-semibold h-7 rounded-md overflow-hidden"><Skeletan /></div>
                                        <div className="text-gray-600 w-[60%] h-7 rounded-md overflow-hidden"><Skeletan /></div>

                                        {/* delete button */}
                                        <div className="border border-gray-200 absolute right-2 bottom-2 w-10 h-10 rounded-md grid place-items-center">
                                            <Spinner type="secondary" color="var(--color-gray-300)" />    
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        <div className="flex flex-col items-center gap-4">
                            {
                                address.map((adrs) => (
                                    <div key={adrs._id} className="border border-gray-200 grid grid-cols-2 px-6 py-4 rounded-lg w-full max-w-100 gap-4 leading-5 relative">
                                        <div className="text-gray-700 font-semibold">Address1</div><div className="text-gray-600">{adrs.address1} Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim, autem.</div>
                                        <div className="text-gray-700 font-semibold">Address2</div><div className="text-gray-600">{adrs.address2} Lorem ipsum dolor sit.</div>
                                        <div className="text-gray-700 font-semibold">Landmark</div><div className="text-gray-600">{adrs.landmark}</div>
                                        <div className="text-gray-700 font-semibold">City</div><div className="text-gray-600">{adrs.city}</div>
                                        <div className="text-gray-700 font-semibold">State</div><div className="text-gray-600">{adrs.state}</div>
                                        <div className="text-gray-700 font-semibold">Country</div><div className="text-gray-600">{adrs.country}</div>
                                        <div className="text-gray-700 font-semibold">Pincode</div><div className="text-gray-600">{adrs.pincode}</div>

                                        {/* delete button */}
                                        <button className="border border-red-100 text-primary-400 absolute right-2 bottom-2 w-10 h-10 rounded-md grid place-items-center cursor-pointer hover:bg-primary-100 hover:text-primary-500 transition-colors ease-out duration-300"
                                            onClick={() => deleteMyAddressHandler({addressID:adrs._id})}
                                        >
                                            {
                                                (processingAddress === adrs._id) ?
                                                    <Spinner color="var(--color-primary-400)" />
                                                    :
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                            }
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                }
            </div>

            {/* right part */}
            <div className="basis-1/3 relative">
                <div className="border border-gray-200 w-full max-w-100 mx-auto flex flex-col gap-4 p-4 rounded-2xl sticky top-20 righ-0">
                    <input type="text" name="address1" placeholder="Flat, House no, Building, Apartment..."
                        value={addressFormData.address1}
                        className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                        onChange={onChangeAddressFormHandler}
                    />
                    <input type="text" name="address2" placeholder="Sector, Area, Street, Colony..."
                        value={addressFormData.address2}
                        className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                        onChange={onChangeAddressFormHandler}
                    />
                    <input type="text" name="landmark" placeholder="Landmark (Optional)"
                        value={addressFormData.landmark}
                        className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                        onChange={onChangeAddressFormHandler}
                    />
                    <div className="flex justify-between gap-4">
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
                    <div className="flex justify-between gap-4">
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
                        className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                        onChange={onChangeAddressFormHandler}
                    />
                    <button className="relative bg-orange-100 hover:bg-orange-50 text-orange-800 font-semibold w-full px-2 py-2.5 rounded-md flex justify-center items-center gap-1 transition-colors ease-out duration-300"
                        onClick={createAddressHandler}
                    >
                        {
                            isAddressCreating ?
                            <>
                                <div className={`${(!isLoading)?"opacity-100 scale-100 blur-0":"opacity-0 scale-0 blur-sm"} h-full absolute top-0 -left-0.25 w-full transition-all ease-in-out duration-300`}>
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
                            <span className="">Add Address</span>
                        }

                    </button>
                </div>
            </div>
        </section>
        //<section className="border border-gray-200 w-full max-w-3xl mx-auto rounded-xl p-4">
        //    <div className="flex flex-col items-center gap-4">
        //        {
        //            address.map((adrs) => (
        //                <div className="border border-gray-200 grid grid-cols-2 px-6 py-4 rounded-lg w-full max-w-100 gap-4 leading-5 relative">
        //                    <div className="text-gray-700 font-semibold">Address1</div><div className="text-gray-600">{adrs.address1} Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim, autem.</div>
        //                    <div className="text-gray-700 font-semibold">Address2</div><div className="text-gray-600">{adrs.address2} Lorem ipsum dolor sit.</div>
        //                    <div className="text-gray-700 font-semibold">Landmark</div><div className="text-gray-600">{adrs.landmark}</div>
        //                    <div className="text-gray-700 font-semibold">City</div><div className="text-gray-600">{adrs.city}</div>
        //                    <div className="text-gray-700 font-semibold">State</div><div className="text-gray-600">{adrs.state}</div>
        //                    <div className="text-gray-700 font-semibold">Country</div><div className="text-gray-600">{adrs.country}</div>
        //                    <div className="text-gray-700 font-semibold">Pincode</div><div className="text-gray-600">{adrs.pincode}</div>

        //                    {/* delete button */}
        //                    <button className="border border-red-200 text-primary-400 absolute right-2 bottom-2 w-10 h-10 rounded-md grid place-items-center cursor-pointer hover:bg-primary-100 hover:text-primary-500 transition-colors ease-out duration-300"
        //                        onClick={() => deleteMyAddressHandler({addressID:adrs._id})}
        //                    >
        //                        {
        //                            isAddressDeleting ?
        //                                <Spinner color="var(--color-primary-400)" />
        //                                :
        //                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
        //                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        //                                </svg>
        //                        }
        //                    </button>
        //                </div>
        //            ))
        //        }
                
        //    </div>
        //</section>
    )
};

export default Address;