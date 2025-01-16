// Button.js

function Button({onClick, disabled, isLoading, text}) {
    return (
        <button
            type="submit"
            className={`w-full mt-5 bg-[#fb005b] text-white py-2 px-4 rounded-md cursor-pointer 
                        transition duration-300 ease-in-out ${isLoading ? 'opacity-50' : 'hover:bg-pink-700'}`}
            disabled={disabled || isLoading}
            onClick={onClick}
        >
            {isLoading ? 'Loading...' : text}
        </button>
    );
}

export default Button;
