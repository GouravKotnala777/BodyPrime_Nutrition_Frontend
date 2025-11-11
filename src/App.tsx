import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.page';
import Login from './pages/Login.page.tsx';
import Register from './pages/Register.page.tsx';
import Header from './components/Header.component';
import Sidebar from './components/Sidebar.component';
import { useEffect, useState } from 'react';
import Cart from './pages/Cart.page.tsx';
import SingleProduct from './pages/SingleProduct.page.tsx';
import { useCart } from './contexts/CartContext.tsx';
import { myProfile } from './apis/user.api.ts';
import { useUser } from './contexts/UserContext.tsx';
import MyProfile from './pages/MyProfile.page.tsx';
import Logout from './pages/Logout.page.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.component.tsx';
import Inventory from './pages/Inventory.page.tsx';
import { addToCart, getCart } from './apis/cart.api.ts';
import { transformCartDataForRes } from './utils/functions.ts';
import Address from './pages/Address.page.tsx';
import Verification from './pages/Verification.page.tsx';
import {Toaster} from "react-hot-toast";
import MyOrders from './pages/MyOrders.tsx';
import Wishlist from './pages/Wishlist.page.tsx';
import { getWishlist } from './apis/wishlist.api.ts';
import Search from './components/Search.component.tsx';
import SearchedProducts from './pages/SearchedProducts.page.tsx';
import Delivery from './pages/Delivery.page.tsx';

//const dummyUser:UserTypes = {
//  name:"Gourav",
//  email:"gourav@gmail.com",
//  mobile:"8882732859",
//  gender:"male",
//  isVerified:true,
//  role:"admin"
//};

function App() {
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isHamActive, setIsHamActive] = useState<boolean>(false);
  const {setCartData, fetchLocalCartProducts, removeProductFromLocalCart, clearLocalCart, setWishlistData} = useCart();
  const {setUser, isUserAuthenticated, isUserAdmin} = useUser();
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  async function myProfileHandler(signal?:AbortSignal) {
    const res = await myProfile(signal);
    if (res.success) {
      setUser(res.jsonData);
    }
  };

  async function getCartHandler() {
      const res = await getCart();
      if (res.success) {
        setCartData(transformCartDataForRes(res.jsonData).products);
      }
  };

  async function getWishlistHandler() {
      const res = await getWishlist();

      if (res.success) {
        setWishlistData(res.jsonData);
      }
  };

  function headerShowHideHandler() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY) {
      setIsHeaderVisible(false);
    }
    else{
      setIsHeaderVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", headerShowHideHandler);

    return() => window.removeEventListener("scroll", headerShowHideHandler);
  }, [lastScrollY]);
  
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    myProfileHandler(signal);
    //setUser(dummyUser);

    return() => {controller.abort()}
  }, []);

  useEffect(() => {
    (async () => {
      if (isUserAuthenticated()) {
        const localCartData = fetchLocalCartProducts();
  
        if (localCartData.length !== 0) {
          for (const {_id, quantity} of localCartData) {
              const data = await addToCart({productID:_id, quantity});
              if (data.success) {
                removeProductFromLocalCart({_id, quantity});
              }
          }
          clearLocalCart();
        }
        getCartHandler();
        getWishlistHandler();
      }
      else{
        fetchLocalCartProducts();
      }
    })();
}, [isUserAuthenticated()]);

  if (isSearchActive) {
    return(
      <BrowserRouter>
        <Search setIsSearchActive={setIsSearchActive} />
      </BrowserRouter>
    )
  }
  return (
    <BrowserRouter>
    <Header isHamActive={isHamActive} setIsHamActive={setIsHamActive} isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} isHeaderVisible={isHeaderVisible} />
    <Sidebar isHamActive={isHamActive} setIsHamActive={setIsHamActive} isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
    <main className="mt-[60px]">
      <Toaster />
      <Routes>
        <Route path={"/home"} element={<Home />} />
        <Route path={"/searched_products/:searchField/:searchQuery"} element={<SearchedProducts />} />
        <Route path={"/single_product/:productID"} element={<SingleProduct />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/address"} element={<Address />} />




        // Show only if user is loggedin
        <>
          <Route path={"/my_profile"} element={<MyProfile />} />
          <Route path={"/logout"} element={isUserAuthenticated()?<Logout />:<Login />} />
        </>
        <Route path={"/my_orders"} element={<MyOrders />} />
        <Route path={"/wishlist"} element={<Wishlist />} />
        

        // Show only if user is not loggedin
        {
          !isUserAuthenticated() &&
            <>
              <Route path={"/login"} element={<Login />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/verify_email/:emailVerificationToken"} element={<Verification />} />
            </>
        }


        // Show only for admin
        <Route path={"/inventory"} element={<ProtectedRoute children={<Inventory />} isUserAuthenticated={isUserAuthenticated()} isUserAdmin={isUserAdmin()} />} />
        <Route path={"/delivery"} element={<ProtectedRoute children={<Delivery />} isUserAuthenticated={isUserAuthenticated()} isUserAdmin={isUserAdmin()} />} />






        <Route path={"/*"} element={<h1>Page not found from /*</h1>} />


      </Routes>
    </main>
    <footer></footer>
    </BrowserRouter>
  )
};

export default App
