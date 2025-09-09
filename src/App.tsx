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

function App() {
  const [isHamActive, setIsHamActive] = useState<boolean>(false);
  const {fetchLocalCartProducts, calculateTotalCartItems, calculateTotalCartValue} = useCart();


  useEffect(() => {
    fetchLocalCartProducts();
  }, []);

  return (
    <BrowserRouter>
    <Header isHamActive={isHamActive} setIsHamActive={setIsHamActive} totalCartItem={calculateTotalCartItems()} />
    <Sidebar isHamActive={isHamActive} setIsHamActive={setIsHamActive} totalCartItem={calculateTotalCartItems()} />
    <main className="border-2 border-red-500">
      <Routes>
        <Route path={"/home"} element={<Home />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/register"} element={<Register />} />
        <Route path={"/cart"} element={<Cart />} />
        <Route path={"/single_product/:productID"} element={<SingleProduct />} />
      </Routes>
    </main>
    <footer></footer>
    </BrowserRouter>
  )
}

export default App
