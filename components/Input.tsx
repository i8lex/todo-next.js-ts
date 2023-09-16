import React, { useState, useEffect, FC } from 'react';
import { Field, useField } from 'formik';
import clsx from 'clsx';

type InputProps = {
  name: string;
  id?: string;
  as?: string;
  label: string;
  required?: boolean;
  type?: string;
  step?: number;
  defaultValue?: string;
  className?: string;
};

export const Input: FC<InputProps> = ({
  className,
  name,
  id,
  as = 'input',
  label = '',
  required = false,
  type = 'text',
  step,
  defaultValue,
}) => {
  const [{ onChange, onBlur, value }, { touched, error }] = useField(name);
  const isErrorShown = touched && !!error;
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(!isInputFocused);
  };

  return (
    <div className="relative w-full">
      <Field
        id={id}
        className={clsx(
          className,
          !isErrorShown ? 'border-gray-80' : 'border-error-80',
          'py-3 h-10 shadow-md text-dark-100 shadow-dark-60 px-1 w-full tablet:w-[390px] indent-6 text-parS border bg-none rounded-lg placeholder:text-parS placeholder:font-normal focus:border-orange-40 focus:ring-orange-40 focus:ring-1 focus:outline-none autofill:text-pars',
        )}
        as={as}
        required={required}
        type={type}
        onChange={onChange}
        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleInputFocus();
          onBlur(event);
        }}
        onFocus={handleInputFocus}
        value={value}
        name={name}
        step={step}
        defaultValue={defaultValue}
      />
      {label && (
        <label
          className={clsx(
            isInputFocused && !value
              ? 'top-[50%]'
              : !value
              ? 'top-[50%]'
              : '-top-[7px] left-[3px] -translate-y-0 translate-x-0 scale-[0.8]',
            !isErrorShown ? 'text-gray-80' : 'text-errorText',
            'absolute  leading-[0] cursor-text bg-white left-8  -translate-y-1/2 scale-100 text-parS transition-top transition-left transition-transform duration-300 ease-in-out',
          )}
          htmlFor={name}
        >
          {label}
        </label>
      )}

      {isErrorShown ? (
        <div className="absolute -bottom-5 text-errorText text-quot right-2 ">
          {error}
        </div>
      ) : null}
    </div>
  );
};
