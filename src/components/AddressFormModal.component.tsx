import { useState, type ChangeEvent } from "react";
import type { UserTypes } from "../utils/types";

function AddressFormModal() {
    const [addressFormData, setAddressFormData] = useState({});
    const [userFormData, setUserFormData] = useState<Pick<UserTypes, "name"|"email"|"mobile">>({name:"", email:"", mobile:""});

    function onChangeAddressFormHandler(e:ChangeEvent<HTMLInputElement>) {
        setAddressFormData({...addressFormData, [e.target.name]:e.target.value});
    };
    function onChangeUserFormHandler(e:ChangeEvent<HTMLInputElement>) {
        setUserFormData({...userFormData, [e.target.name]:e.target.value});
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

    return(
        <div className="border border-red-500 bg-black/70 fixed top-0 left-0 w-full h-full grid place-items-end sm:place-items-center">
            <div className="border border-violet-500 bg-white w-full sm:max-w-110 mt-0 sm:mt-10 p-4 rounded-t-xl sm:rounded-xl">
                <div>
                    <div className="text-gray-400 font-semibold mb-2">Enter address details</div>
                    <div>
                        <input type="text" name="address1" placeholder="Flat, House no, Building, Apartment..."
                            className="ring-1 ring-gray-200 w-full my-2 px-3 py-2 rounded-md"
                            onChange={onChangeAddressFormHandler}
                        />
                        <input type="text" name="address2" placeholder="Sector, Area, Street, Colony..."
                            className="ring-1 ring-gray-200 w-full my-2 px-3 py-2 rounded-md"
                            onChange={onChangeAddressFormHandler}
                        />
                        <input type="text" name="landmark" placeholder="Landmark (Optional)"
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
                                className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                                onChange={onChangeAddressFormHandler}
                            />
                        </div>
                        <div className="flex justify-between my-4 gap-4">
                            <input type="text" name="city" placeholder="City"
                                className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                                onChange={onChangeAddressFormHandler}
                            />
                            <input type="text" name="state" placeholder="State"
                                className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                                onChange={onChangeAddressFormHandler}
                            />
                        </div>

                        {/* user details form */}
                        <div className="flex justify-between my-2 gap-4">
                            <input type="text" name="firstName" placeholder="First Name"
                                className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                                onChange={onChangeUserFormHandler}
                            />
                            <input type="text" name="lastName" placeholder="Last Name"
                                className="ring-1 ring-gray-200 w-full px-3 py-2 rounded-md"
                                onChange={onChangeUserFormHandler}
                            />
                        </div>
                        <input type="text" name="email" placeholder="Your Email Address"
                            className="ring-1 ring-gray-200 w-full my-2 px-3 py-2 rounded-md"
                            onChange={onChangeUserFormHandler}
                        />
                        <div className="ring-1 ring-gray-200 flex items-center my-2 rounded-md">
                            <div className="text-gray-500 bg-gray-100 text-nowrap px-3 pr-4 py-2 flex items-center gap-1 rounded-l-md">
                                <img src="/indian_flag.svg" alt="/indian_flag.svg" />
                                <span>+91</span>
                            </div>
                            <input type="text" name="mobile" placeholder="10-digit number"
                                className="w-full px-3 pl-2 py-2 rounded-r-md"
                                onChange={onChangeUserFormHandler}
                            />
                        </div>
                        <button className="bg-orange-100 hover:bg-orange-50 text-orange-800 font-semibold mt-4 mb-0.25 w-full px-2 py-2.5 rounded-md flex justify-center items-center gap-1 transition-colors ease-out duration-300">
                            <span className="">Save and deliver here</span>
                        </button>
                    </div>
                </div>                
            </div>
        </div>
    )
};

export default AddressFormModal;