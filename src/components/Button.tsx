interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ children, onClick, className = '', variant = 'primary', size = 'md' }: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 cursor-pointer border-none flex items-center justify-center';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  const variants = {
    primary: 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md active:bg-gray-300',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg',
    outline: 'border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
