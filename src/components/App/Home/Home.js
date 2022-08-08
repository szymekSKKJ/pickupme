import "./Home.css";
import { useState } from "react";
import Navigation from "./Navigation/Navigation";
import PickedMeUsers from "./PickedMeUsers/PickedMeUsers";
import ImageEditor from "./ImageEditor/ImageEditor";
const Home = ({ currentUser, setCurrentUser, setIsLoadingOpenFromAppComponent }) => {
  const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(localStorage.getItem("firstLogin") === null ? true : false);
  const [isPickedMeUsersOpen, setIsPickedMeUsersOpen] = useState(true);
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);

  return (
    <>
      <Navigation
        setIsLoadingOpenFromAppComponent={setIsLoadingOpenFromAppComponent}
        setCurrentUser={setCurrentUser}
        setIsLinkPopupOpen={setIsLinkPopupOpen}
        setIsPickedMeUsersOpen={setIsPickedMeUsersOpen}
        setIsImageEditorOpen={setIsImageEditorOpen}></Navigation>
      <div className="home">
        {isPickedMeUsersOpen && (
          <PickedMeUsers currentUser={currentUser} isLinkPopupOpen={isLinkPopupOpen} setIsLinkPopupOpen={setIsLinkPopupOpen}></PickedMeUsers>
        )}
        {isImageEditorOpen && <ImageEditor currentUser={currentUser} setIsImageEditorOpen={setIsImageEditorOpen}></ImageEditor>}
      </div>
    </>
  );
};

export default Home;
