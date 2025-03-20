import { useState } from 'react' // Import af indbygget React hook 'useState'
import { useBasket } from '../../../context/basketContext' // Import af custom hook til basket context
import { icons } from '../../../services/Icons' // Import af ikoner, der bruges i komponenten
import styles from './order.module.css' // Import af CSS-modul til styling
import Button from '../../Button/Button' // Import af genanvendelig Button-komponent
import SuccessMsg from '../../SuccessMsg/SuccessMsg' // Import af genanvendelig SuccessMsg-komponent
import { RxCross2 } from "react-icons/rx" // Import af krydsikon fra react-icons

function Order() {
    // useState hook til at håndtere state i komponenten
    const [comment, setComment] = useState('') // Kommentar inputfelt for brugerens bestilling
    const [isSubmitted, setIsSubmitted] = useState(false) // Håndterer om bestillingen er afsendt
    const [response, setResponse] = useState(null) // Håndterer succes eller fejlmeddelelser efter bestilling

    // Hent basket (kurv) fra context
    const { basket, clearBasket, removeFromBasket } = useBasket()

    // Beregn totalbeløbet for alle retter i kurven
    const total = (basket || []).reduce((acc, dish) => acc + dish.price, 0)

    // Funktion til at håndtere formularindsendelse
    const handleSubmit = async (e) => {
        e.preventDefault() // Forhindre standardformularindsendelse

        try {
            // Simulerer en forsinkelse for at vise en loading-tilstand (kan f.eks. være en API-anmodning)
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Data, der sendes med bestillingen
            const orderData = {
                dishes: basket, // Retterne i kurven
                total, // Den samlede pris
                date: new Date().toISOString(), // Dato for bestillingen
                comment: comment || '', // Kommentar fra brugeren
            }

            // Gem bestillingen i 'localStorage', så den kan hentes senere
            const existingOrders = JSON.parse(localStorage.getItem('orderHistory')) || [] // Hent eksisterende ordrer
            localStorage.setItem('orderHistory', JSON.stringify([...existingOrders, orderData])) // Gem ny ordre

            // Sæt success-besked og ryd kurven
            setResponse(`Tak for din bestilling`)
            setIsSubmitted(true)
            clearBasket() // Ryd kurven efter bestilling
            setComment('') // Ryd kommentar inputfeltet
        } catch {
            // Hvis der sker en fejl under bestillingen
            setIsSubmitted(true)
            setResponse("Der opstod en fejl. Prøv venligst igen.")
        }
    }

    // Funktion til at lukke succesmeddelelsen
    const closeMsg = () => setIsSubmitted(false)

    return (
        <div className={styles.orderContainer}>
            <div className={styles.orderContent}>
                {isSubmitted ? ( // Hvis bestillingen er afsendt, vis en succesbesked
                    <div className={styles.successWrapper}>
                        <SuccessMsg message={response} onClick={closeMsg} /> {/* Vis succesbesked */}
                        <div className={styles.closeButton} onClick={closeMsg}>
                            <RxCross2 size={60} /> {/* Luk ikon */}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Hvis bestillingen ikke er afsendt, vis ordren */}
                        <div className={styles.orderContentText}>
                            <h2>Bestilling</h2>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.orderFormContainer}>
                            <div className={styles.orderForm}>
                                <ul>
                                    {basket && basket.length > 0 ? ( // Hvis kurven ikke er tom
                                        basket.map((dish, index) => (
                                            <div key={dish._id} className={styles.formContent}>
                                                <div className={styles.formContentOrder}>
                                                    <h3>1 X</h3>
                                                    <img src={dish.image} alt={dish.title} />
                                                    <li>{dish.title}</li>
                                                    <div className={styles.formContentRemove} onClick={() => removeFromBasket(index)}>
                                                        <div>{icons['Remove']}</div> {/* Vis fjern-ikon */}
                                                    </div>
                                                </div>

                                                {/* Vis detaljer om hver ret */}
                                                <div className={styles.orderDetails}>
                                                    <div className={styles.detail}>Ekstra:</div>
                                                    <div className={styles.value}>{dish.toppings?.join(", ") || "Ingen"}</div>
                                                </div>
                                                <div className={styles.orderDetails}>
                                                    <div className={styles.detail}>Størrelse:</div>
                                                    <div className={styles.value}>{dish.size}</div>
                                                </div>
                                                <div className={styles.orderDetails}>
                                                    <div className={styles.detail}>Pris:</div>
                                                    <div className={styles.value}>{dish.price},-</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.formContent}>
                                            <p>Ingen retter tilføjet</p> {/* Hvis kurven er tom */}
                                        </div>
                                    )}
                                </ul>
                                <div className={styles.formIAlt}>
                                    <h3 className={styles.alt}>I alt:</h3>
                                    <h3>{total},-</h3> {/* Vis totalbeløbet */}
                                </div>
                                <textarea
                                    className={styles.orderComment}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)} // Opdater kommentarens state
                                    placeholder="Kommentarer til ordren"
                                />
                                <Button type="submit" text="Afgiv Ordre" /> {/* Vis knap til at afgive ordre */}
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default Order