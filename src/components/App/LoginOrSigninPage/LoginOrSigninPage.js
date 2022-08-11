import "./LoginOrSigninPage.css";
import Main from "../Main/Main";
import { useEffect } from "react";
import createNotification from "../../../customs/createNotification";

const LoginOrSigninPage = () => {
  useEffect(() => {
    const loginButton = document.querySelectorAll(".main .buttons-wrapper button")[0];
    loginButton.click();
    createNotification("Musisz się zalogować aby móc zaczepiać innych użytkowników", "error");
  }, []);
  return <Main></Main>;
};

export default LoginOrSigninPage;
