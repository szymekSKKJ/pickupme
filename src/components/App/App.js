import { useEffect, useState } from "react";
import "./App.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../initializeFirebase";
import Main from "./Main/Main";
import Home from "./Home/Home";
import CreateUser from "./Main/CreateUser/CreateUser";
import LoginUser from "./Main/LoginUser/LoginUser";
import PickUser from "./PickUser/PickUser";
import LoginOrSigninPage from "./LoginOrSigninPage/LoginOrSigninPage";
import Loading from "./Loading/Loading";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState(null);
  const [isLoadingOpen, setIsLoadingOpen] = useState(true);
  const homeIdFromUrl = new URL(window.location.href).searchParams.get("home"); //It is this same as user id

  const askUserForNotificationPermission = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((result) => {
        setNotificationPermissionStatus(result);
      });
    }
  };

  const getCurrentSignInUser = () => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
          const { email, username, pickedMeUsers, profileImage } = doc.data();
          setCurrentUser({
            id: uid,
            username: username,
            pickedMeUsers: pickedMeUsers,
            email: email,
            profileImage: profileImage,
          });
        });
      } else {
        setCurrentUser(undefined);
      }
    });
  };

  currentUser === null && getCurrentSignInUser();

  useEffect(() => {
    askUserForNotificationPermission();
  });

  return (
    <div className="app">
      {isLoadingOpen && (
        <Loading setIsLoadingOpen={setIsLoadingOpen} valueToWait={currentUser} closeImmediately={currentUser !== undefined ? true : false}></Loading>
      )}
      {isLoadingOpen === false || currentUser === undefined ? (
        currentUser === undefined ? (
          homeIdFromUrl === null ? (
            <Main setCurrentUser={setCurrentUser}></Main>
          ) : (
            <LoginOrSigninPage></LoginOrSigninPage>
          )
        ) : homeIdFromUrl === null ? (
          <Home setIsLoadingOpenFromAppComponent={setIsLoadingOpen} currentUser={currentUser} setCurrentUser={setCurrentUser}></Home>
        ) : (
          <PickUser homeIdFromUrl={homeIdFromUrl} currentUser={currentUser}></PickUser>
        )
      ) : null}
    </div>
  );
};

export default App;
