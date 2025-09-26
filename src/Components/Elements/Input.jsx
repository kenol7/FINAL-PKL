const Input = ({ label, type, name, placeholder, className,value,onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value)
  }


  return (
    <div className="flex flex-col items-start w-[278px]">
      <label htmlFor={name} className="font-jakarta text-sm mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        id={name}
        placeholder={placeholder}
        onChange={handleChange}
        className={`w-full h-[29px] rounded-full border border-[#F4D77B] px-3 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white ${className}`}
      />
    </div>
  );

  }
export default Input;