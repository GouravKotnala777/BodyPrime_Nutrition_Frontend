import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.page';
import Header from './components/Header.component';
import Sidebar from './components/Sidebar.component';
import { useState } from 'react';

function App() {
  const [isHamActive, setIsHamActive] = useState<boolean>(false);

  return (
    <BrowserRouter>
    <Header isHamActive={isHamActive} setIsHamActive={setIsHamActive} />
    <Sidebar isHamActive={isHamActive} setIsHamActive={setIsHamActive} />
    <main className="border-2 border-red-500">
      <Routes>
        <Route path={"/home"} element={<Home />} />
      </Routes>
    </main>
    <footer></footer>
    </BrowserRouter>
  )
}

export default App
