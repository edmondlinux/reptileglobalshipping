import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  errorKey: string;
  params?: Record<string, string | number>;
  className?: string;
}

export const ErrorMessage = ({ errorKey, params, className }: ErrorMessageProps) => {
  const t = useTranslations('Errors');

  try {
    return (
      <div className={cn("flex items-center gap-2 text-destructive text-sm font-medium", className)}>
        <AlertCircle className="h-4 w-4" />
        <span>{t(errorKey, params)}</span>
      </div>
    );
  } catch (e) {
    // Fallback if key is missing or translation fails
    return (
      <div className={cn("flex items-center gap-2 text-destructive text-sm font-medium", className)}>
        <AlertCircle className="h-4 w-4" />
        <span>{errorKey}</span>
      </div>
    );
  }
};
