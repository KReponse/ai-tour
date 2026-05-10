// src/components/ui/Card.jsx
import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, hover = true }) => {
  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden',
      hover && 'transition-all duration-300 hover:shadow-xl hover:scale-105',
      className
    )}>
      {children}
    </div>
  );
};

export const CardImage = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={clsx('w-full h-48 object-cover', className)} />
);

export const CardContent = ({ children, className }) => (
  <div className={clsx('p-6', className)}>{children}</div>
);

export default Card;