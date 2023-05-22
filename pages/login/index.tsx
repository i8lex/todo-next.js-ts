import React, { useState, FC } from "react";
import { Form, Formik } from "formik";
import { ModalAuth } from "../../components/ModalAuth";
import * as yup from "yup";
import { Input } from "../../components/Input";
import { useRouter } from "next/router";
import { setLoginSuccess } from "../../redux/slices/auth.slice";
import { LoginBody, useLoginMutation } from "../../redux/api/auth.api";
import { useAppDispatch } from "../../redux/hooks";

const LoginPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const handleClose = () => {
    setOpenModal(false);
    setMessage("");
  };

  const handleSubmit = async (values: LoginBody) => {
    try {
      const { data, error } = await login(values);
      console.log(data.token);
      console.log(data.confirmed);
      if (error) {
        setMessage(error.data.error);
        const { confirmed } = error.data;
        setConfirmed(confirmed);
        if (!confirmed && confirmed !== undefined) {
          setEmail(values.email);
          return setOpenModal(true);
        } else {
          setOpenModal(true);
          setTimeout(() => handleClose(), 3000);
        }
      } else {
        const { message: responseMessage } = data;
        setMessage(responseMessage);
        setOpenModal(true);

        if (data.token && data.confirmed) {
          dispatch(setLoginSuccess(data.token));
          // dispatch(setLoginSuccess({ token: data.token }));
          setTimeout(() => {
            router.push("/tasks");
            handleClose();
          }, 3000);
        }
      }
    } catch (err) {
      setMessage(err.message);
      setOpenModal(true);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className="login">
      <div className="container">
        <div className="login__wrapper">
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
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => handleSubmit(values as LoginBody)}
            validationSchema={yup.object().shape({
              email: yup
                .string()
                .label("Email")
                .min(6)
                .email()
                .max(30)
                .required(),
              password: yup
                .string()
                .label("Password")
                .min(8)
                .max(30)
                .required(),
            })}
          >
            <Form autoComplete="off">
              <h1 className="login__title">Login</h1>
              <Input label="Email" required name="email" id="email" step={1} />
              <div className="login__passwordBox">
                <Input
                  label="Password"
                  name="password"
                  type={!showPassword ? "password" : "text"}
                  id="password"
                  step={1}
                />
                <button
                  onClick={toggleShowPassword}
                  type="button"
                  className={
                    !showPassword
                      ? "login__passwordBox__btnShow"
                      : "login__passwordBox__btnHide"
                  }
                >
                  <></>
                </button>
              </div>
              <button className="login__button" type="submit">
                Login
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
