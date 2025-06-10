import React from "react";
import Image from "next/image";
import not_found from "./assests/images/not_found.png";
import Link from "next/link";

function NotFound() {
  return (
    <div className="w-full h-screen bg-white relative">
      <Image
        src={not_found}
        alt="page_not_found"
        className="max-w-[200px] h-auto w-full mx-auto mt-[100px] md:max-w-[400px] md:mt-[50px]"
      />
      <div className="mx-auto max-w-[500px] w-full flex flex-col items-center justify-center gap-[10px]">
        <h1 className="text-xl font-medium text-[#91C1D7] text-center">
          Page Not Found
        </h1>
        <Link
          href={"/"}
          className="text-[#303030]  hover:underline text-center text-sm"
        >
          Please click <span className="text-[#0f7bab]">here</span> to go to the
          home page.
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
