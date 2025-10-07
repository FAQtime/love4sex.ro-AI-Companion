
import React from 'react';

const StoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H4.792L4.25 1H3z" />
        <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
);

export const StoreLink: React.FC = () => {
    return (
        <div className="mt-4 flex justify-center">
            <a
                href="https://love4sex.ro/wordpress/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-full text-white bg-pink-600 hover:bg-pink-700 transition-colors duration-300"
            >
                <StoreIcon />
                Explore Our Partner Store
            </a>
        </div>
    );
};
