import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.page';
import Login from './pages/Login.page.tsx';
import Register from './pages/Register.page.tsx';
import Header from './components/Header.component';
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
import { transformCartDataForRes, transformWishlistDataForRes } from './utils/functions.ts';
import Address from './pages/Address.page.tsx';
import Verification from './pages/Verification.page.tsx';
import {Toaster} from "react-hot-toast";
import MyOrders from './pages/MyOrders.tsx';
import Wishlist from './pages/Wishlist.page.tsx';
import { getWishlist } from './apis/wishlist.api.ts';
import SearchedProducts from './pages/SearchedProducts.page.tsx';
import Delivery from './pages/Delivery.page.tsx';
import Landing from './pages/Landing.page.tsx';
import Authenticity from './pages/Authenticity.page.tsx';
import ProductVariantDialog from './components/ProductVariantsDialog.component.tsx';
import RatingFormModal from './components/RatingFormModal.component.tsx';
import AddressFormModal from './components/AddressFormModal.component.tsx';

//const dummyUser:UserTypes = {
//  name:"Gourav",
//  email:"gourav@gmail.com",
//  mobile:"8882732859",
//  gender:"male",
//  isVerified:true,
//  role:"admin"
//};

function App() {
  const {cartData, setCartData, addToLocalCart, calculateTotalCartItems, fetchLocalCartProducts, removeProductFromLocalCart, clearLocalCart, setWishlistData} = useCart();
  const {setUser, isUserAuthenticated, isUserAdmin} = useUser();
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  //const [selectedProduct, setSelectedProduct] = useState<string|null>(null);
      
  async function myProfileHandler() {
    //console.log("fetching profile......");
    const res = await myProfile();
    console.log(res);
    
    fetchCartDataHandler(res.jsonData?.isVerified||false);
    if (res.success) {
      setUser(res.jsonData);
    }
  };

  async function fetchCartDataHandler(isUserAuthenticated:boolean) {
    //console.log(isUserAuthenticated);
    
    setTimeout(async() => {
      //console.log(isUserAuthenticated);
      if (isUserAuthenticated) {
        await transferFromLocalCartToRemote();
        await fetchRemoteCartProducts();
      }
      else{
        const localCartData = fetchLocalCartProducts();
        setCartData(localCartData);
      }
      getWishlistHandler();
    }, 3000);
  };

  async function fetchRemoteCartProducts() {
    //console.log("fetching remote cart......");
    
    const res = await getCart();
    if (res.success) {
      setCartData(transformCartDataForRes(res.jsonData).products);
    }
  };

  async function transferFromLocalCartToRemote() {
    const localCartData = fetchLocalCartProducts();
    if (localCartData.length !== 0) {
      for (const {_id, variant, quantity} of localCartData) {
        const data = await addToCart({productID:_id, variant, quantity});
        if (data.success) {
          removeProductFromLocalCart({_id, variant, quantity});
        }
      }
      clearLocalCart();
    }
  };

  async function getWishlistHandler() {
    console.log("fetching widhlist......");
    const res = await getWishlist();

    if (res.success) {
      setWishlistData(transformWishlistDataForRes(res.jsonData).products);
    }else{
      console.log("error from getWishlistHandler");
      console.log(res.message);
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
    //const controller = new AbortController();
    //const signal = controller.signal;
    //let timer = 0;
    //timer = setTimeout(() => {
      myProfileHandler();
    //}, 1000);
    //myProfileHandler(signal);
    //setUser(dummyUser);

    //return() => clearTimeout(timer);
    //return() => {controller.abort()}
  }, []);

  return (
    <BrowserRouter>
    <Header isHeaderVisible={isHeaderVisible} />
    {/*<Sidebar isHamActive={isHamActive} setIsHamActive={setIsHamActive} isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />*/}
    <main className="mt-[60px]">
    {/*<main className="max-w-3xl mt-[60px] mx-auto">*/}
      <Toaster />
      <Routes>
        <Route path={"/"} element={<Landing />} />
        <Route path={"/home"} element={<Home />} />
        <Route path={"/searched_products/:searchField/:searchQuery/:subCategory"} element={<SearchedProducts />} />
        <Route path={"/single_product/:productID"} element={<SingleProduct />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/address"} element={<Address />} />
        <Route path={"/authenticity"} element={<Authenticity />} />




        {/* Show only if user is loggedin */}
        <>
          <Route path={"/my_profile"} element={<MyProfile />} />
          <Route path={"/wishlist"} element={isUserAuthenticated()?<Wishlist />:<Login />} />
          <Route path={"/logout"} element={isUserAuthenticated()?<Logout />:<Login />} />
        </>
        <Route path={"/my_orders"} element={<MyOrders />} />
        

        {/* Show only if user is not loggedin */}
        {
          !isUserAuthenticated() &&
            <>
              <Route path={"/login"} element={<Login />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/verify_email/:emailVerificationToken"} element={<Verification />} />
            </>
        }


        {/* Show only for admin */}
        <Route path={"/inventory"} element={<ProtectedRoute children={<Inventory />} isUserAuthenticated={isUserAuthenticated()} isUserAdmin={isUserAdmin()} />} />
        <Route path={"/delivery"} element={<ProtectedRoute children={<Delivery />} isUserAuthenticated={isUserAuthenticated()} isUserAdmin={isUserAdmin()} />} />






        <Route path={"/*"} element={<h1>Page not found from /*</h1>} />


      </Routes>
    </main>
    {/* product variant options dialog box */}
    <ProductVariantDialog addToLocalCart={addToLocalCart} removeProductFromLocalCart={removeProductFromLocalCart} cartData={cartData} setCartData={setCartData} isUserAuthenticated={isUserAuthenticated()} setWishlistData={setWishlistData} totalCartItems={calculateTotalCartItems()} />
    {/* rating form modal */}
    <RatingFormModal />
    {/* address form modal */}
    <AddressFormModal />
    <footer></footer>
    </BrowserRouter>
  )
};

export default App
