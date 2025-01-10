"use client";
import { colors } from "@/service/colors";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const BackgroundEditor = () => {
  const colorsContainer = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleColorChange = (color: string) => {
    const targetElement = document.querySelector(".w-e-scroll");
    if (targetElement) {
      (targetElement as HTMLElement).style.setProperty(
        "background-color",
        color,
        "important" // Ensure the CSS is applied with higher specificity
      );
    }
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      colorsContainer.current &&
      !colorsContainer.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <button
        onClick={toggleDropdown}
        className="p-2 bg-transparent text-white rounded-md hover:bg-blue-300/10 focus:outline-none"
      >
        <Image
          src={"/assets/icons/paintBucket.svg"}
          alt=""
          width={16}
          height={16}
        />
      </button>

      <div className="relative mt-4 w-auto ">
        {/* Dropdown Menu */}
        {isOpen && (
          <div
            ref={colorsContainer}
            className="absolute w-48 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 grid grid-cols-10 gap-2 p-2"
          >
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className="w-4 h-4"
                style={{
                  backgroundColor: color.value,
                  border: "1px solid #ddd",
                }}
                title={color.name} // Tooltip for accessibility
              ></button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BackgroundEditor;
