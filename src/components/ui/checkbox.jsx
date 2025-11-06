import React from 'react';

export const Checkbox = React.forwardRef(({ 
  className = '', 
  checked,
  onCheckedChange,
  ...props 
}, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
});

Checkbox.displayName = 'Checkbox';
