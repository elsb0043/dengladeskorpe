import { useEffect, useState } from "react"
import { useFetchDishes } from "../../../hooks/useFetchDishes"
import DishCard from "./dishCard/DishCard"
import Button from "../../Button/Button"

function Dishes() {
    const { dishes, pizzas, halfbakedPizzas, durumRolls, error, isLoading } = useFetchDishes()
  
    const [filteredDishes, setFilteredDishes] = useState([])
    const [activeFilter, setActiveFilter] = useState("All")
  
    useEffect(() => {
      setFilteredDishes(pizzas)
    }, [pizzas])
  
    const filters = {
      All: dishes,
      Pizzas: pizzas,
      HalfbakedPizzas: halfbakedPizzas,
      DurumRolls: durumRolls
    }
  
    const handleFilterChange = (filter) => {
      setActiveFilter(filter)
      setFilteredDishes(filters[filter] || [])
    }
  
    const dishesArray = filteredDishes?.length > 0 ? filteredDishes : dishes || []
  
    return (
      <>
        {isLoading ? (
          <p>Henter retter...</p>
        ) : (
          <section>
            <div className="filterButtons">
              <Button 
                text="Alle" 
                className={activeFilter === "All" ? "active" : ""} 
                onClick={() => handleFilterChange("All")} 
              />
              <Button 
                text="Pizzaer" 
                className={activeFilter === "Pizzas" ? "active" : ""} 
                onClick={() => handleFilterChange("Pizzas")}
              />
              <Button 
                text="Frokost" 
                className={activeFilter === "HalfbakedPizzas" ? "active" : ""} 
                onClick={() => handleFilterChange("HalfbakedPizzas")}
              />
              <Button 
                text="Aftensmad" 
                className={activeFilter === "DurumRolls" ? "active" : ""} 
                onClick={() => handleFilterChange("DurumRolls")}
              />
            </div>
  
            {error && <p>Kunne ikke hente retterne. Fejl: {error}</p>}
  
            <div className="dishes">
              {dishesArray.map(dish => ( 
                <li key={dish._id}>
                  <DishCard dish={dish} />
                </li>
              ))}
            </div>
          </section>
        )}
      </>
    )
  }  

export default Dishes