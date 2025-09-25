import React from 'react'
import SK from '../Fragments/SK';
import { useNavigate } from 'react-router-dom';


const SKLayout = () => {

  const navigate = useNavigate()

  return (
    <div className="w-screen min-h-screen bg-white">
      <header className="sticky top-0 flex items-center w-full px-5 py-4 bg-[#549AF8] text-black shadow-md">
        <button className="w-8 h-8 rounded-md hover:bg-[#2067C5] transition flex items-center justify-center mr-4 " onClick={() => navigate("/register")}>
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
        <h1 className="font-jakarta font-semibold text-lg">
          Syarat dan Ketentuan
        </h1>
      </header>
      <SK></SK>
    </div>
  );
};

export default SKLayout;
