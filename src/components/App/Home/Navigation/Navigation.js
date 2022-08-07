import "./Navigation.css";
import signOutUser from "../../../../customs/signOutUser";

const Navigation = ({ setIsLinkPopupOpen, setCurrentUser, setIsLoadingOpenFromAppComponent }) => {
  const openLinkPopup = () => {
    setIsLinkPopupOpen(true);
  };

  return (
    <div className="navigation">
      <button className="change-profile-image-button" title="Zmień zdjęcie profilowe">
        <i className="fa-solid fa-image-polaroid-user"></i>
      </button>
      <button className="link-button" onClick={() => openLinkPopup()} title="Link do zaczepek">
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
