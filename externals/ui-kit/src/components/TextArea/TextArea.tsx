import React from "react";
import "./TextArea.css";

export interface ButtonProps  {
  size?: "xl" | "l" | "s" | 'xs';
  text?: string;
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
   onChange: (
    value: string
  ) => void;
};

/**
 * Primary UI component for user interaction
 */
const Button = ({
  size = "l",
  text,
  onChange,
  label,
}: ButtonProps) => {

  return (
    <div>
    <div >{label}</div>
    <textarea onChange={(e) => onChange(e.target.value || '')}>{text}</textarea>
    </div>

  );
};

export default Button;
