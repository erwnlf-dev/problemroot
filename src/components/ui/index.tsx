import React from 'react';

export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded px-3 py-2 focus:outline-none focus:border-zinc-700 ${props.className || ''}`}
    />
  );
}

export function Btn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded px-4 py-2 transition-colors ${props.className || ''}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
