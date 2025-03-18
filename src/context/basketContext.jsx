import { createContext, useContext, useState, useEffect } from 'react'

// Opret en BasketContext ved hjælp af createContext()
// Context giver mulighed for at dele state globalt i komponenttræet uden at skulle prop-drille
const BasketContext = createContext()

// Opretter en BasketProvider, som "wrapper" applikationen og gør kurvens state tilgængelig for underliggende komponenter
export const BasketProvider = ({ children }) => {

    // State til at holde styr på produkter i kurven
    // Henter kurvens data fra localStorage ved første render
    const [basket, setBasket] = useState(() => {
        // Hvis der er data i localStorage, hentes de – ellers starter vi med et tomt array
        return JSON.parse(localStorage.getItem('basket')) || []
    })

    // useEffect til at synkronisere kurvens state med localStorage
    useEffect(() => {
        // Opdaterer localStorage, hver gang basket ændres
        localStorage.setItem('basket', JSON.stringify(basket))
    }, [basket]) // Kører kun, når basket ændres

    // Funktion til at tilføje et produkt til kurven
    const addToBasket = (product) => {
        setBasket((prev) => [...prev, product]) // Tilføjer produktet til den eksisterende liste
    }

    // Funktion til at fjerne et produkt fra kurven baseret på index
    const removeFromBasket = (index) => {
        setBasket((prev) => prev.filter((_, i) => i !== index))
        // _ bruges, fordi værdien ikke er nødvendig (vi bruger kun index)
        // Fjerner elementet på den angivne index-position
    }

    // Funktion til at rydde hele kurven
    const clearBasket = () => {
        setBasket([]) // Sætter kurven til et tomt array
    }

    // Returnerer en kontekstprovider, der gør kurvens data og funktioner tilgængelige for child-komponenter
    return (
        <BasketContext.Provider value={{ basket, addToBasket, removeFromBasket, clearBasket }}>
            {children}
        </BasketContext.Provider>
    )
}

// Custom hook til at tilgå BasketContext
// Gør det nemt at hente kurvens state og funktioner fra hvor som helst i komponenttræet
export const useBasket = () => useContext(BasketContext)