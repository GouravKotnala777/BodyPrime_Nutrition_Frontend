import { NavLink } from "react-router-dom";



function Landing() {


    return (
        <section className="h-screen flex justify-center items-center">
            <div className="border border-neutral-200 text-center px-5 py-10 rounded-xl">
                <h1 className="text-neutral-800 text-3xl font-semibold">Sorry For The Inconvenience</h1>
                <p className="text-neutral-600 text-lg my-2">
                    Landing page has not been created yet!
                </p>
                <NavLink to="/home" className="my-2 inline-block p-2 border border-[#f44669] text-[#f44669] rounded-lg text-lg">Go to Home Page</NavLink>
            </div>            
        </section>
         
    )
};


export default Landing;