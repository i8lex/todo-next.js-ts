import React, { useState } from "react";
import { Form, Formik } from "formik";
import { ModalAuth } from "../../components/ModalAuth";
import * as yup from "yup";
import { Input } from "../../components/Input";
// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/auth/authSlice";
import { useLoginMutation } from "../../store/auth/auth.api";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState("");
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const handleClose = () => {
    setOpenModal(false);
    setMessage("");
  };

  // const values = {
  //   email: "authtodomail@gmail.com",
  //   password: "Root1234",
  // };

  const handleSubmit = async (values) => {
    try {
      const { data, error } = await login(values);

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
        const { message, confirmed } = data;
        setMessage(message);
        setConfirmed(confirmed);
        setOpenModal(true);

        if (data.token && confirmed === true) {
          dispatch(loginSuccess(data.token));
          setTimeout(() => {
            // navigate("/tasks");
            handleClose();
          }, 3000);
        }
      }
    } catch (err) {
      console.log(err);
      setMessage(err.message);
      setOpenModal(true);
    }
    return;
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
            onSubmit={(values) => handleSubmit(values)}
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
              <Input label="Email" required name="email" />
              <div className="login__passwordBox">
                <Input
                  label="Password"
                  name="password"
                  type={!showPassword ? "password" : "text"}
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
