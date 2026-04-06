import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", fullWidth = false, children, ...props },
    ref
  ) => {
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;
    const fullWidthClass = fullWidth ? "btn--fullWidth" : "";

    const combinedClasses = ["btn", variantClass, sizeClass, fullWidthClass, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
