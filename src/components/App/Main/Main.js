import "./Main.css";
import Button from "../../Button/Button";
import CreateUser from "./CreateUser/CreateUser";
import LoginUser from "./LoginUser/LoginUser";

const Main = ({ setCurrentUser }) => {
  let isCreateUserShowed = false;
  let isLoginUserShowed = false;

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
      mainContentElement.style.transform = "translateX(-550px)";
      createUserFormElement.style.transform = "translateX(-100%)";
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
      mainContentElement.style.transform = "translateX(-150px)";
      loginUserFormElement.style.transform = "translateX(100%)";
      isLoginUserShowed = true;
    }
  };

  return (
    <div className="main">
      <div className="main-content">
        <LoginUser setCurrentUser={setCurrentUser}></LoginUser>
        <div className="main-content-wrapper">
          <h1>Pozwól złapać się Twoim bliskim!</h1>
          <p>Nie dopuść do sytuacji gdzie Twoi bliscy nie mogą się z Tobą skontaktować.</p>
          <div className="buttons-wrapper">
            <Button action={() => showLoginUser()}>Zaloguj się</Button>
            <p>Lub</p>
            <Button action={() => showCreateUser()}>Załóż konto</Button>
          </div>
        </div>
        <CreateUser></CreateUser>
      </div>
    </div>
  );
};

export default Main;
