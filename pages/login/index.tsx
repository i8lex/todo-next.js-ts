import React, { useState, FC } from 'react';
import { Form, Formik } from 'formik';
import { ModalAuth } from '@/components/ModalAuth';
import * as yup from 'yup';
import { Input } from '@/components/Input';
import { useRouter } from 'next/router';
import { setLoginSuccess } from '@/redux/slices/auth.slice';
import { LoginBody, useLoginMutation } from '@/redux/api/auth.api';
import { useAppDispatch } from '@/redux/hooks';
import EyeIcon from '@/public/IconsSet/eye.svg';
import EyeOffIcon from '@/public/IconsSet/eye-off.svg';
import { Button } from '@/components/ui/Button';
import { AuthorizationLayout } from '@/components/layouts/authorization/Layout';

const LoginPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const handleClose = () => {
    setOpenModal(false);
    setMessage('');
  };

  const handleSubmit = async (values: LoginBody) => {
    try {
      const response = await login(values);
      if ('error' in response) {
        const { error } = response;
        // @ts-ignore
        setMessage(error.data.error);
        // @ts-ignore
        setConfirmed(error.data.confirmed);
        if (!confirmed && confirmed !== undefined) {
          setEmail(values.email);
          return setOpenModal(true);
        } else {
          setOpenModal(true);
          setTimeout(() => handleClose(), 3000);
        }
      }
      if ('data' in response) {
        const { data } = response;
        const { message: responseMessage } = data;
        setMessage(data.message);
        setConfirmed(data.confirmed);
        setOpenModal(true);

        if (data.token && data.confirmed) {
          dispatch(setLoginSuccess(data.token));
          setTimeout(() => {
            router.push('/tasks');
            handleClose();
          }, 3000);
        }
      }
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
        className="login__modalAuth"
        email={email}
        open={openModal}
        onClose={handleClose}
        handleClose={handleClose}
        confirmed={confirmed}
        message={message}
      />

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => handleSubmit(values as LoginBody)}
        validationSchema={yup.object().shape({
          email: yup.string().label('Email').min(6).email().max(30).required(),
          password: yup.string().label('Password').min(8).max(30).required(),
        })}
      >
        <Form
          // autoComplete={'current-password'}
          className="flex flex-col gap-6 justify-between tablet:justify-start h-full w-full tablet:w-fit"
        >
          <div className="flex flex-col gap-6">
            <p className="text-dispL text-dark-100 font-bold mb-6">Sign-In</p>
            <Input label="Email" required name="email" id="email" step={1} />
            <div className="relative tablet:w-[390px]">
              <Input
                label="Password"
                name="password"
                type={!showPassword ? 'password' : 'text'}
                id="password"
                step={1}
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
        </Form>
      </Formik>
    </AuthorizationLayout>
  );
};

export default LoginPage;
