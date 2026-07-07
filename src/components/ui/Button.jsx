import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, text
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyle = "font-label-md text-label-md px-8 py-4 uppercase tracking-widest whitespace-nowrap transition-all duration-300 relative overflow-hidden font-bold select-none cursor-pointer flex items-center justify-center gap-2 border-0 rounded-none ripple disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#361f1a] text-white hover:bg-[#4e342e]",
    secondary: "bg-[#c59e62] text-primary hover:bg-[#ffdeae] hover:text-[#361f1a]",
    outline: "bg-transparent text-[#361f1a] border border-[#c59e62] hover:bg-[#361f1a]/5",
    text: "bg-transparent text-secondary hover:text-primary hover:bg-[#361f1a]/5 border-0 px-4 py-2"
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${selectedVariant} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </button>
  );
}
