import React from 'react';

export const Textarea = React.forwardRef(({ 
  className = '', 
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
