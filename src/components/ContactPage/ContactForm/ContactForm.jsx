import { useState } from "react" // Import af React's useState hook
import Button from "../../Button/Button" // Import af genanvendelig Button-komponent
import styles from "./form.module.css" // Import af CSS-modul til styling
import SuccessMsg from "../../SuccessMsg/SuccessMsg" // Import af succesmeddelelseskomponent
import { RxCross2 } from "react-icons/rx" // Import af krydsikon fra react-icons

function ContactForm() {
    // useState hook til at håndtere tilstand i komponenten
    const [formData, setFormData] = useState({ name: "", topic: "", description: "" }) // Formulardata
    const [response, setResponse] = useState(null) // Responsmeddelelse efter indsendelse
    const [errors, setErrors] = useState({}) // Fejlmeddelelser, hvis der er problemer med validering
    const [sent, setSent] = useState(false) // Håndterer om formularen er sendt

    const closeMsg = () => setSent(false) // Funktion til at lukke succesmeddelelsen

    // Validering af formulardata
    const validate = () => {
        let newErrors = {} // Objekt til at holde fejl
        // Validering af de enkelte felter
        if (!formData.name.trim()) newErrors.name = "Navn er påkrævet"
        if (!formData.topic.trim()) newErrors.topic = "Ugyldigt emne"
        if (!formData.description.trim()) newErrors.description = "Beskrivelse er påkrævet"
        return newErrors // Returnér fejlene
    }

    // Funktion til at håndtere formularindsendelse
    const handleSubmit = async (e) => {
        e.preventDefault() // Forhindre standardformularindsendelse (reload af siden)

        const validationErrors = validate() // Valider formularen
        if (Object.keys(validationErrors).length > 0) { // Hvis der er valideringsfejl
            setErrors(validationErrors) // Sæt fejlmeddelelser i state
            return // Stop indsendelse af formularen
        }

        setErrors({}) // Ryd fejlloggen, hvis formularen er korrekt

        try {
            // Simulering af en forsinkelse (kan være API-anmodning i en virkelig applikation)
            await new Promise((resolve) => setTimeout(resolve, 500))

            const { name } = formData
            // Sæt succesmeddelelse
            setResponse(`Tak for din besked ${name}! Vi vender tilbage hurtigst muligt.`)
            setSent(true) // Formularen er sendt
        } catch {
            // Hvis der opstår en fejl under indsendelse
            setResponse("Der opstod en fejl. Prøv venligst igen.")
        }

        // Gem formulardata i localStorage (kan bruges til at vise tidligere indsendte beskeder)
        const { name, topic, description } = formData
        const contactData = { name, topic, description, date: new Date().toISOString() } // Kontaktdata
        const contactHistory = JSON.parse(localStorage.getItem('contactHistory')) || [] // Hent eksisterende kontaktdata
        localStorage.setItem('contactHistory', JSON.stringify([...contactHistory, contactData])) // Gem ny kontaktdata

        // Reset formularen
        setFormData({ name: "", topic: "", description: "" })
    }

    return (
        <div className={styles.formContent}>
            {sent ? (
                // Hvis formularen er sendt, vis succesmeddelelsen
                <div className={styles.successWrapper}>
                    <SuccessMsg message={response} onClick={closeMsg} /> {/* Vis succesbesked */}
                    <div className={styles.closeButton} onClick={closeMsg}>
                        <RxCross2 size={60} /> {/* Luk succesmeddelelsen med et krydsikon */}
                    </div>
                </div>
            ) : (
                // Hvis formularen ikke er sendt, vis formularen
                <form onSubmit={handleSubmit}>
                    {/* Navn Input */}
                    <label>Navn</label>
                    <input
                        className={styles.name}
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} // Opdater formData ved ændring af navn
                    />
                    {errors.name && <p style={{ color: "red" }}>{errors.name}</p>} {/* Vis fejlmeddelelse, hvis der er en fejl i navn */}

                    {/* Emne Input */}
                    <label>Emne</label>
                    <input
                        className={styles.topic}
                        name="topic"
                        type="text"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })} // Opdater formData ved ændring af emne
                    />
                    {errors.topic && <p style={{ color: "red" }}>{errors.topic}</p>} {/* Vis fejlmeddelelse, hvis der er en fejl i emne */}

                    {/* Beskrivelse Input */}
                    <label>Beskrivelse</label>
                    <textarea
                        className={styles.textarea}
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} // Opdater formData ved ændring af beskrivelse
                    />
                    {errors.description && <p style={{ color: "red" }}>{errors.description}</p>} {/* Vis fejlmeddelelse, hvis der er en fejl i beskrivelse */}

                    {/* Submit Button */}
                    <Button text="Send" type="submit" /> {/* Send formularen */}
                </form>
            )}
        </div>
    )
}

export default ContactForm