
import React from 'react';

const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 animate-pulse">
      <div className="h-48 bg-slate-700/80 rounded-lg"></div>
      <div className="mt-4 space-y-3">
        <div className="h-3 w-1/3 bg-slate-700/80 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-700/80 rounded"></div>
        <div className="h-4 w-full bg-slate-700/80 rounded"></div>
        <div className="flex gap-2 pt-2">
            <div className="h-8 w-20 bg-slate-700/80 rounded-md"></div>
            <div className="h-8 w-20 bg-slate-700/80 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
