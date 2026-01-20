import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const titles = {
            '/': 'DeltaTrading | Pro Market Simulator',
            '/login': 'Login | DeltaTrading',
            '/register': 'Create Account | DeltaTrading',
            '/dashboard': 'Dashboard | DeltaTrading',
            '/about': 'About Us | DeltaTrading',
            '/contact': 'Contact Support | DeltaTrading',
            '/privacy': 'Privacy Policy | DeltaTrading',
            '/licensing': 'Licensing & Terms | DeltaTrading',
        };

        const currentPath = location.pathname;
        const title = titles[currentPath] || 'DeltaTrading | Pro Market Simulator';
        document.title = title;
    }, [location]);

    return null;
};

export default PageTitle;
