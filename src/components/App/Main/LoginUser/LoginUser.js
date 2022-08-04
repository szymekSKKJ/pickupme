import "./LoginUser.css";
import Button from "../../../Button/Button";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../../../initializeFirebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import createNotification from "../../../../customs/createNotification";

const LoginUser = ({ setCurrentUser }) => {
  const loginUser = async (event) => {
    const usernameInputElement = event.target.parentElement.querySelector("#login-username");
    const passwordInputElement = event.target.parentElement.querySelector("#login-password");
    let isUserFound = false;

    const q = query(collection(db, "users"), where("username", "==", usernameInputElement.value));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      if (!isUserFound) {
        const { email, username, pickedMeUsers } = doc.data();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, passwordInputElement.value)
          .then((userCredential) => {
            const user = userCredential.user;
            setCurrentUser({
              username: username,
              pickedMeUsers: pickedMeUsers,
              email: email,
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            createNotification(errorCode, true);
          });
        isUserFound = true;
      }
    });
    if (isUserFound === false) {
      createNotification("Użytkownik o podanej nazwie nieistnieje", true);
    }
  };

  return (
    <div className="login-user">
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
