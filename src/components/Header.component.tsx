//import viteLogo from '/vite.svg';
import { NavLink } from "react-router-dom";
import "../styles/components/header.component.css";
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import ImageWithFallback from './ImageWithFallback.component';
import { BiSearch } from "react-icons/bi";
import type { Dispatch, SetStateAction } from "react";



export interface HeaderPropTypes {
    isHamActive:boolean;
    setIsHamActive:Dispatch<SetStateAction<boolean>>;
    isSearchActive:boolean;
    setIsSearchActive:Dispatch<SetStateAction<boolean>>;
    isHeaderVisible:boolean;
};

function Header({isHamActive, setIsHamActive, setIsSearchActive, isHeaderVisible}:HeaderPropTypes) {
    const {calculateTotalCartItems, wishlistData} = useCart();
    const {loggedInUserName, isUserAuthenticated, isUserAdmin} = useUser();

    return(
        <header
            className="fixed w-full top-0 left-0 header flex justify-between gap-10 items-center h-[9vh] px-3 transition-transform duration-300 ease-in-out"
            style={{
                transform:isHeaderVisible?"translateY(0%)":"translateY(-101%)"
            }}
        >
            <section className="logo_section flex items-center gap-4">
                <NavLink to={"/home"}>
                    <ImageWithFallback src="/logo.png" alt="/logo.png" fallbackSrc={`${import.meta.env.VITE_SERVER_URL}/api/v1/public/no_user.png`} className="w-[55px] h-[55px]" />
                </NavLink>
                <NavLink to={isUserAuthenticated()?"/my_profile":"/login"} className="text-xl font-semibold text-white">{isUserAuthenticated()?loggedInUserName():"Login"}</NavLink>
            </section>
            <section
                className="nav_section block"
            >
                <nav className="nav_nav flex w-[500px] justify-around text-white">
                <NavLink to="/home" className="nav_item">Home</NavLink>
                <NavLink to="/my_profile" className="nav_item">Profile</NavLink>
                {isUserAdmin() && <NavLink to="/inventory" className="nav_item">Inventory</NavLink>}
                <NavLink to="/wishlist" className="relative nav_item">
                    <span>Wishlist</span>
                    <span className="text-[10px] font-semibold w-[18px] h-[18px] grid place-items-center rounded-2xl absolute right-[-11px] top-[-11px] bg-white text-[#b11433]">{wishlistData.length}</span>
                </NavLink>
                <NavLink to="/my_orders" className="nav_item">My Orders</NavLink>
                {
                    isUserAdmin() &&
                        <NavLink to="/delivery" className="nav_item">Delivery</NavLink>
                }
                {
                    !isUserAuthenticated() &&
                    <>
                        <NavLink to="/register" className="nav_item">Register</NavLink>
                        <NavLink to="/login" className="nav_item">Login</NavLink>
                    </>
                }
                <NavLink to="/cart" className="relative nav_item">
                    <span>Cart</span>
                    <span className="text-[10px] font-semibold w-[18px] h-[18px] grid place-items-center rounded-2xl absolute right-[-11px] top-[-11px] bg-white text-[#b11433]">{calculateTotalCartItems()}</span>
                </NavLink>
                </nav>
            </section>
            <section className="mobile_nav hidden items-center justify-end gap-8">
                <section className="relative w-[22px] h-[22px]">
                    <BiSearch className="absolute text-3xl bottom-0 left-0" onClick={() => setIsSearchActive(true)} />
                </section>
                <section>
                    <NavLink to="/cart" className="relative w-[45px] h-[30px]">
                        <FiShoppingCart className="text-3xl" />
                        <span className="text-[11px] font-semibold w-[20px] h-[20px] grid place-items-center rounded-2xl absolute right-[-8px] top-[-8px] bg-white text-[#b11433]">{calculateTotalCartItems()}</span>
                    </NavLink>
                </section>
                <section className="ham_section w-[22px] h-[22px] relative">
                    <div className="w-full h-full flex flex-col justify-between">
                        <div className="border-b-[3px]"></div>
                        <div className="border-b-[3px]"></div>
                        <div className="border-b-[3px]"></div>
                    </div>
                    <input type="checkbox" name="" id=""
                        className="absolute top-0 left-0 w-full h-full opacity-0"
                        onClick={() => setIsHamActive(!isHamActive)}
                    />
                </section>
            </section>
        </header>
    )
};

export default Header;