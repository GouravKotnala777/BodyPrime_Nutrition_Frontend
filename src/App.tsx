import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.page';
import Header from './components/Header.component';

function App() {

  return (
    <BrowserRouter>
    <Header />
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
