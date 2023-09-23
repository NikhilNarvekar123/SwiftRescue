import { Link } from "react-router-dom";

function Landing() {
  return (
    <main class="flex min-h-screen w-full items-center justify-center bg-gray-100">

    <Link to='/app'>
    <button class="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
        Mobile Site
        <div class="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
    </button>
    </Link>
    
    <div className='w-20'></div>

    <Link to='/dashboard'>
    <button class="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
        Dashboard
        <div class="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
    </button>
    </Link>

    <div className='w-20'></div>

    <Link to='/accountcreation'>
    <button class="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
        Account Creation
        <div class="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
    </button>
    </Link>

    </main>
  );
}

export default Landing;
