import Button from "../../Button/Button";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../initializeFirebase";
import "./PickUser.css";
import { useEffect, useState } from "react";
import createNotification from "../../../customs/createNotification";
import Loading from "../Loading/Loading";

const PickUser = ({ homeIdFromUrl, currentUser }) => {
  const [isUserExist, setIsUserExist] = useState(undefined);
  const [isLoadingOpen, setIsLoadingOpen] = useState(true);
  const currentPickUpUser = isUserExist;

  const isEmpty = (str) => !str.trim().length;

  const sendMessage = async (event) => {
    const textareaElement = event.target.parentElement.querySelector("#pick-user-message");
    textareaElement.style.height = "52px";

    if (!isEmpty(textareaElement.value)) {
      await updateDoc(doc(db, "users", homeIdFromUrl), {
        pickedMeUsers: arrayUnion({
          id: currentUser.id,
          message: textareaElement.value,
        }),
      });
      createNotification("Wiadomość wysłana");
    } else {
      createNotification("Najpier napisz wiadomość", "error");
      textareaElement.focus();
    }

    event.target.parentElement.reset();
  };

  const getUserData = async () => {
    const docSnap = await getDoc(doc(db, "users", homeIdFromUrl));

    if (docSnap.exists()) {
      const { username, profileImage, pickedMeUsers } = docSnap.data();
      setIsUserExist({ username: username, profileImage: profileImage, pickedMeUsers: pickedMeUsers });
    } else {
      setIsUserExist(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="pick-user">
      {isLoadingOpen && <Loading setIsLoadingOpen={setIsLoadingOpen} valueToWait={isUserExist}></Loading>}
      {isUserExist !== undefined && isUserExist !== false ? (
        <>
          <div className="pick-user-profile-image-and-username">
            {currentPickUpUser.profileImage === null ? <i className="fa-solid fa-user"></i> : <img src={currentPickUpUser.profileImage}></img>}
            <p>{currentPickUpUser.username}</p>
          </div>
          <form id="pick-user-form" spellCheck="false" noValidate onSubmit={(event) => event.preventDefault()}>
            <div className="input-wrapper">
              <textarea
                id="pick-user-message"
                placeholder="Napisz wiadomość"
                required
                onInput={(event) => {
                  event.target.style.height = "52px";
                  event.target.style.height = event.target.scrollHeight + "px";
                }}></textarea>
              <label htmlFor="pick-user-message">Napisz wiadomość</label>
            </div>
            <Button action={(event) => sendMessage(event)}>Zaczep mnie!</Button>
          </form>
        </>
      ) : null}
    </div>
  );
};

export default PickUser;
