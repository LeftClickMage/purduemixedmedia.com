import type { ReactNode } from 'react';

type CommonProps = {
  name: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
};

type InputProps = CommonProps & {
  as?: 'input';
  type?: string;
};

type TextareaProps = CommonProps & {
  as: 'textarea';
  rows?: number;
};

type SelectProps = CommonProps & {
  as: 'select';
  children: ReactNode;
};

type FormInputProps = InputProps | TextareaProps | SelectProps;

const baseClasses = 'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black';

function FormInput(props: FormInputProps) {
  const className = `${baseClasses} ${props.className ?? ''}`;

  if (props.as === 'textarea') {
    return (
      <textarea
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue}
        rows={props.rows}
        className={`${className} resize-none overflow-y-auto`}
      />
    );
  }

  if (props.as === 'select') {
    return (
      <select
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue}
        className={`${className} bg-white`}
      >
        {props.children}
      </select>
    );
  }

  return (
    <input
      type={props.type ?? 'text'}
      name={props.name}
      required={props.required}
      defaultValue={props.defaultValue}
      className={className}
    />
  );
}

export default FormInput;
