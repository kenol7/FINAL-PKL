const LoginLayout = (props) => {
  const { title, children, height = "640px", onBack } = props;

  return (
    <div
      className="bg-[#549AF8] w-[406px] rounded-lg shadow-lg flex flex-col items-center px-8 pt-5 pb-8 relative"
      style={{ height }}
    >
      <button
        onClick={onBack}
        className="w-[24px] h-[24px] rounded-md hover:bg-[#2067C5] transition absolute top-5 left-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <h1 className="font-jakarta font-semibold text-[20px] text-center mb-1">
        {title}
      </h1>

      {children}
    </div>
  );
};

export default LoginLayout;
