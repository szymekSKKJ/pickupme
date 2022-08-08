import "./PickedMeUsers.css";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../initializeFirebase";
import LinkPopup from ".././LinkPopup/LinkPopup";
import Loading from "../../Loading/Loading";

const PickedMeUsers = ({ currentUser, isLinkPopupOpen, setIsLinkPopupOpen }) => {
  const [pickedMeUsers, setPickedMeUsers] = useState(null);
  const [isLoadingOpen, setIsLoadingOpen] = useState(true);

  const removeNotification = async (notificationElement, index) => {
    const { pickedMeUsers: pickedMeUsersData } = currentUser;

    pickedMeUsersData.splice(index, 1); // For firebase data
    pickedMeUsers.splice(index, 1); // For component
    setPickedMeUsers(pickedMeUsers);

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
        icon: profileImage !== null ? profileImage : require("./defaultUser.png"),
      });
    }
  };

  useEffect(() => {
    getPickedMeUsers();
  }, [currentUser]);
  return (
    <>
      {isLinkPopupOpen && <LinkPopup currentUser={currentUser} setIsLinkPopupOpen={setIsLinkPopupOpen}></LinkPopup>}
      {isLoadingOpen && <Loading setIsLoadingOpen={setIsLoadingOpen} valueToWait={pickedMeUsers}></Loading>}
      <div className="picked-me-users">
        {pickedMeUsers !== null && pickedMeUsers.length > 0 ? (
          pickedMeUsers.map((user, index) => {
            const { username, profileImage, message } = user;
            return (
              <div className="user" onClick={(event) => removeNotification(event.target, index)}>
                {profileImage === null ? <i className="fa-solid fa-user"></i> : <img src={profileImage}></img>}
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
    </>
  );
};

export default PickedMeUsers;
