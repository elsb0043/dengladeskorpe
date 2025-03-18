import { useState } from "react"
import Button from "../../Button/Button"
import styles from "./form.module.css"

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: "", topic: "", description: "" }) // State til at gemme form data (navn, emne, beskrivelse)
    const [response, setResponse] = useState(null) // State til at gemme svarmeddelelse, f.eks. succes eller fejl
    const [errors, setErrors] = useState({}) // State til at gemme fejlbeskeder, som opstår ved validering
    const [sent, setSent] = useState(false) // State til at holde styr på, om beskeden er sendt

    // Funktion til at validere formularen
    const validate = () => {
        let newErrors = {}

        // Hvis der er noget galt med de indtastede data (fx et tomt navn eller en ugyldig emne), bliver der lagt en fejlbesked i newErrors-objektet
        if (!formData.name.trim()) newErrors.name = "Navn er påkrævet" // Tjek om navn er tomt (trim( fjerner ekstra mellemrum før og efter en tekststreng))
        if (!formData.topic.trim()) newErrors.topic = "Ugyldigt emne" // Tjek om emne er valid
        if (!formData.description.trim()) newErrors.description = "Beskrivelse er påkrævet" // Tjek om beskrivelse er tom

        return newErrors
    }

    // Funktion til at håndtere formularens submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validér formularen, og hvis der er fejl, opdater fejlbeskederne
        const validationErrors = validate()

        // Object.keys() returnere en liste med nøglerne: ["name", "emne"]
        if (Object.keys(validationErrors).length > 0) { // Object en måde at gemme data i "nøgleværdi"-par, fx "name" og "John", og keys bruges til at hente alle nøglerne fra et objekt som en liste (array), fx { name: "John", topic: gmail.com }
            setErrors(validationErrors)
            return
        }
        // Hvis der ikke er fejl, nulstilles fejlbeskederne
        setErrors({})

        try {
            // Promise hjælper dig med at håndtere tidspunkter, hvor du skal vente på noget (som f.eks. en forsinkelse eller en serveranmodning)
            await new Promise((resolve) => setTimeout(resolve, 500))

            const { name } = formData

            // Sætter succesbeskeden, som vises efter indsendelse
            setResponse(`Hej ${name}! Din besked er blevet sendt.`)
            setSent(true)
        } catch {
            // Hvis der opstår en fejl, vises en fejlbesked
            setResponse("Der opstod en fejl. Prøv venligst igen.")
        }

        // Gemmer dataene i localStorage
        const { name, topic, description } = formData
        const contactData = {
            name,
            topic,
            description,
            date: new Date().toISOString()
        }

        // Henter eksisterende kontaktformularer fra localStorage, eller en tom liste, hvis der ikke er nogen
        const contactFormular = JSON.parse(localStorage.getItem('contactHistory')) || []

        // Gemmer den nye kontaktformular i localStorage
        localStorage.setItem('contactHistory', JSON.stringify([...contactFormular, contactData]))

        // Nulstiller formularens data, så den er klar til en ny indsendelse
        setFormData({ name: "", topic: "", description: "" })
    }

    return (
        <div className={styles.formContent}>
            {sent ? (
                // Hvis beskeden er sendt, vis en succesbesked
                <h3 className={styles.successMsg}>{response}</h3>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        {/* Input for navn */}
                        <label>Navn</label>
                        <input
                            className={styles.name}
                            required
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {/* Vis fejlbesked, hvis der er en */}
                        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

                        {/* Input for topic */}
                        <label>Emne</label>
                        <input
                            className={styles.topic}
                            required
                            name="topic"
                            type="text"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                        {/* Vis fejlbesked, hvis der er en */}
                        {errors.topic && <p style={{ color: "red" }}>{errors.topic}</p>}

                        {/* Textarea for beskrivelse */}
                        <label>Beskrivelse</label>
                        <textarea
                            required
                            name="description"
                            className={styles.textarea}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        {/* Vis fejlbesked, hvis der er en */}
                        {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}

                        {/* Send-knap */}
                        <Button text="Send" type="type" />
                    </form>
                </>
            )}
        </div>
    )
}

export default ContactForm