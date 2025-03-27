import { useState } from "react"
import Button from "../../Button/Button"
import styles from "./form.module.css"
import SuccessMsg from "../../SuccessMsg/SuccessMsg"
import { RxCross2 } from "react-icons/rx"

function ContactForm() {
    const [formData, setFormData] = useState({ name: "", subject: "", description: "" })
    const [response, setResponse] = useState(null)
    const [errors, setErrors] = useState({})
    const [sent, setSent] = useState(false)

    const closeMsg = () => setSent(false)

    const validate = () => {
        let newErrors = {}
        if (!formData.name.trim()) newErrors.name = "Navn er påkrævet"
        if (!formData.subject.trim()) newErrors.subject = "Ugyldigt emne"
        if (!formData.description.trim()) newErrors.description = "Beskrivelse er påkrævet"
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({})

        console.log("Form data being sent:", formData) 

        try {
            // Send formulardata til API'et
            const response = await fetch("http://localhost:3042/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error("Der opstod en fejl med serveren.")
            }

            // Hvis anmodningen lykkes, vis succesbesked
            setResponse(`Tak for din besked ${formData.name}! Vi vender tilbage hurtigst muligt.`)
            setSent(true)

            // Gem formulardata i localStorage
            const contactData = { ...formData, date: new Date().toISOString() }
            const contactHistory = JSON.parse(localStorage.getItem("contactHistory")) || []
            localStorage.setItem("contactHistory", JSON.stringify([...contactHistory, contactData]))

            // Reset formularen
            setFormData({ name: "", subject: "", description: "" })
        } catch (error) {
            // Hvis der opstår en fejl under indsendelsen
            setResponse("Der opstod en fejl. Prøv venligst igen.")
        }
    }

    return (
        <div className={styles.formContent}>
            {sent ? (
                <div className={styles.successWrapper}>
                    <SuccessMsg message={response} onClick={closeMsg} />
                    <div className={styles.closeButton} onClick={closeMsg}>
                        <RxCross2 size={60} />
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>Navn</label>
                    <input
                        className={styles.name}
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

                    <label>Emne</label>
                    <input
                        className={styles.subject}
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                    {errors.subject && <p style={{ color: "red" }}>{errors.subject}</p>}

                    <label>Beskrivelse</label>
                    <textarea
                        className={styles.textarea}
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}

                    <Button text="Send" type="submit" />
                </form>
            )}
        </div>
    )
}

export default ContactForm