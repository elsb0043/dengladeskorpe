import { useState } from 'react'
import { useBasket } from '../../../context/basketContext'
import { icons } from '../../../services/Icons'
import styles from './order.module.css'
import Button from '../../Button/Button'

function Order() {
    // Henter nødvendige funktioner og værdier fra BasketContext
    const { basket, clearBasket, removeFromBasket } = useBasket()
    // State til email-input og formularens submit-status
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Beregner totalbeløbet af produkterne i kurven
    const total = basket.reduce((acc, dish) => acc + dish.price, 0) // reduce går gennem hvert produkt og lægger deres priser sammen (acc (accumulator) er en værdi, som starter på 0)

    // Funktion til at håndtere formularens submit
    const handleSubmit = (e) => {
        e.preventDefault()

        // Opretter et objekt med ordredetaljer
        const orderData = {
            email,
            dishes: basket,
            total,
            date: new Date().toISOString(), // Gemmer den aktuelle dato og tid
        }

        // Henter eksisterende ordrer fra localStorage (eller en tom array, hvis ingen findes)
        const existingOrders = JSON.parse(localStorage.getItem('orderHistory')) || []

        // Tilføjer den nye ordre til historikken og gemmer den tilbage i localStorage
        localStorage.setItem('orderHistory', JSON.stringify([...existingOrders, orderData]))

        // Tømmer kurven og resetter email og submit-status
        clearBasket()
        setEmail('')
        setIsSubmitted(true)
    }

    return (
        <div className={styles.orderContainer}>
            <div className={styles.orderContent}>
                {/* Vist hvis ordren er blevet sendt */}
                {isSubmitted ? (
                    <div className={styles.successMessage}>
                        <h2>Tak for din bestilling!</h2>
                    </div>
                ) : (
                    <>
                        {/* Form med information om bestillingen */}
                        <div className={styles.orderContentText}>
                            <h2>Bestilling</h2>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.orderFormContainer}>
                            <div className={styles.orderForm}>
                            <h3>1 X</h3>
                                <ul>
                                    {/* Viser produkterne i kurven */}
                                    {basket.map((dish, index) => (
                                        <div key={dish._id} className={styles.formContent}>
                                            <div className={styles.formContentOrder}>
                                                <img src={dish.image} />
                                                <li className={styles.formContentDish}>{dish.title}</li>
                                            </div>
                                            {/* Fjern produkt fra kurven ved klik */}
                                            <div className={styles.formContentRemove} onClick={() => removeFromBasket(index)}>
                                                <div>{icons['X']}</div>
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                                {/* Vist når produkter er tilføjet, ekstra toppings */}
                                <div className={styles.orderDetails}>
                                    <h3 className={styles.detail}>Ekstra:</h3>
                                    <h3>{total},-</h3>
                                </div>
                                {/* Vist når produkter er tilføjet, størrelse */}
                                <div className={styles.orderDetails}>
                                    <h3 className={styles.detail}>Størrelse:</h3>
                                    <h3>{total},-</h3>
                                </div>
                            </div>
                            {/* Vist når produkter er tilføjet, pris */}
                            <div className={styles.orderPrice}>
                                <h3 className={styles.price}>Pris:</h3>
                                <h3>{total},-</h3>
                            </div>
                            {/* Vist samlet total i kurven */}
                            <div className={styles.formIAlt}>
                                <h3 className={styles.alt}>I alt:</h3>
                                <h3>{total},-</h3>
                            </div>
                            <textarea
                                className={styles.orderComment}
                                required
                                name="description"
                                placeholder='Kommentarer til ordren'
                                
                            />
                            {/* Knappen til at afgive ordren */}
                            <Button type='submit' text="Afgiv Ordre" />
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default Order