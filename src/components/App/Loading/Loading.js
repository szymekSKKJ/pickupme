import { useEffect, useRef } from "react";
import "./Loading.css";

const Loading = ({ valueToWait, setIsLoadingOpen, closeImmediately = false }) => {
  const loadingRef = useRef(undefined);
  const valueToWaitConverted = valueToWait === undefined ? null : valueToWait === null ? null : valueToWait;
  const displayOffLoading = () => {
    const loadingElement = loadingRef.current;
    if (valueToWaitConverted !== null) {
      closeImmediately
        ? setIsLoadingOpen(false)
        : setTimeout(() => {
            loadingElement.style.opacity = "0";
            setTimeout(() => {
              setIsLoadingOpen(false);
            }, 750);
          }, 333);
    }
  };

  useEffect(() => {
    displayOffLoading();
  }, [valueToWait]);
  return (
    <div className="loading" ref={loadingRef}>
      <div id="loader"></div>
    </div>
  );
};

export default Loading;
