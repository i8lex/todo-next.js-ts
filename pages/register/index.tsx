import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { ModalAuth } from '@/components/auth/modal/ModalAuth';
import * as yup from 'yup';
import { Input } from '@/components/Input';
import { useRouter } from 'next/router';
import { useRegistrationMutation } from '@/redux/api/auth.api';
import { AuthorizationLayout } from '@/components/layouts/authorization/Layout';
import { Button } from '@/components/ui/Button';
import EyeIcon from '@/public/IconsSet/eye.svg';
import EyeOffIcon from '@/public/IconsSet/eye-off.svg';

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [registration] = useRegistrationMutation();

  const handleClose = () => {
    setOpenModal(false);
  };

  // @ts-ignore
  const handleSubmit = async (values) => {
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
        // return setTimeout(() => router.push('/login'), 3000);
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
      {/*<PopUpModal type={} showPopUpModal={true} setShowPopUpModal={setOpenModal} titleText={''} messageText={''} buttonText={}/>*/}
      <ModalAuth
        open={openModal}
        handleClose={handleClose}
        message={message}
        email={email}
      />

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          passwordConfirm: '',
        }}
        onSubmit={(values) => handleSubmit(values)}
        validationSchema={yup.object().shape({
          name: yup.string().label('Name').min(6).max(30).required(),
          email: yup.string().label('Email').min(6).email().max(30).required(),
          password: yup.string().label('Password').min(8).max(30).required(),
          passwordConfirm: yup
            .string()
            .label('Confirm Password')
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required'),
        })}
      >
        <Form
          autoComplete="off"
          className="flex flex-col gap-6 justify-between tablet:justify-start h-full w-full tablet:w-fit"
        >
          <div>
            <p className="text-dispL text-dark-100 font-bold mb-12">Sign-Up</p>
            <div className="flex flex-col gap-6">
              <Input label="Name" required name="name" />
              <Input label="Email" required name="email" />
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
              <div className="relative tablet:w-[390px]">
                <Input
                  label="Password"
                  name="passwordConfirm"
                  type={!showPassword ? 'password' : 'text'}
                  id="passwordConfirm"
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
          </div>

          <Button
            text={'Register'}
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

export default RegistrationPage;
