import React from 'react';

export default function FormField({ label, htmlFor, error, children, required }) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && <label htmlFor={htmlFor} className="text-sm font-medium text-text-secondary dark:text-[#cbd5e1]">{label}{required && <span className="text-error ml-0.5">*</span>}</label>}
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
