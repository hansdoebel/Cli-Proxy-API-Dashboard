import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Accepted for existing call sites. Explanatory hints are not rendered. */
  hint?: ReactNode;
  /**
   * A line that always stays visible under the input, independent of `hint`. For text that
   * must be on the page: security notes, destructive consequences, or anything containing a
   * link or other interactive content (a tooltip cannot hold those). Also describes the input.
   */
  note?: ReactNode;
  error?: string;
  rightElement?: ReactNode;
}

export function Input({
  label,
  hint: _unusedHint,
  note,
  error,
  rightElement,
  className = '',
  id,
  ...rest
}: InputProps) {
  void _unusedHint;
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const noteId = note ? `${inputId}-note` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [rest['aria-describedby'], errorId, noteId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          id={inputId}
          className={`input ${className}`.trim()}
          aria-invalid={Boolean(error) || rest['aria-invalid']}
          aria-describedby={describedBy}
          {...rest}
        />
        {rightElement && (
          <div
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
          >
            {rightElement}
          </div>
        )}
      </div>
      {note && (
        <div id={noteId} className="hint">
          {note}
        </div>
      )}
      {error && (
        <div id={errorId} className="error-box">
          {error}
        </div>
      )}
    </div>
  );
}
