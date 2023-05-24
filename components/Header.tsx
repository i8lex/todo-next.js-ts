import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { setLogoutSuccess } from "../redux/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const handleLogout = async () => {
    dispatch(setLogoutSuccess({ isAuthenticated: false, token: null }));
    await router.push("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          {isAuthenticated ? (
            <>
              <Link className="header__link" href="/tasks">
                Tasks
              </Link>
              <button className="header__logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="header__link" href="/registration">
                Registration
              </Link>
              <Link className="header__link" href="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
