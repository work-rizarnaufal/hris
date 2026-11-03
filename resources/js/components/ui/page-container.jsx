import React from 'react';

export function PageContainer({
  children,
  maxWidth = 'max-w-[1600px]',
  className = '',
}) {
  return (
    <div className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 ${className}`}>
      {children}
    </div>
  );
}

export default PageContainer;

