import React, { createContext, useContext, useState } from 'react';

const SelectContext = createContext();

export const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');

  const handleValueChange = (newValue) => {
    setInternalValue(newValue);
    if (onValueChange) onValueChange(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value: internalValue, setValue: handleValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = '' }) => {
  const { open, setOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
      {children}
      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};

export const SelectContent = ({ children, className = '' }) => {
  const { open } = useContext(SelectContext);

  if (!open) return null;

  return (
    <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${className}`}>
      {children}
    </div>
  );
};

export const SelectItem = ({ children, value, className = '' }) => {
  const { setValue } = useContext(SelectContext);

  return (
    <div
      onClick={() => setValue(value)}
      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
    >
      {children}
    </div>
  );
};
