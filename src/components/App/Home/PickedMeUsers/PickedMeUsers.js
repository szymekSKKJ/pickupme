import "./PickedMeUsers.css";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../initializeFirebase";
import LinkPopup from ".././LinkPopup/LinkPopup";
import Loading from "../../Loading/Loading";

const PickedMeUsers = ({ currentUser, isLinkPopupOpen, setIsLinkPopupOpen }) => {
  const [pickedMeUsers, setPickedMeUsers] = useState(null);
  const [isLoadingOpen, setIsLoadingOpen] = useState(true);

  const removePick = async (index) => {
    const { pickedMeUsers, id } = currentUser;
    const pickedMeUsersLocal = [...pickedMeUsers];

    pickedMeUsersLocal.splice(index, 1);

    await updateDoc(doc(db, "users", id), {
      pickedMeUsers: pickedMeUsersLocal,
    });
  };

  const getPickedMeUsers = async () => {
    const { pickedMeUsers: pickedMeUsersData } = currentUser;

    if (pickedMeUsersData.length === 0) {
      setPickedMeUsers([]);
    } else {
      if (pickedMeUsers === null) {
        const pickedMeUsersLocal = [];
        pickedMeUsersData.forEach(async (user, index, array) => {
          const { userId, messageId, message } = user;
          const docSnap = await getDoc(doc(db, "users", userId));
          const { profileImage, username } = docSnap.data();

          pickedMeUsersLocal.push({
            messageId: messageId,
            message: message,
            profileImage: profileImage,
            username: username,
          });

          if (index === array.length - 1) {
            setPickedMeUsers(pickedMeUsersLocal);
          }
        });
      } else if (pickedMeUsersData.length > pickedMeUsers.length) {
        const pickedMeUsersLocal = [...pickedMeUsers];
        const { userId, message, messageId } = pickedMeUsersData[pickedMeUsersData.length - 1]; // Prevent getting all users on new pick. Just getting the last one
        const docSnap = await getDoc(doc(db, "users", userId));
        const { profileImage, username } = docSnap.data();

        pickedMeUsersLocal.push({
          messageId: messageId,
          message: message,
          profileImage: profileImage,
          username: username,
        });

        const notification = new Notification(`${username} zaczepił Cię!`, {
          body: message,
          icon: profileImage !== null ? profileImage : require("./defaultUser.png"),
        });

        setPickedMeUsers(pickedMeUsersLocal);
      } else if (pickedMeUsersData.length < pickedMeUsers.length) {
        const pickedMeUsersLocal = [...pickedMeUsers];
        pickedMeUsers.forEach((oldUser, index) => {
          const { messageId: messageIdFromOld } = oldUser;

          const isThisPickExist = pickedMeUsersData.some((newUser) => {
            const { messageId: messageIdFromNew } = newUser;
            return messageIdFromOld === messageIdFromNew;
          });

          if (!isThisPickExist) {
            pickedMeUsersLocal.splice(index, 1);
            setPickedMeUsers(pickedMeUsersLocal);
          }
        });
      }
    }

    //console.log(pickedMeUsersData);
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
              <div className="user" onClick={(event) => removePick(index)}>
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
