import {
  Body,
  Head,
  Heading,
  Html,
  Tailwind,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ConfirmEmailProps {
  url?: string;
  name?: string;
}

export const ConfirmEmail = ({
  url = 'https://some.link.com',
  name = 'John Doe',
}: ConfirmEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirm your email</Preview>
    <Tailwind>
      <Body className="bg-[#f3faf9] my-auto max-w-[600px] mx-auto font-sans rounded-xl">
        <div className="p-6 rounded-xl bg-softGreen">
          <div
            style={{
              border: '1px solid #cbd0d5',
            }}
            className="p-6 bg-white border border-[#cbd0d5] shadow-inner shadow-[#4d6277] rounded-xl"
          >
            <Heading className="text-center text-[32px] font-semibold text-[#4d6277]">
              Hello, <span className=" font-bold">{name}</span>!
            </Heading>
            <Text className="text-center mb-6 text-[32px] font-semibold text-[#4d6277]">
              please confirm your email
            </Text>
            <div className="w-fit mx-auto mt-[60px]">
              <Link
                href={url}
                target="_blank"
                style={{
                  border: '1px solid #cbd0d5',
                  paddingBottom: '6px',
                  paddingTop: '6px',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  marginBottom: '24px',
                }}
                className="text-center text-[#269d87] w-fit mx-auto py-2 px-6 border border-[#cbd0d5] rounded-md mt-[24px] shadow-md shadow-[#4d6277]"
              >
                Click here to confirm with this magic link
              </Link>
            </div>

            <Text className="text-[#4d6277] mt-[48px] mb-1 mx-auto w-fit">
              Or, copy and paste this into address bar:
            </Text>
            <Text className="text-center text-[#269d87] mt-0 mb-16">{url}</Text>
            <Text className="text-[#4d6277] text-[12px] mx-auto w-fit">
              If you didn&apos;t try registration on our site, you can safely
              ignore this email.
            </Text>
          </div>
        </div>
      </Body>
    </Tailwind>
  </Html>
);
