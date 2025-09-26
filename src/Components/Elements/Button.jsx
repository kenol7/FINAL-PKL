const Button = (props) => {
  const { children, className, type = "button", ...rest } = props;
  
  return (
    <button
      className={`h-[45px] w-[114px] px-4 py-2 rounded-xl shadow-md font-jakarta text-sm font-medium text-black 
                 bg-[#F4D77B] hover:shadow-lg transition ${className}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;