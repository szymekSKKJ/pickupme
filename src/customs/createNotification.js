import { doc } from "firebase/firestore";

const createNotification = (content, error = false) => {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add("notification");
  notificationElement.innerHTML = `<p>${content}</p>`;
  error ? (notificationElement.style.backgroundColor = "rgba(255, 128, 128, 0.5)") : (notificationElement.style.backgroundColor = "rgba(128, 255, 128, 0.50)");
  document.body.appendChild(notificationElement);
  setTimeout(() => {
    notificationElement.style.transform = "translateY(0%)";
    notificationElement.style.animation = "unset";
    setTimeout(() => {
      notificationElement.style.animation = "apearNorification 500ms forwards reverse";
      setTimeout(() => {
        notificationElement.remove();
      }, 500);
    }, 1);
  }, 3000);
};

export default createNotification;
