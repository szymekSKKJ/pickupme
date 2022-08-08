import "./ImageEditor.css";
import AvatarEditor from "react-avatar-editor";
import { useEffect, useRef, useState } from "react";
import Button from "../../../Button/Button";
import createNotification from "../../../../customs/createNotification";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../initializeFirebase";
import Loading from "../../Loading/Loading";

const ImageEditor = ({ setIsImageEditorOpen, currentUser }) => {
  const [imageToEdit, setImageToEdit] = useState(null);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const [isImageSet, setIsImageSet] = useState(null);
  const editor = useRef(null);

  const saveImage = async () => {
    setIsLoadingOpen(true);
    const imageBase64 = editor.current.getImageScaledToCanvas().toDataURL();

    await updateDoc(doc(db, "users", currentUser.id), {
      profileImage: imageBase64,
    });
    setIsImageSet(true);
    setIsImageEditorOpen(false);
    createNotification("Zdjęcie zostało zaaktulizowane");
  };

  const askUserForImage = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.hidden = true;

    input.addEventListener(
      "click",
      () => {
        window.addEventListener(
          "focus",
          () => {
            setTimeout(() => {
              if (input.files.length === 0) {
                const imageEditorElement = document.querySelector(".image-editor");
                imageEditorElement.style.transform = "translateX(0px)";
                imageEditorElement.style.animation = "unset";
                setTimeout(() => {
                  imageEditorElement.style.animation = "apearImageEditor 500ms forwards reverse";
                  setTimeout(() => {
                    setIsImageEditorOpen(false);
                  }, 500);
                }, 20);

                createNotification("Nie wybrano zdjęcia", "error");
              }
            }, 250);
          },
          { once: true }
        );
      },
      { onceL: true }
    );

    input.click();
    const reader = new FileReader();

    input.onchange = () => {
      if (input.files[0].type.includes("image")) {
        reader.onloadend = () => {
          setImageToEdit(reader.result);
          input.remove();
        };

        reader.readAsDataURL(input.files[0]);
      } else {
        const imageEditorElement = document.querySelector(".image-editor");
        imageEditorElement.style.transform = "translateX(0px)";
        imageEditorElement.style.animation = "unset";
        setTimeout(() => {
          imageEditorElement.style.animation = "apearImageEditor 500ms forwards reverse";
          setTimeout(() => {
            setIsImageEditorOpen(false);
          }, 500);
        }, 20);
        createNotification("Wybrane zdjęcie jest w niewłaściwym formacie", "error");
      }
    };
  };

  useEffect(() => {
    askUserForImage();
  }, []);

  return (
    <>
      {isLoadingOpen && <Loading setIsLoadingOpen={setIsLoadingOpen} valueToWait={isImageSet}></Loading>}
      <div className="image-editor">
        <p>Tutaj możesz ustawić zdjęcie, po którym Twoi bliscy będą mogli Cię rozpoznać i zobaczyć podczas zaczepki</p>
        <AvatarEditor ref={editor} image={imageToEdit} width={256} height={256} border={25} color={[0, 0, 0, 0.5]} scale={1.25} rotate={0} />
        <Button action={() => saveImage()}>Zapisz</Button>
      </div>
    </>
  );
};

export default ImageEditor;
