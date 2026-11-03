import React from 'react';

export default function LayoutPublik({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
        {children}
      </main>
    </div>
  );
}
