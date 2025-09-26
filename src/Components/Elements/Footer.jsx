import { Flex, Text, Link, Box, Heading } from "@radix-ui/themes";
import Logo from "../../assets/logo.png";
import React from "react";
import Instagram from "../../assets/instagram.png";
import Facebook from "../../assets/facebook.png";
import X from "../../assets/x.png";

export default function Footer() {
  return (
    <footer className="bg-amber-100">
      <div className="md:flex md:justify-between md:text-left text-center lg:space-y-0 md:space-y-0 space-y-2 xl:px-40 lg:px-20 md:px-10 pt-5">
        <div className="flex justify-center">
          <img src={Logo} width="50" height="40" />
        </div>
        <div className="lg:flex md:flex xl:gap-40 lg:gap-20 md:gap-10 lg:space-y-0 md:space-y-0 space-y-2">
          <div className="flex flex-col">
            <h3 className="font-medium text-gray-900">Tentang Kita</h3>
            <a href="" className="text-gray-600">
              Tentang Kita
            </a>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-gray-900">Produk</h3>
            <a href="" className="text-gray-600">
              Beli Rumah
            </a>
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-gray-900">Lainnya</h3>
            <a href="" className="text-gray-600">
              Syarat dan Ketentuan
            </a>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-medium text-gray-900">Ikuti Kita</h3>
          <div className="flex gap-4 justify-center">
            <div className="border-2 border-r-black rounded-full p-1.5">
              <img src={Facebook} width="20px" height="20px" />
            </div>
            <div className="border-2 border-r-black rounded-full p-1.5">
              <img src={Instagram} width="20px" height="20px" />
            </div>
            <div className="border-2 border-r-black rounded-full p-1.5">
              <img src={X} width="20px" height="20px" />
            </div>
          </div>
        </div>
      </div>
      <div className="py-7">
        <div className="bg-black h-[1px] w-auto" />
      </div>
      <Flex justify="center" pb="30px">
        <Text>&copy; 2025. Hak Cipta dilindungi Undang-Undang</Text>
      </Flex>
    </footer>
  );
}
