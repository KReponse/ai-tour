// src/components/ui/Input.jsx
import React from 'react';
import clsx from 'clsx';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        'w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  );
};

export default Input;