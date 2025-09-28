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
//import type { UserTypes } from './utils/types.ts';
import Logout from './pages/Logout.page.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.component.tsx';
import Inventory from './pages/Inventory.page.tsx';
import { getCart } from './apis/cart.api.ts';
import { transformCartDataForRes } from './utils/functions.ts';
import Address from './pages/Address.page.tsx';

//const dummyUser:UserTypes = {
//  name:"Gourav",
//  email:"gourav@gmail.com",
//  mobile:"8882732859",
//  gender:"male",
//  isVerified:true,
//  role:"admin"
//};

function App() {
  const [isHamActive, setIsHamActive] = useState<boolean>(false);
  const {setCartData, fetchLocalCartProducts} = useCart();
  const {setUser, isUserAuthenticated, isUserAdmin} = useUser();

  async function myProfileHandler() {
    const res = await myProfile();
    //console.log({"res.json":res.jsonData});
    //console.log({res});
    
    setUser(res.jsonData);
  };

  async function getCartHandler() {
      const res = await getCart();

      setCartData(transformCartDataForRes(res.jsonData).products);
  };
  
  useEffect(() => {
    myProfileHandler();
    //setUser(dummyUser);
  }, []);

  useEffect(() => {
    if (isUserAuthenticated()) {
        getCartHandler();
    }
    else{
        fetchLocalCartProducts();
        //setCartData(res);
    }
}, [isUserAuthenticated()]);

  return (
    <BrowserRouter>
    <Header isHamActive={isHamActive} setIsHamActive={setIsHamActive} />
    <Sidebar isHamActive={isHamActive} setIsHamActive={setIsHamActive} />
    <main className="border-2 border-red-500">
      <Routes>
        <Route path={"/home"} element={<Home />} />
        <Route path={"/single_product/:productID"} element={<SingleProduct />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/address"} element={<Address />} />




        // Show only if user is loggedin
        <>
          <Route path={"/my_profile"} element={isUserAuthenticated()?<MyProfile />:<Login />} />
          <Route path={"/logout"} element={isUserAuthenticated()?<Logout />:<Login />} />
        </>
        

        // Show only if user is not loggedin
        {
          !isUserAuthenticated() &&
            <>
              <Route path={"/login"} element={<Login />} />
              <Route path={"/register"} element={<Register />} />
            </>
        }


        // Show only for admin
        <Route path={"/inventory"} element={<ProtectedRoute children={<Inventory />} isUserAuthenticated={isUserAuthenticated()} isUserAdmin={isUserAdmin()} />} />






        <Route path={"/*"} element={<h1>Page not found from /*</h1>} />


      </Routes>
    </main>
    <footer></footer>
    </BrowserRouter>
  )
};

export default App
