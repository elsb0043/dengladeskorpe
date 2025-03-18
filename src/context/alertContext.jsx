import { createContext, useContext } from "react"
import Swal from "sweetalert2"

// OPRET CONTEXT 
const AlertContext = createContext() // `createContext` opretter en ny Context, der bruges til at dele state og funktioner på tværs af komponenter 

// Custom Hook til at bruge AlertContext
export const useAlert = () => useContext(AlertContext) // Dette er en custom hook, som gør det lettere at tilgå `AlertContext` i andre komponenter  

export const AlertProvider = ({ children }) => {
  // Denne funktion viser en generel alert baseret på de `options`, der sendes som argument  
  const showAlert = (options) => {
    Swal.fire(options) // `Swal.fire` er en funktion fra SweetAlert2 til at vise popups
  }

  // VIS SUCCESBESKED
  const showSuccess = (title, text) => {
    Swal.fire({
      title: title || "Success!", // Hvis der ikke gives en titel, bruges "Success!"
      text: text, // Tekst der vises i alerten
      icon: "success", // Viser succes-ikon
      confirmButtonText: "OK", // Tekst på bekræftelsesknappen
      timer: 2000, // Alerten lukkes automatisk efter 2000ms (2 sekunder)
      timerProgressBar: true, // Viser en progress-bar, mens alerten er åben
    })
  }

  // VIS FEJLBESKED
  const showError = (title, text) => {
    Swal.fire({
      title: title || "Fejl!", // Hvis der ikke gives en titel, bruges "Fejl!"
      text: text, // Tekst der vises i alerten
      icon: "error", // Viser fejl-ikon
      confirmButtonText: "OK", // Tekst på bekræftelsesknappen
      timer: 2000, // Alerten lukkes automatisk efter 2000ms (2 sekunder)
      timerProgressBar: true, // Viser en progress-bar, mens alerten er åben
    })
  }

  // VIS BEKRÆFELSESPOPUP
  const showConfirmation = (title, text, onConfirm, onCancel, htmlContent) => {
    Swal.fire({
      title: title || "Er du sikker?", // Hvis der ikke gives en titel, bruges "Er du sikker?"
      text: text || "Du kan ikke fortryde denne handling!", // Hvis der ikke gives tekst, bruges denne standardbesked
      html: htmlContent, // Hvis der er ekstra HTML-content, tilføjes det her
      icon: "warning", // Viser advarselsikon
      showCancelButton: true, // Viser en "Annuller"-knap
      confirmButtonText: "Ja, fortsæt", // Tekst på bekræftelsesknappen
      cancelButtonText: "Annuller", // Tekst på annulleringsknappen
      customClass: {
        confirmButton: "custom-confirm-button", // CSS-klasse til bekræftelsesknappen
        cancelButton: "custom-cancel-button", // CSS-klasse til annulleringsknappen
      },
      buttonsStyling: false, // Deaktiverer standard styling på knapperne
    }).then((result) => {
      if (result.isConfirmed) {
        // Hvis brugeren trykker på "Ja, fortsæt", kaldes `onConfirm`
        onConfirm?.()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Hvis brugeren trykker på "Annuller", kaldes `onCancel`
        onCancel?.()
      }
    })
  }

  return (
    // RETURNERER EN CONTEXT PROVIDER
    // `value` indeholder de funktioner, som bliver tilgængelige i andre komponenter via `useAlert`
    <AlertContext.Provider
      value={{
        showAlert,
        showSuccess,
        showError,
        showConfirmation,
      }}
    >
      {children} {/* children er de underliggende komponenter, der får adgang til context */}
    </AlertContext.Provider>
  )
}