import type { ReactNode } from 'react';
import Text from './Text';

interface FormSectionProps {
  text: string;
  children: ReactNode;
  className?: string;
}

function FormSection({ text, children, className }: FormSectionProps) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ''}`}>
      <Text text={text} className="text-sm font-medium" />
      {children}
    </label>
  );
}

export default FormSection;
