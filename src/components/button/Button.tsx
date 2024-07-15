import { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import style from './styles.module.css'
import { Spinner } from '../spinner';

type Iprops = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  classes?: string;
  isLoading?: boolean;
}

export function Button({ title, classes, isLoading = false, ...rest }: Iprops) {
  return (
    <button className={`flex-1 px-2 py-1 bg-green-600 flex items-center justify-center text-white rounded-md border-none outline-none hover:cursor-pointer hover:bg-green-700 ${classes}`} {...rest}>
      {isLoading ? (
        <Spinner />
      ) :
        title
      }
    </button>
  )

}