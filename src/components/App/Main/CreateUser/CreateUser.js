import Button from "../../../Button/Button";
import "./CreateUser.css";
import { db } from "../../../../initializeFirebase";
import { collection, setDoc, doc, getDocs, query, where } from "firebase/firestore";
import createNotification from "../../../../customs/createNotification";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import signOutUser from "../../../../customs/signOutUser";

const CreateUser = () => {
  const isEmpty = (str) => !str.trim().length;

  const hasWhiteSpace = (str) => str.indexOf(" ") >= 0;

  const checkIfUsernameIsTaken = async (username) => {
    let isFound = false;
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      isFound = true;
    });
    return isFound;
  };

  const createUser = async (event) => {
    const createUserFormElement = event.target.parentElement;
    const usernameInputElement = createUserFormElement.querySelector("#create-user-username");
    const emialInputElement = createUserFormElement.querySelector("#create-user-email");
    const passwordInputElement = createUserFormElement.querySelector("#create-user-password");

    const auth = getAuth();

    const isUsernameTaken = await checkIfUsernameIsTaken(usernameInputElement.value);

    if (!isUsernameTaken) {
      createUserWithEmailAndPassword(auth, emialInputElement.value, passwordInputElement.value)
        .then(async (userCredential) => {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            username: usernameInputElement.value,
            email: emialInputElement.value,
            pickedMeUsers: [],
            profileImage: null,
          });
          createNotification("Konto zostało utworzone");
          createUserFormElement.reset();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          createNotification(errorMessage, true);
        });
    } else {
      createNotification("Podana nazwa użytkownika jest już zajęta", true);
    }
  };

  const formValidation = (event) => {
    const formElement = document.querySelector(".create-user #create-user-form");
    const formInputsElement = [...formElement.querySelectorAll("input")];
    const formEmailInputElement = formElement.querySelector("#create-user-email");
    const formPasswordInputElement = formElement.querySelector("#create-user-password");
    const formRepeatPasswordInputElement = formElement.querySelector("#create-user-repeat-password");

    const emptyInput = formInputsElement.find((input) => isEmpty(input.value));
    const hasAnyInputWhiteSpace = formInputsElement.find((input) => hasWhiteSpace(input.value));

    if (emptyInput !== undefined) {
      emptyInput.focus();
      createNotification("Wypełnij wszystkie pola", true);
    } else if (hasAnyInputWhiteSpace !== undefined) {
      hasAnyInputWhiteSpace.focus();
      createNotification("Żadne z pól nie może zawierać spacji", true);
    } else if (!formEmailInputElement.value.includes("@")) {
      formEmailInputElement.focus();
      createNotification("Pole email jest niepoprawne", true);
    } else if (formPasswordInputElement.value !== formRepeatPasswordInputElement.value) {
      formPasswordInputElement.focus();
      createNotification("Hasła są od siebie różne", true);
    } else {
      createUser(event);
    }
  };

  return (
    <div className="create-user">
      <form id="create-user-form" spellCheck="false" noValidate onSubmit={(event) => event.preventDefault()}>
        <div className="input-wrapper">
          <input type="text" id="create-user-username" placeholder="Nazwa użytkownika" required></input>
          <label htmlFor="create-user-username">Nazwa użytkownika</label>
          <i className="fa-duotone fa-square-question"></i>
          <span>Wybierz taką nazwę użytkownika, po której Twoi bliscy cię rozpoznają</span>
        </div>
        <div className="input-wrapper">
          <input type="text" id="create-user-email" placeholder="Email" required></input>
          <label htmlFor="create-user-email">Email</label>
        </div>
        <div className="input-wrapper">
          <input type="password" id="create-user-password" placeholder="Hasło" required></input>
          <label htmlFor="create-user-password">Hasło</label>
        </div>
        <div className="input-wrapper">
          <input type="password" id="create-user-repeat-password" placeholder="Powtórz hasło" required></input>
          <label htmlFor="create-user-repeat-password">Powtórz hasło</label>
        </div>
        <Button action={(event) => formValidation(event)}>Utwórz!</Button>
      </form>
    </div>
  );
};

export default CreateUser;
