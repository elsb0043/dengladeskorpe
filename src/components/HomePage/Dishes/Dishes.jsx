import { useState, useEffect } from "react" // Import af indbyggede React hooks
import { useFetchDishes } from "../../../hooks/useFetchDishes" // Import af custom hook til at hente retter
import DishCard from "./dishCard/DishCard" // Import af komponenten, der viser retterne
import styles from './dishes.module.css' // Import af CSS-modul til styling

function Dishes() {
    // useState er en indbygget hook, der bruges til at oprette og opdatere komponentens tilstand
    const [filteredDishes, setFilteredDishes] = useState([]) // Hold styr på de filtrerede retter
    const [isDropdownVisible, setIsDropdownVisible] = useState(false) // Bestemmer om dropdown-menuen er synlig
    const { dishes, error, isLoading } = useFetchDishes() // Brug af custom hook til at hente data om retter

    // menuItems er en liste af unikke kategorier fra de hentede retter
    const menuItems = [...new Set(dishes?.map(dish => dish.category))]

    // Funktion til at hente baggrundsbillede til en kategori. Finder den første ret i kategorien og bruger dens billede
    const getCategoryBackground = (category) => {
        const dish = dishes.find(dish => dish.category === category) // Find første ret, der matcher kategorien
        return dish ? `url(${dish.image})` : null // Returner billedet som baggrund, hvis en ret findes
    }

    // useEffect er en indbygget hook, der kører kode, når komponenten renderes eller når afhængigheder ændres
    useEffect(() => {
        if (dishes.length > 0) { // Tjekker om der er noget i dishes array'et
            setFilteredDishes(dishes) // Når retterne er hentet, opdateres den filtrerede liste
        }
    }, [dishes]) // useEffect kører, når 'dishes' ændres

    // Funktion til at håndtere kategorifilter. Hvis en kategori vælges, vises kun de retter, der matcher den kategori
    const handleFilterChange = (category) => {
        if (category) {
            setFilteredDishes(dishes.filter(dish => dish.category === category)) // Filtrer retterne efter kategori
        } else {
            setFilteredDishes(dishes) // Hvis ingen kategori vælges, vis alle retterne
        }
        setIsDropdownVisible(true) // Gør dropdown-menuen synlig, når filteret ændres
    }

    return (
        <div className={styles.dishes}> 
            <h2>Vælg kategori</h2> 

            {isLoading ? ( // Hvis dataene stadig bliver hentet, vis en loading besked
                <p>Henter retter...</p>
            ) : (
                <section>
                    {/* Filtreknapperne, der viser kategorierne */}
                    <div className={styles.filterButtons}>
                        {menuItems.length > 0 && menuItems.map((category) => ( // Hvis der er kategorier, render knapperne
                            <button
                                key={category} // Unik nøgle for hvert element
                                onClick={() => handleFilterChange(category)} // Opdater filtreringen, når knappen klikkes
                                style={{
                                    backgroundImage: getCategoryBackground(category), // Brug et baggrundsbillede baseret på kategorien
                                    backgroundSize: 'cover', // Sørg for at billedet dækker knappen
                                    backgroundPosition: 'center', // Centrer billedet
                                    backgroundRepeat: 'no-repeat' // Undgå gentagelse af billedet
                                }}
                            >
                                {category} {/* Vis kategoriens navn på knappen */}
                            </button>
                        ))}
                    </div>

                    {error && <p>Kunne ikke hente retterne. Fejl: {error}</p>} {/* Fejlmeddelelse, hvis dataene ikke kunne hentes */}

                    {/* Hvis dropdown-menuen er synlig, vis de filtrerede retter */}
                    {isDropdownVisible && (
                        <div className={styles.dishCard}>
                            {filteredDishes.length > 0 ? ( // Hvis der er filtrerede retter, vis dem
                                <ul>
                                    {filteredDishes.map(dish => ( // For hver ret, rendér en DishCard komponent
                                        <li key={dish._id}>
                                            <DishCard dish={dish} /> {/* Giv hver ret som prop til DishCard */}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Ingen retter fundet for denne kategori</p> // Hvis der ikke er nogen retter for den valgte kategori
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

export default Dishes