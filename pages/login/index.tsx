import React, { useState, FC } from 'react';
import { ModalAuth } from '@/components/auth/modal/ModalAuth';
import { useRouter } from 'next/router';
import { LoginBody } from '@/redux/api/auth.api';
import EyeIcon from '@/public/IconsSet/eye.svg';
import EyeOffIcon from '@/public/IconsSet/eye-off.svg';
import { Button } from '@/components/ui/Button';
import { AuthorizationLayout } from '@/components/layouts/authorization/Layout';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

type FormRequiredFields = {
  email: string;
  password: string;
};
const LoginPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormRequiredFields>();

  const handleClose = () => {
    setOpenModal(false);
    setMessage('');
  };
  const handleError = (errors: object) => {
    console.warn(errors);
  };
  const onSubmit = async (values: LoginBody) => {
    try {
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      }).then((response) => {
        if (response?.error) {
          const { error } = response;
          setMessage(error);
          if (error === "Please activate you're account") {
            setEmail(values.email);
            setConfirmed(false);
          }
        } else {
          setConfirmed(true);
          setMessage('Welcome back!');
          setTimeout(() => {
            router.push('/events');
            handleClose();
          }, 2000);
        }
        setOpenModal(true);
      });
    } catch (error) {
      setMessage('Something goes wrong');
      setOpenModal(true);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <AuthorizationLayout page={'login'}>
      <ModalAuth
        email={email}
        open={openModal}
        handleClose={handleClose}
        confirmed={confirmed}
        message={message}
      />
      <form
        onSubmit={handleSubmit(onSubmit, handleError)}
        noValidate
        method="post"
        className="flex flex-col gap-6 justify-between tablet:justify-start h-full w-full tablet:w-fit"
      >
        <div className="flex flex-col gap-6">
          <p className="text-dispL text-dark-100 font-bold mb-6">Sign-In</p>

          <Input
            label={'Enter your email'}
            isRequired={true}
            type="email"
            // placeholder={'Enter your email'}
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
              errorText={errors?.email?.message}
              {...register('password', {
                required: 'Password is required',
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
        <Button
          text={'Login'}
          variant={'primary'}
          size={'base'}
          type={'submit'}
          className="w-full tablet:w-[180px] mb-6"
        />
      </form>
    </AuthorizationLayout>
  );
};

export default LoginPage;
