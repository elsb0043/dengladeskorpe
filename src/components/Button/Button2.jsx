import styles from "./button.module.css" // Import af CSS-modul til at style knappen

// Button2 komponenten er en funktionel komponent, der tager props og returnerer et knappeelement
const Button2 = ({ buttonText, background, type = "button", onClick }) => {

  return (
    <button
      // Dynamisk tildeling af CSS-klasse baseret på 'background' prop
      className={
        background === "red" // Hvis 'background' er "red", anvendes redButton-stil
          ? styles.redButton
          : background === "green" // Hvis 'background' er "green", anvendes grayButton-stil
          ? styles.grayButton
          : styles.orangeButton // Ellers anvendes orangeButton-stilen
      }
      onClick={onClick} // Når knappen bliver klikket, kaldes 'onClick' funktionen
      type={type} // type= "button" som standard, kan ændres til "submit" eller "reset"
    >
      {buttonText} {/* Vist tekst på knappen, baseret på 'buttonText' prop */}
    </button>
  )
}

export default Button2