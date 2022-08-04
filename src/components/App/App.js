import { useEffect, useState } from "react";
import "./App.css";
import Main from "./Main/Main";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../initializeFirebase";
import Home from "./Home/Home";
import CreateUser from "./Main/CreateUser/CreateUser";
import LoginUser from "./Main/LoginUser/LoginUser";
import PickUser from "./PickUser/PickUser";
import LoginOrRegisterPage from "./LoginOrRegisterPage/LoginOrRegisterPage";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState(null);
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

  currentUser === undefined && getCurrentSignInUser();

  useEffect(() => {
    askUserForNotificationPermission();
  });

  return (
    <div className="app">
      {currentUser === undefined ? (
        homeIdFromUrl === null ? (
          <Main setCurrentUser={setCurrentUser}></Main>
        ) : (
          <LoginOrRegisterPage></LoginOrRegisterPage>
        )
      ) : homeIdFromUrl === null ? (
        <Home currentUser={currentUser} setCurrentUser={setCurrentUser}></Home>
      ) : (
        <PickUser currentUser={currentUser} homeIdFromUrl={homeIdFromUrl}></PickUser>
      )}
    </div>
  );
};

export default App;
