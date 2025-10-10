// Elements/Input.jsx
import React from "react";

const Input = ({ label, type = "text", name, placeholder, className, ...rest }) => {
  return (
    <div className="flex flex-col items-start w-[278px]">
      <label htmlFor={name} className="font-jakarta text-sm mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`w-full h-[29px] rounded-full border border-[#F4D77B] px-3 text-sm 
                focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white ${className}`}
        {...rest} 
      />
    </div>
  );
};

export default Input;