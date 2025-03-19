import { useEffect, useState } from "react"
import { useFetchDishes } from "../../../hooks/useFetchDishes"
import DishCard from "./dishCard/DishCard"
import styles from './dishes.module.css'

function Dishes() {
    const { pizzas, halfbakedPizzas, durumRolls, error, isLoading } = useFetchDishes()
    const [filteredDishes, setFilteredDishes] = useState([])
    const [activeFilter, setActiveFilter] = useState("Pizzas")
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)

    // Filter baseret på dishId eller _id
    const filters = {
        Pizzas: pizzas,
        HalfbakedPizzas: halfbakedPizzas,
        DurumRolls: durumRolls,
    }

    // Håndter filter skift ved brug af dishId
    const handleFilterChange = (dishId) => {
        setActiveFilter(dishId)
        setFilteredDishes(filters[dishId] || [])
        setIsDropdownVisible(true)
    }

    // Default filter til pizzaer
    useEffect(() => {
        setFilteredDishes(pizzas)
    }, [pizzas])

    return (
        <div className={styles.dishes}>
            <h2>Vælg kategori</h2>

            {isLoading ? (
                <p>Henter retter...</p>
            ) : (
                <section>
                    <div className={styles.filterButtons}>
                        <button
                            className={activeFilter === "Pizzas" ? styles.active : ""}
                            onClick={() => handleFilterChange("Pizzas")}
                        >
                            Pizzaer
                        </button>
                        <button
                            className={activeFilter === "HalfbakedPizzas" ? styles.active : ""}
                            onClick={() => handleFilterChange("HalfbakedPizzas")}
                        >
                            Halvbagte pizzaer
                        </button>
                        <button
                            className={activeFilter === "DurumRolls" ? styles.active : ""}
                            onClick={() => handleFilterChange("DurumRolls")}
                        >
                            Durum ruller
                        </button>
                    </div>

                    {error && <p>Kunne ikke hente retterne. Fejl: {error}</p>}

                    {isDropdownVisible && (
                        <div className={styles.dishCard}>
                            {filteredDishes.length > 0 ? (
                                <ul>
                                    {filteredDishes.map(dish => (
                                        <li key={dish._id}>
                                            <DishCard dish={dish} />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Ingen retter fundet for denne kategori</p>
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

export default Dishes