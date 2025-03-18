import { useState } from "react"
import { useFetchDishes } from "../../../hooks/useFetchDishes"
import DishCard from "./dishCard/DishCard"
import Button from "../../Button/Button"

function Dishes() {
  const { dishes, pizzas, halfbakedPizzas, durumRolls, error, isLoading } = useFetchDishes()

  const [filteredDishes, setFilteredDishes] = useState([...pizzas])
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = {
    All: dishes,
    Pizzas: pizzas,
    HalfbakedPizzas: halfbakedPizzas,
    DurumRolls: durumRolls
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setFilteredDishes(filters[filter])
  }

  const dishesArray = filteredDishes?.length > 0 ? filteredDishes : dishes

  const { fetchDishById } = useFetchDishes()
  const dish = fetchDishById()

  return (
    <>
    {isLoading ? ( // Hvis isLoading er true(hvis den er igang med at hente data), så skal loader komponent vises
      <p>Henter retter</p>
    ) : ( // Hvis den er false, så skal den vise vores side med vores data
    <section>
      <div className="filterButtons">
        <Button 
          title='Alle' 
          className={activeFilter === "All" ? "active" : ""} 
          onClick={() => handleFilterChange("All")} 
        />
        <Button 
          title='Pizzaer' 
          className={activeFilter === "Pizzas" ? "active" : ""} 
          onClick={() => handleFilterChange("Pizzas")}
        />
        <Button 
          title='Frokost' 
          className={activeFilter === "HalfbakedPizzas" ? "active" : ""} 
          onClick={() => handleFilterChange("HalfbakedPizzas")}
        />
        <Button 
          title='Aftensmad' 
          className={activeFilter === "DurumRolls" ? "active" : ""} 
          onClick={() => handleFilterChange("DurumRolls")}
        />
      </div>

      {/* Hvis den ikke kan hente siden, så skal der vises en fejlbesked */}
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