import React, { useState } from 'react';
import { ModalAuth } from '@/components/auth/modal/ModalAuth';
import { useRouter } from 'next/router';
import { useRegistrationMutation } from '@/redux/api/auth.api';
import { AuthorizationLayout } from '@/components/layouts/authorization/Layout';
import { Button } from '@/components/ui/Button';
import EyeIcon from '@/public/IconsSet/eye.svg';
import EyeOffIcon from '@/public/IconsSet/eye-off.svg';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

type FormRequiredFields = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [registration] = useRegistrationMutation();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isDirty },
  } = useForm<FormRequiredFields>();

  const handleError = (errors: object) => {
    console.warn(errors);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const onSubmit = async (values: FormRequiredFields) => {
    try {
      const response = await registration(values);

      if ('error' in response) {
        const error = response.error;
        // @ts-ignore
        const errorMessage = error.data.error;
        setMessage(errorMessage);
        setOpenModal(true);
        return setTimeout(() => handleClose(), 3000);
      } else {
        const data = response.data;
        const successMessage = data.message;
        setEmail(data.email);
        setMessage(successMessage);
        setOpenModal(true);
        return setTimeout(() => router.push('/login'), 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthorizationLayout page={'register'}>
      <ModalAuth
        open={openModal}
        handleClose={handleClose}
        message={message}
        email={email}
      />
      <form
        onSubmit={handleSubmit(onSubmit, handleError)}
        noValidate
        method="post"
        className="flex flex-col gap-6 justify-between tablet:justify-start h-full w-full tablet:w-fit"
      >
        <div>
          <p className="text-dispL text-dark-100 font-bold mb-12">Sign-Up</p>
          <div className="flex flex-col gap-8">
            <Input
              label={'Enter your username'}
              isRequired={true}
              type="name"
              id="name"
              control={control}
              errorText={errors?.name?.message}
              {...register('name', {
                required: 'Username is required',
                minLength: {
                  value: 2,
                  message: 'Username must be at least 6 characters',
                },
                maxLength: {
                  value: 30,
                  message: 'Username must be at most 30 characters',
                },
              })}
            />
            <Input
              label={'Enter your email'}
              isRequired={true}
              type="email"
              id="email"
              control={control}
              errorText={errors?.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <div className="relative tablet:w-[390px]">
              <Input
                label={'Enter your password'}
                isRequired={true}
                type={showPassword ? 'text' : 'password'}
                // placeholder={'Enter your email'}
                id="password"
                control={control}
                errorText={errors?.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message: 'Password must be stronger',
                  },
                })}
              />
              <div
                className="w-4 h-4 text-gray-80 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {!showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </div>
            </div>
            <div className="relative tablet:w-[390px]">
              <Input
                label={'Confirm your password'}
                isRequired={true}
                type={showPassword ? 'text' : 'password'}
                id="passwordConfirm"
                control={control}
                errorText={errors?.passwordConfirm?.message}
                {...register('passwordConfirm', {
                  required: 'Confirm password is required',
                  validate: (value) => {
                    if (value !== getValues('password')) {
                      return 'Passwords do not match';
                    }
                    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
                      return 'Password must be stronger';
                    }
                    return true;
                  },
                })}
              />
              <div
                className="w-4 h-4 text-gray-80 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {!showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </div>
            </div>
          </div>
        </div>

        <Button
          text={'Register'}
          variant={'primary'}
          size={'base'}
          type={'submit'}
          className="w-full tablet:w-[180px] mb-6"
        />
      </form>
    </AuthorizationLayout>
  );
};

export default RegistrationPage;
