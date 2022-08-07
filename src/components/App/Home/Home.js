import "./Home.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../initializeFirebase";
import { useEffect, useState } from "react";
import LinkPopup from "./LinkPopup/LinkPopup";
import Navigation from "./Navigation/Navigation";
import Loading from "../Loading/Loading";

const Home = ({ currentUser, setCurrentUser }) => {
  const [pickedMeUsers, setPickedMeUsers] = useState(null);
  const [isLoadingOpen, setIsLoadingOpen] = useState(true);
  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(localStorage.getItem("firstLogin") === null ? true : false);

  const removeNotification = async (notificationElement, index) => {
    const { pickedMeUsers: pickedMeUsersData } = currentUser;

    pickedMeUsersData.splice(index, 1);
    setPickedMeUsers(pickedMeUsersData);

    await updateDoc(doc(db, "users", currentUser.id), {
      pickedMeUsers: pickedMeUsersData,
    });
  };

  const getPickedMeUsers = async () => {
    const { pickedMeUsers: pickedMeUsersData } = currentUser;
    const pickedMeUsersLocal = [];

    // If data is empty, get all users, otherwise get only users that picked after first render
    if (pickedMeUsers === null) {
      if (pickedMeUsersData.length === 0) {
        setPickedMeUsers([]);
      } else {
        pickedMeUsersData.forEach(async (user, index, array) => {
          const { id, message } = user;
          const docSnap = await getDoc(doc(db, "users", id));
          const { username, profileImage } = docSnap.data();
          pickedMeUsersLocal.push({
            message: message,
            username: username,
            profileImage: profileImage,
          });

          if (index === array.length - 1) {
            setPickedMeUsers(pickedMeUsersLocal);
          }
        });
      }
    } else if (pickedMeUsersData.length > pickedMeUsers.length) {
      const { id, message } = pickedMeUsersData[pickedMeUsersData.length - 1];
      const docSnap = await getDoc(doc(db, "users", id));
      const { username, profileImage } = docSnap.data();

      const pickedMeUsersCloned = pickedMeUsers.slice();
      pickedMeUsersCloned.push({
        message: message,
        username: username,
        profileImage: profileImage,
      });
      setPickedMeUsers(pickedMeUsersCloned);

      const notification = new Notification(`${username} zaczepił Cię!`, {
        body: message,
        icon: require("./defaultUser.png"),
      });
    }
  };

  useEffect(() => {
    getPickedMeUsers();
  }, [currentUser]);

  return (
    <>
      {isLoadingOpen && <Loading setIsLoadingOpen={setIsLoadingOpen} valueToWait={pickedMeUsers}></Loading>}
      <Navigation setCurrentUser={setCurrentUser} setIsLinkPopupOpen={setIsLinkPopupOpen}></Navigation>
      <div className="home">
        {isLinkPopupOpen ? <LinkPopup currentUser={currentUser} setIsLinkPopupOpen={setIsLinkPopupOpen}></LinkPopup> : null}
        <div className="picked-me-users">
          {pickedMeUsers !== null && pickedMeUsers.length > 0 ? (
            pickedMeUsers.map((user, index) => {
              const { username, profileImage, message } = user;
              return (
                <div className="user" onClick={(event) => removeNotification(event.target, index)}>
                  {profileImage === null ? <i className="fa-solid fa-user"></i> : <img src={require("./defaultUser.png")}></img>}
                  <div className="username-and-message-wrapper">
                    <p className="username">{username}</p>
                    <p className="message">{message}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="empty-alert">Brak zaczepek. Podziel się linkiem aby więcej osób mogło Cię zaczepić!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
