// ConfirmDialog.js

import React from 'react';
import Button from "./Button";

const ConfirmDialog = ({isOpen, onClose, onConfirm, text, buttonConfirm, buttonClose}) => {
    return (
        <div
            className={`${isOpen ? 'cancel' : 'hidden'} 
            fixed inset-0 bg-black bg-opacity-80 backdrop-filter backdrop-blur-md flex items-center justify-center`}>
            <div
                className="bg-white p-4 text-center w-80
                md:w-full max-w-md  max-h-68 flex flex-col py-8
                justify-center rounded-lg shadow-md">
                <h1 className="font-bold text-black text-lg pb-4">{text}</h1>
                <div className="mt-4 flex flex-col">
                    <Button text={buttonConfirm} onClick={onConfirm} className="w-full"/>
                    <Button text={buttonClose} onClick={onClose} className="w-full"/>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
