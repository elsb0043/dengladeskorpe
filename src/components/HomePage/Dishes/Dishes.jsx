import { useEffect, useState } from "react"
import { useFetchDishes } from "../../../hooks/useFetchDishes"
import DishCard from "./dishCard/DishCard"
import styles from './dishes.module.css'

function Dishes() {
    const { dishes, pizzas, halfbakedPizzas, durumRolls, error, isLoading } = useFetchDishes()
  
    const [filteredDishes, setFilteredDishes] = useState([])
    const [activeFilter, setActiveFilter] = useState("All")
  
    useEffect(() => {
      setFilteredDishes(pizzas)
    }, [pizzas])
  
    const filters = {
      Pizzas: pizzas,
      HalfbakedPizzas: halfbakedPizzas,
      DurumRolls: durumRolls
    }
  
    const handleFilterChange = (filter) => {
      setActiveFilter(filter)
      setFilteredDishes(filters[filter] || [])
    }
  
    const dishesArray = filteredDishes?.length > 0 ? filteredDishes : dishes || []
  
/*     const { fetchDishById } = useFetchDishes()
    const dish = fetchDishById(9) */
    
    return (
      <div className={styles.dishes}>
        <h2>Vælg kategori</h2>
        {isLoading ? (
          <p>Henter retter...</p>
        ) : (
          <section>
            <div className={styles.filterButtons}>
                <button
                    className={activeFilter === "Pizzas" ? "active" : ""} 
                    onClick={() => handleFilterChange("Pizzas")}
                >
                    Pizzaer
                </button>
                <button
                    className={activeFilter === "HalfbakedPizzas" ? "active" : ""} 
                    onClick={() => handleFilterChange("HalfbakedPizzas")}
                >
                    Halvbagte pizzaer
                </button>
                <button
                    className={activeFilter === "DurumRolls" ? "active" : ""} 
                    onClick={() => handleFilterChange("DurumRolls")}
                >
                    Durum ruller
                </button>
            </div>
  
            {error && <p>Kunne ikke hente retterne. Fejl: {error}</p>}
  
            <div className={styles.dishCard}>
              {dishesArray.map(dish => ( 
                <li key={dish._id}>
                  <DishCard dish={dish} />
                </li>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }  

export default Dishes