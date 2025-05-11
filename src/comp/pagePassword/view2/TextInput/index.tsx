import React from "react";
import "./style.css";

interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  onInputChange?: (value: string) => void;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, onInputChange, ...props }, ref) => {
    return (
      <div className="textInput">
        <label htmlFor={props.id}>{label}</label>
        <input {...props} ref={ref} onChange={(e) => (onInputChange(e.target.value))} />
      </div>
    );
  }
);