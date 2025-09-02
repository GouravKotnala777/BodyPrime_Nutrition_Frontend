import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
    <header
      className="border-2 border-violet-500 flex justify-between items-center"
    >
      <section className="border-2 border-indigo-500 ">
        <img className="w-[60px] h-[60px]" src={viteLogo} alt={viteLogo} />
      </section>
      <section
        className="border-2 border-blue-500 "
      >
        <nav className="border-2 border-green-500 flex w-[500px] justify-around">
          <div className="nav_item">Home</div>
          <div className="nav_item">Profile</div>
          <div className="nav_item">Orders</div>
          <div className="nav_item">Register</div>
          <div className="nav_item">Login</div>
        </nav>
      </section>
    </header>
    <main>
      <h1>Hello</h1>
      <p>my name is gourav</p>
    </main>
    <footer></footer>
    </>
  )
}

export default App
