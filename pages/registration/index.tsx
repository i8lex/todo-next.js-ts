import React, { useState } from "react";
import { Form, Formik } from "formik";
import { ModalAuth } from "../../components/ModalAuth";
import * as yup from "yup";
import { Input } from "../../components/Input";
import { useRouter } from "next/router";
import { useRegistrationMutation } from "../../redux/api/auth.api";

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [registration] = useRegistrationMutation();

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (values) => {
    // console.log(data);
    // console.log(error.data.error);
    try {
      const { data, error } = await registration(values);
      const { error: message } = error.data;
      if (error) {
        setMessage(message);

        setOpenModal(true);

        return setTimeout(() => handleClose(), 3000);
      } else {
        const { message } = data;
        setMessage(message);

        setOpenModal(true);

        return setTimeout(() => router.push("/login"), 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className="login">
      <div className="container">
        <div className="login__wrapper">
          <ModalAuth open={openModal} onClose={handleClose} message={message} />

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              passwordConfirm: "",
            }}
            onSubmit={(values) => handleSubmit(values)}
            validationSchema={yup.object().shape({
              name: yup.string().label("Name").min(6).max(30).required(),
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
                // .oneOf([yup.ref("passwordConfirm")], "Passwords must match")
                .required(),
              passwordConfirm: yup
                .string()
                .label("Confirm Password")
                .oneOf([yup.ref("password")], "Passwords must match")
                .required("Confirm Password is required"),
            })}
          >
            <Form autoComplete="off">
              <h1 className="login__title">Registration</h1>
              <Input label="Name" required name="name" />
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
              <div className="login__passwordBox">
                <Input
                  label="Confirm password"
                  name="passwordConfirm"
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
              <button
                className="login__button"
                type="submit"
                onSubmit={handleSubmit}
              >
                Registration
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default RegistrationPage;
