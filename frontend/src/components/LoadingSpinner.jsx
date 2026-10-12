import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = "Loading campus items...", size = 32 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
      <Loader2 size={size} className="animate-spin text-campus-600 mb-2" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
