import { NavLink } from "react-router-dom";


function Authenticity() {

    return(
        <section className="border border-transparent" // border border-transparent for mt glitch
            style={{
                //backgroundImage:"url(patterns/aztec.svg)",
                backgroundImage:"url(patterns/topography.svg)",
                backgroundBlendMode:"overlay",
                backgroundColor:"var(--primary-50)"
            }}
        >
            <div className="max-w-3xl mx-auto bg-transparent backdrop-blur-xs">

                {/* heading */}
                <div className="text-lg sm:text-2xl text-gray-800 font-bold text-center mt-25 mb-20">
                    <div>Loved by People who make a difference</div>
                </div>

                {/* customers */}
                <div className="flex flex-col gap-20 px-2 xs:px-4 sm:px-0">
                    {/* first section */}
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="border border-gray-300 w-full sm:w-500 relative p-3 overflow-hidden rounded-3xl">
                            <img src="aa.jpg" alt="aa.jpg" className="w-full h-full absolute top-0 left-0 blur-sm -z-1" />
                            <img src="aa.jpg" alt="aa.jpg" className="w-full h-full rounded-2xl border border-white/60 " />
                        </div>
                        <div className="">
                            <div className="flex gap-2">
                                <div className="text-5xl text-gray-700 font-semibold">"</div>
                                <p className="text-lg text-gray-600 mt-3 text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur maxime, et cupiditate porro dolorum eveniet necessitatibus deserunt aliquid omnis voluptate assumenda nam ad amet dolor ab ducimus, harum minima ratione! Unde facere doloribus nisi consequuntur est veritatis neque quis accusamus?</p>
                                <div className="text-5xl text-gray-700 font-semibold text-right content-end leading-0">"</div>
                            </div>
                            <NavLink to="####" className="w-max p-1 flex items-center gap-2 my-3 ml-auto group">
                                <div className="text-primary-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-6 fill-none stroke-primary-400">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                    </svg>
                                </div>
                                <div className="">
                                    <div className="text-gray-600 font-mono">gouravkotnala777</div>
                                    <div className="relative w-full h-0.5 mt-0.25">
                                        <div className="bg-primary-200 w-full h-full scale-x-0 xs:scale-x-100 origin-right group-hover:scale-x-0 transition-transform ease-in-out duration-300 absolute top-0 left-0"></div>
                                        <div className="bg-primary-400 w-full h-full scale-x-100 xs:scale-x-0 origin-left group-hover:scale-x-100 transition-transform ease-in-out duration-300"></div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                    
                    {/* second section */}
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-5">
                        <div className="">
                            <div className="flex gap-2">
                                <div className="text-5xl text-gray-700 font-semibold">"</div>
                                <p className="text-lg text-gray-600 mt-3 text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur maxime, et cupiditate porro dolorum eveniet necessitatibus deserunt aliquid omnis voluptate assumenda nam ad amet dolor ab ducimus, harum minima ratione! Unde facere doloribus nisi consequuntur est veritatis neque quis accusamus?</p>
                                <div className="text-5xl text-gray-700 font-semibold text-right content-end leading-0">"</div>
                            </div>
                            <NavLink to="####" className="w-max p-1 flex items-center gap-2 my-3 ml-auto group">
                                <div className="text-primary-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-6 fill-none stroke-primary-400">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                    </svg>
                                </div>
                                <div className="">
                                    <div className="text-gray-600 font-mono">gouravkotnala777</div>
                                    <div className="relative w-full h-0.5 mt-0.25">
                                        <div className="bg-primary-200 w-full h-full scale-x-0 xs:scale-x-100 origin-right group-hover:scale-x-0 transition-transform ease-in-out duration-300 absolute top-0 left-0"></div>
                                        <div className="bg-primary-400 w-full h-full scale-x-100 xs:scale-x-0 origin-left group-hover:scale-x-100 transition-transform ease-in-out duration-300"></div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                        <div className="border border-gray-300 w-full sm:w-500 relative p-3 overflow-hidden rounded-3xl">
                            <img src="aa.jpg" alt="aa.jpg" className="w-full h-full absolute top-0 left-0 blur-sm -z-1" />
                            <img src="aa.jpg" alt="aa.jpg" className="w-full h-full rounded-2xl border border-white/60 " />
                        </div>
                    </div>

                    {/* third section */}
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="border border-gray-300 w-full sm:w-500 relative p-3 overflow-hidden rounded-3xl">
                            <img src="aa.jpg" alt="aa.jpg" className="w-full h-full absolute top-0 left-0 blur-sm -z-1" />
                            <img src="aa.jpg" alt="aa.jpg" className="w-full h-full rounded-2xl border border-white/60 " />
                        </div>
                        <div className="">
                            <div className="flex gap-2">
                                <div className="text-5xl text-gray-700 font-semibold">"</div>
                                <p className="text-lg text-gray-600 mt-3 text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur maxime, et cupiditate porro dolorum eveniet necessitatibus deserunt aliquid omnis voluptate assumenda nam ad amet dolor ab ducimus, harum minima ratione! Unde facere doloribus nisi consequuntur est veritatis neque quis accusamus?</p>
                                <div className="text-5xl text-gray-700 font-semibold text-right content-end leading-0">"</div>
                            </div>
                            <NavLink to="####" className="w-max p-1 flex items-center gap-2 my-3 ml-auto group">
                                <div className="text-primary-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-6 fill-none stroke-primary-400">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                    </svg>
                                </div>
                                <div className="">
                                    <div className="text-gray-600 font-mono">gouravkotnala777</div>
                                    <div className="relative w-full h-0.5 mt-0.25">
                                        <div className="bg-primary-200 w-full h-full scale-x-0 xs:scale-x-100 origin-right group-hover:scale-x-0 transition-transform ease-in-out duration-300 absolute top-0 left-0"></div>
                                        <div className="bg-primary-400 w-full h-full scale-x-100 xs:scale-x-0 origin-left group-hover:scale-x-100 transition-transform ease-in-out duration-300"></div>
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    </div>


                </div>


                {/* continue shopping link */}
                <NavLink to="/home" className="relative block w-max my-20 mx-auto cursor-pointer">

                    {/* Button */}
                    <div className="gradient-angle-selectable relative text-sm font-semibold sm:text-lg rounded-[10px] bg-white px-4 py-2 text-primary-400">
                        Continue Shopping
                    </div>


                    {/* Border */}
                    <div className="absolute -inset-0.5 rounded-xl gradient-angle-target -z-1"
                        style={{
                            background:"conic-gradient(from var(--gradient-angle), white, var(--primary-500), white)",
                        }}
                    ></div>
                    
                </NavLink>
            </div>
        </section>
    )
};

export default Authenticity;