import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const Button: React.FC<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = (props) => {
  const { className, ...others } = props;
  return (
    <button
      className={
        "px-4 py-2 disabled:bg-gray-500 bg-blue-500 rounded hover:bg-blue-600 text-white " +
        className
      }
      {...others}
    >
      {props.children}
    </button>
  );
};
