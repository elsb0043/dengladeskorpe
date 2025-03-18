import styles from "./text.module.css"

function ContactText() {

    return (
        <div className={styles.text}>
            <h2>Har du spørgsmål eller ønsker du at bestille din favoritpizza?</h2>
            <p>Udfyld formularen herunder, så vender vi hurtigt tilbage til dig. Vi glæder os til at høre fra dig!</p>
        </div>
    )
}

export default ContactText