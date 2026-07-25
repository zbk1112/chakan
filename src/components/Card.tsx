interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ title, children, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 ${className} ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`} 
      onClick={onClick}
    >
      {title && (
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-3.5">
          <h2 className="text-lg md:text-xl font-bold flex items-center">
            {title}
          </h2>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}
