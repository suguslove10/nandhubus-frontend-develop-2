import Image from "next/image";
import React from "react";
import connection_error from "../../app/assests/images/connection_losed.png";

interface ConnectionErrorProps {
  handleReload?: () => Promise<void>;
}

function ConnectionError({ handleReload }: ConnectionErrorProps) {
  return (
    <div className="w-full h-screen bg-white relative">
      <Image
        src={connection_error}
        alt="page_not_found"
        className="max-w-[400px] h-auto w-full mx-auto mt-[100px] md:max-w-[600px] md:mt-[100px]"
      />
      <div className="mx-auto max-w-[500px] w-full flex flex-col items-center mt-7 justify-center gap-[10px]">
        <h1 className="text-xl font-medium text-[#91C1D7] text-center">
          Oops !! Something went wrong
        </h1>
        <button
          onClick={handleReload}
          className="bg-[#0f7bab] text-white px-10 py-2 md:py-4 mt-7"
        >
          Reload the page
        </button>
      </div>
    </div>
  );
}

export default ConnectionError;
