import { getAuth, signOut } from "firebase/auth";
import createNotification from "./createNotification";

const signOutUser = (setCurrentUser) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      setCurrentUser(undefined);
      createNotification("Zostałeś wylogowany");
    })
    .catch((error) => {
      createNotification("Wystąpił nieoczekiwany błąd. Przepraszamy", "error");
    });
};

export default signOutUser;
