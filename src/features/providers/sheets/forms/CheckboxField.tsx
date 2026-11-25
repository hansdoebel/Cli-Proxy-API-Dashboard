import type { ReactNode } from 'react';
import styles from './sharedForm.module.scss';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  /**
   * Explanation carried by an InfoTip after the label. The checkbox stays described by a
   * hidden copy, so assistive tech hears it on the checkbox itself.
   */
  hint?: ReactNode;
}

/**
 * Switch row for the provider forms (a checkbox presented as a switch); the InfoTip sits
 * outside the `<label>` so it never leaks into the control's accessible name.
 */
export function CheckboxField({ label, checked, disabled, onChange }: CheckboxFieldProps) {
  return (
    <label className={styles.checkboxRow}>
      <input
        type="checkbox"
        role="switch"
        className={styles.checkboxBox}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.checkboxText}>{label}</span>
    </label>
  );
}
