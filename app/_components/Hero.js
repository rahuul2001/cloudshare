import React from "react";
import Constant from "../_utils/Constant.js";

function Hero() {
  return (
    <section className="bg-[#f7a1a1] min-h-screen flex items-center">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl font-extrabold sm:text-6xl text-white">
            Share Files 
            <strong className="block text-primary mt-2">
              Instantly & Securely
            </strong>
          </h1>

          <p className="mt-4 text-gray-100 sm:text-2xl font-bold">
            {Constant.desc}
          </p>


          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="transition block w-full rounded bg-primary hover:bg-gray-100 hover:text-primary px-12 py-3 text-md font-medium text-white shadow focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
              href="/files"
            >
              Get Started
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
