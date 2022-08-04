import "./Button.css";

const Button = ({ children, action }) => {
  return (
    <button className="main-button" type="submit" onClick={(event) => action(event)}>
      {children}
    </button>
  );
};

export default Button;
