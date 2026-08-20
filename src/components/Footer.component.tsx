import { FiFacebook } from "react-icons/fi";
import { NavLink } from "react-router-dom";


function Footer() {
    
    return(
        <div className="w-full h-90 bg-primary relative overflow-hidden z-0">
            {/* arc stripe */}
            <div className="w-full h-[40%] rounded-b-[100%] absolute -top-18 left-0 bg-white"></div>

            {/* footer links */}
            <div className="h-full bg-primary-400">
                <div className="content-center h-full px-4 sm:px-10">
                    <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-center mt-25 text-white">

                        {/* navigations */}
                        <div className="flex gap-10 text-sm sm:text-lg">
                            <div className="group">
                                <NavLink to="####">Product</NavLink>
                                <div className="w-full sm:w-0 h-0.25 sm:h-0.5 bg-white group-hover:w-full transition-all ease-in-out duration-300"></div>
                            </div>
                            <div className="group">
                                <NavLink to="####">Contact</NavLink>
                                <div className="w-full sm:w-0 h-0.25 sm:h-0.5 bg-white group-hover:w-full transition-all ease-in-out duration-300"></div>
                            </div>
                            <div className="group">
                                <NavLink to="####">Pricing Plan</NavLink>
                                <div className="w-full sm:w-0 h-0.25 sm:h-0.5 bg-white group-hover:w-full transition-all ease-in-out duration-300"></div>
                            </div>
                        </div>

                        {/* logo */}
                        <NavLink to="/home" className="my-5 sm:my-0 size-20 sm:size-25"><img src="logo.png" alt="logo.png" className="w-full" /></NavLink>

                        {/* socials */}
                        <div className="flex gap-10">
                            
                            {/* linkedin */}
                            <NavLink to="####" className="rounded-full w-10 h-10 grid place-items-center relative overflow-hidden group">
                                <div className="w-full h-full bg-white scale-y-0 group-hover:scale-y-100 transition-transform origin-top ease-in-out duration-300"></div>
                                <div className="border border-primary-400 absolute top-[50%] left-[50%] -translate-[50%] w-[90%] h-[90%] rounded-full bg-primary-50 grid place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-6 fill-primary-400"><path fill="var(--primary-50)" d="M224,40V216a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8H216A8,8,0,0,1,224,40Z" opacity="0.2"></path><path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path></svg>
                                </div>
                            </NavLink>

                            {/* twitter */}
                            <NavLink to="####" className="rounded-full w-10 h-10 grid place-items-center relative overflow-hidden group">
                                <div className="w-full h-full bg-white scale-y-0 group-hover:scale-y-100 transition-transform origin-top ease-in-out duration-300"></div>
                                <div className="border border-primary-400 absolute top-[50%] left-[50%] -translate-[50%] w-[90%] h-[90%] rounded-full bg-primary-50 grid place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.6" className="size-6 fill-none stroke-primary-400"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                                </div>
                            </NavLink>

                            {/* instagram */}
                            <NavLink to="https://www.instagram.com/deepak_athlete31" className="rounded-full w-10 h-10 grid place-items-center relative overflow-hidden group">
                                <div className="w-full h-full bg-white scale-y-0 group-hover:scale-y-100 transition-transform origin-top ease-in-out duration-300"></div>
                                <div className="border border-primary-400 absolute top-[50%] left-[50%] -translate-[50%] w-[90%] h-[90%] rounded-full bg-primary-50 grid place-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-6 fill-none stroke-primary-400">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                    </svg>
                                </div>
                            </NavLink>

                            {/* facebook */}
                            <NavLink to="https://www.facebook.com/1160849520434919/" className="rounded-full w-10 h-10 grid place-items-center relative overflow-hidden group">
                                <div className="w-full h-full bg-white scale-y-0 group-hover:scale-y-100 transition-transform origin-top ease-in-out duration-300"></div>
                                <div className="border border-primary-400 absolute top-[50%] left-[50%] -translate-[50%] w-[90%] h-[90%] rounded-full bg-primary-50 grid place-items-center">
                                    <FiFacebook className="text-primary-400 size-5 -translate-x-0.25" strokeWidth="1.6" />
                                </div>
                            </NavLink>
                        </div>
                    </div>
                    <div className="my-5 text-white/80 text-xs">Copyright 2026. BodyPrime Nutrition - All Rights Reserved.</div>

                </div>
            </div>
        </div>
    )
};

export default Footer;