import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ExploreCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick?: () => void; // ✅ Add this line
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
  onClick, // ✅ Accept the onClick prop
}) => {
  return (
    <div
      onClick={onClick} // ✅ Attach the click handler
      className="cursor-pointer bg-[#1a1a2e] rounded-xl p-6 hover:shadow-md transition-shadow group"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-lg font-semibold group-hover:underline">{title}</h3>
      <p className="text-gray-400 text-sm mt-1">{description}</p>
    </div>
  );
};

export default ExploreCard;
