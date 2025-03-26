import { useEffect, useState } from "react" // Importerer hooks fra React
import { useParams } from "react-router-dom" // Bruges til at få parametre fra URL'en
import { useFetchDishes } from "../../hooks/useFetchDishes" // Custom hook til at hente retter
import { useBasket } from "../../context/basketContext" // Custom hook til at interagere med kurv
import PageHeader from "../../components/PageHeader/PageHeader" // Importerer komponent til header
import headerImg from "/assets/headerImg.png" // Importerer billede til header
import Navigation from "../../components/Navigation/Navigation" // Importerer navigation-komponent
import Footer from "../../components/Footer/Footer" // Importerer footer-komponent
import styles from './single.module.css' // Importerer CSS-modul til styling
import Button from "../../components/Button/Button" // Importerer knap-komponent
import SizeDropdown from "../../components/CustomDropdown/SizeDropdown" // Importerer dropdown for størrelse
import TopDropdown from "../../components/CustomDropdown/TopDropdown" // Importerer dropdown for topping

// SingleviewDish-komponenten viser detaljerne for en bestemt ret og giver brugeren mulighed for at tilføje den til kurven.
function SingleviewDish() {
  // Henter id fra URL-parametre (bruges til at hente retten)
  const { id } = useParams()

  // Henter fetch-funktionen og error-håndtering fra custom hook
  const { fetchDishById, error } = useFetchDishes()

  // State til at holde retten, loading status, størrelse, pris, ingredienser og topping
  const [dish, setDish] = useState(null)
  const [localLoading, setLocalLoading] = useState(true)
  const [size, setSize] = useState("normal") // Default størrelse
  const [price, setPrice] = useState(0)
  const [ingredient, setIngredient] = useState([]) // Toppings
  const [ingredients, setIngredients] = useState([]) // Toppings
  const [selectedTopping, setSelectedTopping] = useState('')

  // Henter funktion til at tilføje varer til kurven fra basketContext
  const { addToBasket } = useBasket()

  // useEffect hook til at hente retten baseret på id
  useEffect(() => {
    const getDish = async () => { // Async funktion, der henter retten via fetchDishById(id)
      if (!id) return // Hvis (!id) er truthy, så sæt setLocalLoading(true) -> falsy (null, undefined..), så stopper funktionen 
      setLocalLoading(true) 
      try {
        const fetchedDish = await fetchDishById(id) // Henter retten fra API ved hjælp af id
        if (fetchedDish) {
          setDish(fetchedDish) // Opdaterer state med den hentede ret
          setPrice(fetchedDish.price?.normal || 0) // Sætter default pris til normal størrelse
        }
      } catch (error) { // Fanger og logger fejl, hvis hentningen fejler
        console.error("Error fetching dish:", error)
      } finally { // Sætter loading-tilstand til false efter hentning (uanset om den lykkes eller fejler)
        setLocalLoading(false)
      }
    }

    getDish()
  }, [id]) // Re-fetch retten, når id ændres

  // useEffect hook til at opdatere prisen, når størrelsen ændres
  useEffect(() => {
    if (dish && dish.price) { // Tjekker om ret og pris findes
      setPrice(dish.price[size] || 0) // Sætter prisen baseret på valgt størrelse (size), ellers 0
    }
  }, [size, dish]) // Kører når `size` eller `dish` ændres

  // Funktion til at håndtere tilføjelse af retter til kurven
  const handleAddToBasket = () => {
    if (dish) { // Tjekker om retten findes
      addToBasket(dish, size, price, ingredient) // Tilføj retten til kurven med de valgte parametre
    }
  }

  // Funktion til at håndtere ændring af topping
  const handleToppingChange = (topping) => {
    setSelectedTopping(topping) // Opdaterer valgt topping i state
  }

  // Hvis retten ikke er hentet eller der opstår en fejl, vis en meddelelse
  if (localLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!dish) return <p>Dish not found</p>

  return (
    <>
      <Navigation /> {/* Vist navigation */}
      <PageHeader smalltext='Den' title='Glade' subtitle={dish.title} img={headerImg} /> {/* Vist header med retternes titel og billede */}
      <div className={styles.singleViewContainer}>
        <img src={dish.image} alt={dish.title} /> {/* Vist billede af retten */}
        <div className={styles.singleViewContent}>
          <h3>{dish.title}</h3> {/* Retternes titel */}
          <div className={styles.singleViewIngredients}>
            {ingredients.ingredients.map((ingredient, index) => ( // Iterer over ingredienserne og viser dem
              <p key={index}>{ingredient}</p>
            ))}
          </div>
          {/* Dropdown-menu for valg af topping */}
          <TopDropdown
            label="Tilføj ingrediens"
            selectedValue={selectedTopping}
            onChange={handleToppingChange} 
          />
        </div>
        <div className={styles.singleViewSizeDish}>
          <h3>Vælg størrelse</h3>
          <SizeDropdown setSize={setSize} /> {/* Dropdown til valg af størrelse */}
          <div className={styles.singleViewPrice}>
            <h2 className={styles.price}>Pris</h2>
            <h2>{price},-</h2> {/* Vis den opdaterede pris */}
          </div>
          {/* Knap til at tilføje retten til kurven */}
          <Button text={`Tilføj ${dish.title} til kurven`} onClick={handleAddToBasket} />
        </div>
      </div>
      <Footer /> {/* Vist footer */}
    </>
  )
}

export default SingleviewDish