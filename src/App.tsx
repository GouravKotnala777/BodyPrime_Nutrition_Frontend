import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.page';
import Login from './pages/Login.page.tsx';
import Register from './pages/Register.page.tsx';
import Header from './components/Header.component';
import Sidebar from './components/Sidebar.component';
import { useEffect, useState, type ReactNode } from 'react';
import Cart from './pages/Cart.page.tsx';
import SingleProduct from './pages/SingleProduct.page.tsx';
import { useCart } from './contexts/CartContext.tsx';
import { myProfile } from './apis/user.api.ts';
import { useUser } from './contexts/UserContext.tsx';
import MyProfile from './pages/MyProfile.page.tsx';
import type { UserTypes } from './utils/types.ts';
import { ProtectedRoute } from './components/ProtectedRoute.component.tsx';
import Logout from './pages/Logout.page.tsx';

const dummyUser:UserTypes = {
  name:"Gourav",
  email:"gourav@gmail.com",
  mobile:"8882732859",
  gender:"male",
  isVerified:true,
  role:"user"
};

function App() {
  const [isHamActive, setIsHamActive] = useState<boolean>(false);
  const {fetchLocalCartProducts} = useCart();
  const {setUser, isUserAuthenticated, isUserAdmin} = useUser();

  async function myProfileHandler() {
    const res = await myProfile();
    //setUser(res.jsonData);
  };
  
  useEffect(() => {
    //fetchLocalCartProducts();
    //myProfileHandler();
    setUser(dummyUser);
  }, []);

  return (
    <BrowserRouter>
    <Header isHamActive={isHamActive} setIsHamActive={setIsHamActive} />
    <Sidebar isHamActive={isHamActive} setIsHamActive={setIsHamActive} />
    <main className="border-2 border-red-500">
      <Routes>
        <Route path={"/home"} element={<Home />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/single_product/:productID"} element={<SingleProduct />} />
        <Route path={"/my_profile"} element={
          <ProtectedRoute children={<MyProfile />} isUserAuthenticated={isUserAuthenticated()} />
        } />

        <Route path={"/logout"} element={
          <ProtectedRoute children={<Logout />} isUserAuthenticated={isUserAuthenticated()} />
        } />



        // Show only if user is not loggedin
        {
          !isUserAuthenticated() &&
            <>
              <Route path={"/login"} element={<Login />} />
              <Route path={"/register"} element={<Register />} />
            </>
        }

      </Routes>
    </main>
    <footer></footer>
    </BrowserRouter>
  )
};

export default App
