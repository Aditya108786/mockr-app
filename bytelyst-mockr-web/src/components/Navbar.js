
// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter

const Navbar = () => {
  const router = useRouter();  // Access the current route

  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Mockr</Link>
        <div>
          {/* Conditionally render links based on current route */}
          {router.pathname !== '/auth' && (
            <>
              <Link href="/auth" className="mr-4">Login</Link>
              <Link href="/auth" className='mr-4'>SignUP</Link>
            </>
          )}
          

          {router.pathname !== '/dashboard' && (
            <Link href="/dashboard" className="mr-4">Dashboard</Link>
          )}
          {router.pathname !== '/profile' && (
            <Link href="/profile" className="mr-4">Profile</Link>
          )}
          {router.pathname !== '/' && (
            <Link href="/" className="mr-4">Home</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
