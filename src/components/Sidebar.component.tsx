import { NavLink } from "react-router-dom";
import { useState, type Dispatch, type SetStateAction } from 'react';
import "../styles/components/header.component.css";

export interface SidebarPropTypes {
    isHamActive:boolean;
    setIsHamActive:Dispatch<SetStateAction<boolean>>;
}

function Sidebar({isHamActive, setIsHamActive}:SidebarPropTypes) {
    
    return(
        <aside
            className="sidebar_aside fixed top-0 left-[0%] h-[100vh] w-[101vw] flex justify-between transition-all duration-1000 ease-in-out"
            style={{
                left:isHamActive?"0%":"-100%",
                backgroundColor:isHamActive?"rgba(0,0,0,0.86)":"rgba(0,0,0,0.0)"
            }}
        >
            <section className="side_nav_section h-full w-[80%] top-0 left-0 absolute bg-white">
                <nav className="side_nav_nav h-full flex flex-col gap-15 p-10 text-center">
                    <NavLink to="/home" className="nav_item font-semibold" onClick={() => setIsHamActive(false)}>Home</NavLink>
                    <NavLink to="/profile" className="nav_item font-semibold" onClick={() => setIsHamActive(false)}>Profile</NavLink>
                    <NavLink to="/orders" className="nav_item font-semibold" onClick={() => setIsHamActive(false)}>Orders</NavLink>
                    <NavLink to="/signup" className="nav_item font-semibold" onClick={() => setIsHamActive(false)}>Register</NavLink>
                    <NavLink to="/signin" className="nav_item font-semibold" onClick={() => setIsHamActive(false)}>Login</NavLink>
                </nav>
            </section>
            <section className="side_closer_section h-full w-[20%] absolute top-0 right-0 text-right p-4">
                <div className="w-full h-[40px] text-center text-white absolute top-10 left-0"
                    style={{
                        opacity:isHamActive?"1":"0"
                    }}
                >X</div>
                <input type="checkbox" name="" id=""
                    className="w-full h-[100vh] transition-all duration-1000 ease-in-out absolute top-0 left-0 opacity-0"
                    onClick={() => setIsHamActive(!isHamActive)}
                />
            </section>
        </aside>
    )
};

export default Sidebar;