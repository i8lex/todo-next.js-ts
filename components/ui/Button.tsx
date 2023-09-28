import Link from 'next/link';

import React from 'react';
import { cva } from 'class-variance-authority';
import clsx from 'clsx';

import { Spinner } from './Spinner';

import type { VariantProps } from 'class-variance-authority';
import type { LinkProps } from 'next/link';

const button = cva(
  'relative inline-flex items-center justify-center text-center font-medium outline-none ring-offset-2 focus-visible:ring-2 ring-green-90 transform active:translate-y-[1px] [&>svg]:h-5 [&>svg]:w-5 [&>svg]:flex-shrink-0 disabled:active:translate-y-0 disabled:bg-darkSkyBlue-10 disabled:text-darkSkyBlue-60 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: [
          'bg-blue-90 text-white hover:bg-blue-100 focus-visible:bg-blue-100 shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60',
        ],
        secondary: [
          'bg-green-10 text-green-100 hover:bg-green-20 focus-visible:bg-green-20',
        ],
        white: [
          'bg-white text-darkSkyBlue-80 hover:bg-mystic-20 focus-visible:bg-[#F9FAFB] border border-solid border-stroke shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60 hover:bg-gray-10',
        ],
        yellow: [
          'bg-yellow-10 text-darkSkyBlue-80 hover:bg-mystic-20 focus-visible:bg-[#F9FAFB] focus-visible:rounded-md border border-solid border-stroke shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60 hover:bg-yellow-20',
        ],
        whitered: [
          'bg-white text-errorText hover:bg-mystic-20 focus-visible:bg-[#F9FAFB] border border-solid border-error-100 shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60 hover:bg-yellow-20',
        ],
        yellowRed: [
          'text-errorText hover:bg-mystic-20 focus-visible:bg-[#F9FAFB] bg-yellow-10 border border-solid border-error-100 shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60 hover:bg-yellow-20',
        ],
        red: [
          'bg-error-100 text-white hover:bg-error-80 focus-visible:bg-[#FF8383] border border-solid border-error-100',
        ],
        blue: [
          'bg-blue-100 text-white hover:bg-blue-80 focus-visible:bg-[#FF8383] border border-solid border-blue-100 shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60',
        ],
        green: [
          'bg-green-60 text-white hover:bg-green-40 focus-visible:bg-[#FF8383] border border-solid border-green-80 shadow-md shadow-dark-60 hover:shadow-sm hover:shadow-dark-60',
        ],
      },
      size: {
        xs: [
          'text-quot py-[7px] px-[11px] gap-[7px] rounded-[6px] [&>svg]:h-4 [&>svg]:w-4',
        ],
        sm: ['text-parS py-[9px] px-[13px] gap-[9px] rounded-[8px]'],
        base: ['text-parS py-[9px] px-[17px] gap-[8px] rounded-[10px]'],
        l: [
          'text-parM py-[10px] px-[17px] gap-[10px] rounded-[10px] [&>svg]:h-6 [&>svg]:w-6',
        ],
        xl: [
          'text-parM py-[13px] px-[25px] gap-[13px] rounded-[12px] [&>svg]:h-5 [&>svg]:w-5',
        ],
        iconbase: ['p-2 rounded-[10px]'],
      },
      fullWidth: {
        true: 'w-full',
        mobile: 'w-full tablet:w-auto', // only mobile
        tablet: 'tablet:w-full desktop:w-auto', // only tablet
        desktop: 'desktop:w-full', // only desktop
        'mobile-tablet': 'w-full desktop:w-auto', // from mobile to tablet (inclusive)
      },
      extraPadded: {
        true: 'px-16',
        mobile: 'px-16 tablet:pl-[initial] tablet:pr-[initial]', // only mobile
        tablet: 'tablet:px-16 tablet:pl-[initial] tablet:pr-[initial]', // only tablet
        desktop: 'desktop:px-16', // only desktop
        'mobile-tablet': 'px-16 desktop:pl-[initial] desktop:pr-[initial]', // from mobile to tablet (inclusive)
      },
      isLoading: {
        true: 'pointer-events-none',
      },
    },
    compoundVariants: [
      // { variant: 'primary', size: 'medium', className: 'uppercase' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'base',
    },
  },
);

type BaseButtonProps = VariantProps<typeof button> & {
  text?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  href?: string;
  disabled?: boolean;
  size?: string;
  icon?: {
    svg: React.ReactNode;
    position?: 'start' | 'end';
  };
};

type ExcludeLinkProps = {
  [key in keyof Omit<LinkProps, 'className' | 'disabled' | 'onClick'>]?: never;
};
type ExcludeButtonProps = {
  [key in keyof Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'disabled' | 'onClick'
  >]?: never;
};

type AsButtonProps = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  ExcludeLinkProps;

type AsLinkProps = BaseButtonProps & LinkProps & ExcludeButtonProps;

/**
 * A multi-purpose button component that can be used as a link or a button
 *
 * @default
 * variant: 'primary'
 * size: 'base'
 *
 * @example
 * ```tsx
 * <Button text="Click me" />
 * <Button text="Click me" variant="white" size="xl" href="/route" isLoading={true} />
 * <Button text="Click me" icon={{ svg: <MySvgIcon /> }} />
 * ```
 */
export const Button: React.FC<AsButtonProps | AsLinkProps> = (props) => {
  const {
    text,
    className,
    variant,
    size,
    fullWidth,
    isLoading,
    extraPadded,
    icon: { svg, position: iconPosition = 'start' } = {},
    ...rest
  } = props;

  const body = (
    <>
      {isLoading ? <Spinner className="absolute" /> : null}
      {!isLoading && svg && iconPosition === 'start' ? svg : null}
      {text ? (
        <span className={clsx('whitespace-nowrap', isLoading && 'invisible')}>
          {text}
        </span>
      ) : null}
      {!isLoading && svg && iconPosition === 'end' ? svg : null}
    </>
  );

  if (isLinkButtonProps(rest)) {
    return (
      <Link
        className={button({
          variant,
          size,
          fullWidth,
          extraPadded,
          isLoading,
          className,
        })}
        {...rest}
      >
        {body}
      </Link>
    );
  }

  return (
    // @ts-ignore
    <button
      className={button({
        variant,
        size,
        fullWidth,
        extraPadded,
        isLoading,
        className,
      })}
      {...rest}
    >
      {body}
    </button>
  );
};

function isLinkButtonProps(
  props: LinkProps | React.ButtonHTMLAttributes<HTMLButtonElement>,
): props is AsLinkProps {
  return 'href' in props;
}
