import React, { useRef, useState, useEffect } from "react";

export default function OtpInput({ value, onChange }) {
  const inputsRef = useRef([]);
  const [internalValue, setInternalValue] = useState(new Array(6).fill(""));

  useEffect(() => {
    if (value && value.length === 6) {
      setInternalValue(value.split(""));
    }
  }, [value]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    const newOtp = [...internalValue];
    newOtp[index] = val;
    setInternalValue(newOtp);
    onChange(newOtp.join(""));
    if (val && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...internalValue];

      if (newOtp[index] !== "") {
        newOtp[index] = "";
        setInternalValue(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    const arr = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setInternalValue(arr);
    onChange(arr.join(""));
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {internalValue.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold 
          border rounded-xl transition-all duration-200
          
          /* Dark Theme Styling to match Reference */
          bg-white/5 
          border-white/10 
          text-white 
          placeholder-gray-500
          
          /* Focus States */
          focus:outline-none 
          focus:bg-white/10 
          focus:border-violet-500/50
          focus:ring-2 focus:ring-violet-500/50`}
        />
      ))}
    </div>
  );
}