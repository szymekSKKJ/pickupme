import "./LoginUser.css";
import Button from "../../../Button/Button";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../../../initializeFirebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import createNotification from "../../../../customs/createNotification";
import { useState } from "react";

const LoginUser = ({ currentUser, setCurrentUser, restoreDefaultComposition }) => {
  const isEmpty = (str) => !str.trim().length;

  const loginUser = async (event) => {
    const usernameInputElement = event.target.parentElement.querySelector("#login-username");
    const passwordInputElement = event.target.parentElement.querySelector("#login-password");
    const formElement = document.querySelector(".login-user #login-user-form");
    const formInputsElement = [...formElement.querySelectorAll("input")];
    let isUserFound = false;

    const emptyInput = formInputsElement.find((input) => isEmpty(input.value));

    if (emptyInput !== undefined) {
      emptyInput.focus();
      createNotification("Wypełnij wszystkie pola", true);
    } else {
      const q = query(collection(db, "users"), where("username", "==", usernameInputElement.value));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (!isUserFound) {
          const { email, username, pickedMeUsers, profileImage } = doc.data();
          const auth = getAuth();
          signInWithEmailAndPassword(auth, email, passwordInputElement.value)
            .then((userCredential) => {
              const user = userCredential.user;
              setCurrentUser({
                id: user.uid,
                profileImage: profileImage,
                username: username,
                pickedMeUsers: pickedMeUsers,
                email: email,
              });
            })
            .catch((error) => {
              const errorCode = error.code;
              createNotification(errorCode, true);
            });
          isUserFound = true;
        }
      });

      if (isUserFound === false) {
        createNotification("Użytkownik o podanej nazwie nieistnieje", true);
      }
    }
  };

  return (
    <div className="login-user">
      <Button action={() => restoreDefaultComposition()}>
        <i className="fa-solid fa-angle-right"></i>
      </Button>
      <form id="login-user-form" spellCheck="false" noValidate onSubmit={(event) => event.preventDefault()}>
        <div className="input-wrapper">
          <input type="text" id="login-username" placeholder="Nazwa użytkownika" required></input>
          <label htmlFor="login-username">Nazwa użytkownika</label>
        </div>
        <div className="input-wrapper">
          <input type="password" id="login-password" placeholder="Hasło" required></input>
          <label htmlFor="login-password">Hasło</label>
        </div>
        <Button action={(event) => loginUser(event)}>Zaloguj!</Button>
      </form>
    </div>
  );
};

export default LoginUser;
