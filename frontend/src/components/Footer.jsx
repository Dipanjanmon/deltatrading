import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-900 mt-auto">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-bold whitespace-nowrap text-white">DeltaTrading</span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <Link to="/about" className="hover:underline me-4 md:me-6 hover:text-emerald-400">About</Link>
                        </li>
                        <li>
                            <Link to="/privacy" className="hover:underline me-4 md:me-6 hover:text-emerald-400">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/licensing" className="hover:underline me-4 md:me-6 hover:text-emerald-400">Licensing</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:underline hover:text-emerald-400">Contact</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-slate-800 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2026 <Link to="/" className="hover:underline">DeltaTrading™</Link>. All Rights Reserved.</span>
            </div>
        </footer>
    );
}
