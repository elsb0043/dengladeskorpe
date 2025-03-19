import { useEffect, useState } from "react"
import { useFetchDishes } from "../../../hooks/useFetchDishes"
import DishCard from "./dishCard/DishCard"
import styles from './dishes.module.css'

function Dishes() {
    const { dishes, pizzas, halfbakedPizzas, durumRolls, error, isLoading } = useFetchDishes()
    const [filteredDishes, setFilteredDishes] = useState([]) // Filtrerede retter baseret på kategori
    const [activeFilter, setActiveFilter] = useState("All") // Aktiv kategori
    const [isDropdownVisible, setIsDropdownVisible] = useState(false) // Kontrollerer synligheden af retterne

    // Filtrerer retterne baseret på kategori (Pizzaer, halvbagte pizzaer, durum ruller)
    const filters = {
        Pizzas: pizzas,
        HalfbakedPizzas: halfbakedPizzas,
        DurumRolls: durumRolls,
    }

    // Håndterer kategori knap klik (filtrerer retter)
    const handleFilterChange = (filter) => {
        setActiveFilter(filter)
        setFilteredDishes(filters[filter] || []) // Filtrerer baseret på den valgte kategori
        setIsDropdownVisible(true) // Vis dropdown med retter
    }

    // Default: Vis pizzaer når komponentet først bliver loadet
    useEffect(() => {
        setFilteredDishes(pizzas)
    }, [pizzas])

    // Vis retter baseret på filteredDishes, hvis den er tilgængelig
    const dishesArray = filteredDishes?.length > 0 ? filteredDishes : []

    return (
        <div className={styles.dishes}>
            <h2>Vælg kategori</h2>

            {isLoading ? (
                <p>Henter retter...</p>
            ) : (
                <section>
                    <div className={styles.filterButtons}>
                        {/* Kategori knapper */}
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

                    {/* Kun vis retter når dropdown er synlig */}
                    {isDropdownVisible && (
                        <div className={styles.dishCard}>
                            {dishesArray.length > 0 ? (
                                <ul>
                                    {dishesArray.map(dish => (
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