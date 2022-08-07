import Button from "../../../Button/Button";
import "./LinkPopup.css";

const LinkPopup = ({ currentUser, setIsLinkPopupOpen }) => {
  const setFirstLogin = () => {
    const linkPopupElement = document.querySelector(".link-popup");
    linkPopupElement.style.opacity = "1";
    linkPopupElement.style.animation = "unset";
    localStorage.setItem("firstLogin", "false");

    setTimeout(() => {
      linkPopupElement.style.animation = "apearLinkPopup 750ms forwards reverse";
      setTimeout(() => {
        setIsLinkPopupOpen(false);
      }, 750); // Time of animatin duration
    }, 0);
  };

  return (
    <div className="link-popup" onClick={() => setFirstLogin()}>
      <div className="content" onClick={(event) => event.stopPropagation()}>
        <h1>Hurrra!</h1>
        <p> O to Twój link do pokoju:</p>
        <p className="home-link">{`https://pickupme.netlify.app/?home=${currentUser.id}`}</p>
        <p>Ty jako zarządca swojego pokoju wchodzisz bez podawania tego linku. Wystarczy, że jesteś zalogowany na stronie głównej.</p>
        <p>Chyba, że chcesz zaczepić samego siebie :)</p>
        <Button action={() => setFirstLogin()}>Miłej zabawy!</Button>
      </div>
    </div>
  );
};
export default LinkPopup;
