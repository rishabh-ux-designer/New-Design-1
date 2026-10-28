import { useState } from "react";
import type {
  ButtonHTMLAttributes,
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

const assets = "/assets";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "disabled";
  size?: "medium" | "small" | "large";
  leadingIcon?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "medium",
  leadingIcon,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ds-button ds-button--${variant} ds-button--${size} ${className}`}
      {...props}
    >
      {leadingIcon && <img src={`${assets}/${leadingIcon}`} alt="" />}
      <span>{children}</span>
    </button>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string;
  label: string;
  variant?: "plain" | "outlined";
};

export function IconButton({
  icon,
  label,
  variant = "plain",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`ds-icon-button ds-icon-button--${variant} ${className}`}
      aria-label={label}
      {...props}
    >
      <img src={`${assets}/${icon}`} alt="" />
    </button>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  trailingIcon?: string;
  compact?: boolean;
};

export function InputField({
  label,
  trailingIcon,
  compact,
  className = "",
  ...props
}: InputProps) {
  return (
    <label className={`ds-field ${compact ? "ds-field--compact" : ""} ${className}`}>
      {label && <span className="ds-field__label">{label}</span>}
      <span className="ds-input-shell">
        <input className="ds-input" {...props} />
        {trailingIcon && <img className="ds-input__icon" src={`${assets}/${trailingIcon}`} alt="" />}
      </span>
    </label>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: ReactNode;
  placeholder: string;
  options?: string[];
};

export function SelectField({
  label,
  placeholder,
  options = [],
  className = "",
  ...props
}: SelectProps) {
  return (
    <label className={`ds-field ${className}`}>
      {label && <span className="ds-field__label">{label}</span>}
      <span className="ds-select-shell">
        <select className="ds-select" {...props}>
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <img src={`${assets}/a551b.svg`} alt="" />
      </span>
    </label>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      className={`ds-checkbox ${checked ? "ds-checkbox--checked" : ""}`}
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <img src={`${assets}/${checked ? "ba5d1.svg" : "160dc.svg"}`} alt="" />
    </button>
  );
}

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: string;
  onChange: (item: string) => void;
}) {
  return (
    <div className="ds-tabs" role="tablist">
      {items.map((item) => (
        <button
          key={item}
          className={`ds-tab ${active === item ? "ds-tab--active" : ""}`}
          role="tab"
          aria-selected={active === item}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function StatusTag({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "blue" | "green" | "neutral" | "outlined";
}) {
  return <span className={`ds-tag ds-tag--${tone}`}>{children}</span>;
}

export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="ds-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="ds-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className="ds-dialog__title" id="dialog-title">{title}</p>
        {children}
      </section>
    </div>
  );
}

export function FileDrop({
  fileName,
  onChange,
  onDrop,
}: {
  fileName: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (files: FileList) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <label
      className={`ds-file-drop ${dragging ? "is-dragging" : ""}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files.length) onDrop(event.dataTransfer.files);
      }}
    >
      <input type="file" accept=".csv,.xlsx" multiple onChange={onChange} />
      <span className="ds-file-drop__icon">
        <img src={`${assets}/13274.svg`} alt="" />
      </span>
      <span className="ds-file-drop__title">{fileName || "Click to upload or drag and drop"}</span>
      <span className="ds-file-drop__meta">CSV, XLSX up to 10MB (5 files max)</span>
    </label>
  );
}

export function SofiaHeader() {
  return (
    <header className="ds-header">
      <img className="ds-header__logo" src={`${assets}/22c5e.svg`} alt="Sofia" />
      <div className="ds-header__profile">
        <img className="ds-header__avatar" src={`${assets}/bd803.svg`} alt="" />
        <span className="ds-header__identity">
          <strong>Rishabh Negi</strong>
          <small>Client admin</small>
        </span>
        <img className="ds-header__chevron" src={`${assets}/a8cff.svg`} alt="" />
      </div>
    </header>
  );
}

export function SideNavigation() {
  const [active, setActive] = useState(0);

  return (
    <nav className="ds-side-nav" aria-label="Primary navigation">
      {Array.from({ length: 11 }).map((_, index) => (
        <button
          key={index}
          className={`ds-side-nav__item ${index === active ? "is-active" : ""}`}
          aria-label={`Navigation item ${index + 1}`}
          aria-current={index === active ? "page" : undefined}
          onClick={() => setActive(index)}
        >
          <img src={`${assets}/${index === 0 ? "4e8e6.svg" : "9d846.svg"}`} alt="" />
        </button>
      ))}
    </nav>
  );
}

export function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="ds-toast" role="status" aria-live="polite">
      <span className="ds-toast__mark">✓</span>
      <span>{message}</span>
      <IconButton icon="29646.svg" label="Dismiss notification" onClick={onDismiss} />
    </div>
  );
}
