import styles from "./button.module.css"

const Button2 = ({buttonText, background, type = "button", onClick}) => {

  return (
    <button
      className={
        background === "red"
          ? styles.redButton
          : background === "green"
          ? styles.grayButton
          : styles.orangeButton
      }
      onClick={onClick}
      type={type}>
        {buttonText}
    </button>
  )
}

export default Button2