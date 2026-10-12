import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, count, size = 16, interactive = false, onSelect }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((star) => (
          <Star
            key={star}
            size={size}
            onClick={() => interactive && onSelect && onSelect(star)}
            className={`${
              star <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-slate-500 font-medium ml-1">
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
