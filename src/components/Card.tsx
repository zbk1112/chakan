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
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 md:px-5 py-2.5 md:py-3.5">
          <h2 className="text-base md:text-lg xl:text-xl font-bold flex items-center">
            {title}
          </h2>
        </div>
      )}
      <div className="p-3 md:p-5">
        {children}
      </div>
    </div>
  );
}
