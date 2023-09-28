import React, { forwardRef } from 'react';
import clsx from 'clsx';
import type { FC } from 'react';
import { useController } from 'react-hook-form';

export type InputProps = {
  label?: string;
  name?: string;
  id?: string;
  as?: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  isRequired: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorText?: string;
  onFocus?: () => void;
  control?: any;
};

export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      isRequired,
      label,
      id = 'title',
      as = 'input',
      name = 'title',
      type = 'text',
      placeholder = '',
      className,
      inputClassName = '',
      labelClassName = '',
      defaultValue,
      errorText,
      onFocus,
      control,
      ...restInputProps
    },
    ref,
  ) => {
    const {
      field: { value },
      fieldState: { isTouched },
    } = useController({
      name,
      control,
    });

    return (
      <div
        className={clsx(
          'relative flex tablet:flex-row flex-col gap-2 tablet:gap-0 tablet:justify-between tablet:items-center w-full p-0',
          className,
        )}
      >
        {label && (
          <label
            className={clsx(
              isTouched && !value
                ? 'top-[20px] left-[13px]'
                : !value
                ? 'top-[20px] left-[13px]'
                : '-top-[7px] left-[0] -translate-y-0 translate-x-0 scale-[0.8]',
              !errorText ? 'text-gray-80' : 'text-errorText',
              'absolute  leading-[0] cursor-text bg-white left-8  -translate-y-1/2 scale-100 text-parS transition-top transition-left transition-transform duration-300 ease-in-out',
            )}
            htmlFor={name}
          >
            {label}
          </label>
        )}
        {as === 'input' ? (
          <input
            type={type}
            id={name}
            defaultValue={defaultValue}
            required={isRequired}
            placeholder={placeholder}
            name={name}
            className={clsx(
              className,
              !errorText ? 'border-gray-80' : 'border-error-80',
              'py-3 px-1 h-10 indent-2 shadow-md text-dark-100 shadow-dark-60 w-full laptop:w-[390px] desktop:w-full  text-parS border bg-none rounded-lg placeholder:text-parS placeholder:font-normal focus:border-orange-40 focus:ring-orange-40 focus:ring-1 focus:outline-none autofill:text-pars',
            )}
            onFocus={onFocus}
            {...restInputProps}
            ref={ref}
          />
        ) : (
          <textarea
            id={id}
            required={isRequired}
            placeholder={placeholder}
            name={name}
            className={clsx(
              className,
              as === 'textarea'
                ? 'tablet:h-[390px] desktop:w-full h-[120px] overflow-y-scroll resize-none px-2 '
                : 'px-1',
              !errorText ? 'border-gray-80' : 'border-error-80',
              'py-3 h-10 shadow-md text-dark-100 shadow-dark-60 w-full laptop:w-[390px] desktop:w-full indent-1.5 text-parS border bg-none rounded-lg placeholder:text-parS placeholder:font-normal focus:border-orange-40 focus:ring-orange-40 focus:ring-1 focus:outline-none autofill:text-pars',
            )}
            onFocus={onFocus}
            {...restInputProps}
            //@ts-ignore
            ref={ref}
          />
        )}
        {errorText ? (
          <div className="absolute -bottom-5 text-errorText tablet:text-quot text-[10px] right-2 truncate">
            {errorText}
          </div>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
