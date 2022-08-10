import "./Main.css";
import Button from "../../Button/Button";
import CreateUser from "./CreateUser/CreateUser";
import LoginUser from "./LoginUser/LoginUser";
import { useEffect } from "react";

const Main = ({ currentUser, setCurrentUser }) => {
  let isCreateUserShowed = false;
  let isLoginUserShowed = false;

  const restoreDefaultComposition = () => {
    const mainContentElement = document.querySelector(".main .main-content");
    const createUserFormElement = document.querySelector(".main .create-user #create-user-form");
    const loginUserFormElement = document.querySelector(".main .login-user #login-user-form");

    mainContentElement.style.transform = window.innerWidth < 1025 ? "translateX(-100vw)" : "translateX(-350px)";
    createUserFormElement.style.transform = "unset";
    loginUserFormElement.style.transform = "unset";
  };

  const showCreateUser = (hide = false) => {
    const mainContentElement = document.querySelector(".main .main-content");
    const createUserFormElement = document.querySelector(".main .create-user #create-user-form");

    if (isLoginUserShowed) {
      showLoginUser(true);
    }

    if (hide === true) {
      createUserFormElement.style.transform = "translateX(0%)";
      isCreateUserShowed = false;
    } else {
      mainContentElement.style.transform = window.innerWidth < 1025 ? "translateX(-200%)" : "translateX(-550px)";
      createUserFormElement.style.transform = window.innerWidth < 1025 ? "translateX(0%)" : "translateX(-100%)";
      isCreateUserShowed = true;
    }
  };

  const showLoginUser = (hide = false) => {
    const mainContentElement = document.querySelector(".main .main-content");
    const loginUserFormElement = document.querySelector(".main .login-user #login-user-form");

    if (isCreateUserShowed) {
      showCreateUser(true);
    }

    if (hide === true) {
      loginUserFormElement.style.transform = "translateX(0px)";
      isLoginUserShowed = false;
    } else {
      mainContentElement.style.transform = window.innerWidth < 1025 ? "translateX(0px)" : "translateX(-150px)";
      loginUserFormElement.style.transform = window.innerWidth < 1025 ? "translateX(0%)" : "translateX(100%)";
      isLoginUserShowed = true;
    }
  };

  useEffect(() => {
    if (window.innerWidth > 1024) {
      window.addEventListener("resize", () => restoreDefaultComposition());
    }
  }, []);

  return (
    // Tutaj loading ma być
    <div className="main">
      <div className="main-content">
        <LoginUser currentUser={currentUser} restoreDefaultComposition={restoreDefaultComposition} setCurrentUser={setCurrentUser}></LoginUser>
        <div className="main-content-wrapper">
          <h1>Pozwól złapać się Twoim bliskim!</h1>
          <p>Nie dopuść do sytuacji gdzie Twoi bliscy nie mogą się z Tobą skontaktować.</p>
          <div className="buttons-wrapper">
            <Button action={() => showLoginUser()}>Zaloguj się</Button>
            <p>Lub</p>
            <Button action={() => showCreateUser()}>Załóż konto</Button>
          </div>
        </div>
        <CreateUser currentUser={currentUser} restoreDefaultComposition={restoreDefaultComposition}></CreateUser>
      </div>
    </div>
  );
};

export default Main;
