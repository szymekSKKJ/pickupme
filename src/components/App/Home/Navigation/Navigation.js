import "./Navigation.css";
import signOutUser from "../../../../customs/signOutUser";
import createNotification from "../../../../customs/createNotification";

const Navigation = ({ setIsLinkPopupOpen, setCurrentUser, setIsLoadingOpenFromAppComponent, setIsPickedMeUsersOpen, setIsImageEditorOpen }) => {
  const closeOtherOpenedComponents = () => {
    setIsImageEditorOpen(false);
  };

  return (
    <div className="navigation">
      <button
        className="home-button"
        onClick={() => {
          closeOtherOpenedComponents();
          setIsPickedMeUsersOpen(true);
        }}
        title="Zaczepki">
        <i className="fa-solid fa-house-chimney"></i>
      </button>
      <button
        className="change-profile-image-button"
        onClick={(event) => {
          closeOtherOpenedComponents();
          setIsImageEditorOpen(true);
        }}
        title="Zmień zdjęcie profilowe">
        <i className="fa-solid fa-image-polaroid-user"></i>
      </button>
      <button className="link-button" onClick={() => setIsLinkPopupOpen(true)} title="Link do zaczepek">
        <i className="fa-solid fa-link"></i>
      </button>
      <button
        className="logout-button"
        onClick={() => {
          setIsLoadingOpenFromAppComponent(true);
          signOutUser(setCurrentUser);
        }}
        title="Wyloguj się">
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </div>
  );
};

export default Navigation;
