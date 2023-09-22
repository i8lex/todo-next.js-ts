import React, { FC, Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

type ListBoxProps = {
  className?: string;
  valuesArray: { label: string; value: string }[];
  field: any;
  defaultValue?: string;
  label?: string;
  svg?: React.ReactNode;
};

export const ListBox: FC<ListBoxProps> = ({
  className,
  valuesArray,
  field,
  label,
  defaultValue,
  svg = (
    <ChevronUpDownIcon className="h-5 w-5 text-dark-80" aria-hidden="true" />
  ),
}) => {
  const [selected, setSelected] = useState(
    valuesArray.find((value) => value.value === defaultValue) || valuesArray[0],
  );
  return (
    <Listbox
      {...field}
      onChange={(value) => {
        field.onChange(value);
      }}
    >
      <div className={clsx(className, 'relative')}>
        {label ? (
          <div
            className={
              'absolute text-gray-80 -top-[7px] left-[0] -translate-y-0 translate-x-0 scale-[0.8] leading-[0] cursor-text bg-white  text-parS transition-top transition-left transition-transform duration-300 ease-in-out'
            }
          >
            {label}
          </div>
        ) : null}
        <Listbox.Button
          className={
            'relative w-[125px] text-parS rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-80 shadow-md shadow-dark-60 text-dark-100'
          }
        >
          <span className="block truncate">{selected.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {svg}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute cursor-pointer z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {valuesArray.map((value, index) => (
              <Listbox.Option
                key={index}
                onClick={() => {
                  setSelected(value);
                }}
                className={({ active }) =>
                  `relative select-none py-2 pl-10 pr-4 text-parS cursor-pointer${
                    active ? 'bg-yellow-40 text-dark-100' : 'text-dark-80'
                  }`
                }
                value={value.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate cursor-pointer${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {value.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
