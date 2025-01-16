// StatusMessage.js

import React from 'react';

function StatusMessage({message, isSuccess}) {
    const bgColor = isSuccess ? 'bg-[#14a800]' : 'bg-[#DC2626]';

    return (
        <div className={`${bgColor} text-white p-4 rounded-md text-center mb-6`}>
            <p className="text-md">{message}</p>
        </div>
    );
}

export default StatusMessage;
