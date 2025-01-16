// Snackbar.js

import React, {useState, useEffect} from 'react';

const Snackbar = ({message}) => {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const staticIcon = <img src={process.env.PUBLIC_URL + '/tick-circle.svg'} alt="Tick Circle"/>;
    return (
        <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 
        bg-[#14a800] text-white px-4 py-2 rounded 
        ${isOpen ? 'opacity-100' : 'opacity-0'} 
        transition-opacity ease-in-out duration-300`}>
            <div className="flex items-center">
                <div className="mr-2">{staticIcon}</div>
                <div className="flex-1">{message}</div>
                <div className="cursor-pointer ml-2 text-red-500 text-xl" onClick={handleClose}>
                    &times;
                </div>
            </div>
        </div>
    );
};

export default Snackbar;

