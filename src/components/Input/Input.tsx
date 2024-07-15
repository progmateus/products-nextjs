import { ForwardRefRenderFunction, InputHTMLAttributes, ReactNode, forwardRef } from "react";
import style from './styles.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string | null;
  isInvalid?: boolean;
  icon?: ReactNode;
  name: string;
  label?: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ errorMessage = null, isInvalid = false, icon, name, label, ...rest }, ref) => {
  const invalid = !!errorMessage || isInvalid;
  return (
    <div className="flex-1">
      {label && (<div className={style.label}> {label} </div>)}
      <div className="h-9 w-full rounded-md px-1 flex items-center border border-zinc-300">
        <input
          className="border-none outline-none w-full h-full text-zinc-700"
          aria-invalid={invalid}
          name={name}
          ref={ref}
          {...rest}
        />
        {icon && (icon)}
      </div>
      {
        errorMessage && (<div className="mt-2 text-red-600 max-w-full text-xs"> {errorMessage}</div>)
      }
    </div>
  )

}

export const Input = forwardRef(InputBase);