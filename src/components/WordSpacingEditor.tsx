"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const WordSpacingEditor = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Word spacing options
  const spacingOptions = [
    { name: "Normal", value: "normal" },
    { name: "Small (2px)", value: "2px" },
    { name: "Medium (5px)", value: "5px" },
    { name: "Large (10px)", value: "10px" },
    { name: "Extra Large (15px)", value: "15px" },
  ];

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSpacingChange = (spacing: string) => {
    const targetElement = document.querySelector(".w-e-scroll");
    if (targetElement) {
      (targetElement as HTMLElement).style.setProperty(
        "word-spacing",
        spacing,
        "important" // Ensure the CSS is applied with higher specificity
      );
    }
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
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
        title="Word Spacing"
        className="p-2 text-white rounded-md hover:bg-blue-300/10 focus:outline-none"
      >
        <Image
          src={"/assets/icons/wordSpacing.svg"}
          alt=""
          width={16}
          height={16}
        />
      </button>

      {/* Dropdown Menu */}
      <div className="relative" ref={dropdownRef}>
        {isOpen && (
          <ul className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-md z-10">
            {spacingOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSpacingChange(option.value)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default WordSpacingEditor;
