import { cn } from '@/core/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner = ({ className, size = 'md' }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={cn(
          'animate-spin rounded-full border-b-2 border-gray-900',
          {
            'h-4 w-4 border-2': size === 'sm',
            'h-8 w-8 border-2': size === 'md',
            'h-12 w-12 border-4': size === 'lg',
          },
          className
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
