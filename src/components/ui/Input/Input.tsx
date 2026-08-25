import type { BaseComponentProps } from '@/types';
import { cn } from '@/utils';
import './Input.css';

/* ================================================== */
/* INPUT COMPONENT                                      */
/* ================================================== */

interface InputProps extends BaseComponentProps {
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export function Input({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  multiline = false,
  rows = 4,
  className,
  id,
}: InputProps) {
  const inputId = id || `input-${name}`;

  return (
    <div className={cn('input-group', error && 'input-group--error', className)}>
      {label && (
        <label htmlFor={inputId} className="input-group__label">
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}

      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          className="input-group__field input-group__textarea"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows={rows}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          className="input-group__field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      )}

      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}
