import { useState, useEffect } from "react"
import { useFetchDishes } from "../../../hooks/useFetchDishes"
import DishCard from "./dishCard/DishCard"
import styles from './dishes.module.css'

function Dishes() {
    const [filteredDishes, setFilteredDishes] = useState([])
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    const { dishes, error, isLoading } = useFetchDishes()

    const menuItems = [...new Set(dishes?.map(dish => dish.category))] 

    useEffect(() => {
        if (dishes.length > 0) {
            setFilteredDishes(dishes)
        }
    }, [dishes])

    const handleFilterChange = (category) => {
        if (category) {
            setFilteredDishes(dishes.filter(dish => dish.category === category))
        } else {
            setFilteredDishes(dishes)
        }
        setIsDropdownVisible(true)
    }

    return (
        <div className={styles.dishes}>
            <h2>Vælg kategori</h2>

            {isLoading ? (
                <p>Henter retter...</p>
            ) : (
                <section>
                    <div className={styles.filterButtons}>
                        {menuItems.length > 0 && menuItems.map((category) => (
                            <button key={category} onClick={() => handleFilterChange(category)}>
                                {category}
                            </button>
                        ))}
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