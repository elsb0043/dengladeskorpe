import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../context/useAuthContext"

const useFetchDishes = () => {
    // State til at gemme de hentede retter
    const [dishes, setDishes] = useState([]) 
    const [error, setError] = useState(null) // State til fejl
    const [isLoading, setIsLoading] = useState(false) // State til at vise loading indikator
    const [filteredDishes, setFilteredDishes] = useState(false) // State til at gemme de filtrerede retter
    const { token } = useAuthContext() // Hent token fra auth context for at autentificere API kald

    // HENT ALLE RETTER
    const fetchDishes = useCallback(async () => {
        setError(null) // Resetter fejlkode
        setIsLoading(true) // Sætter loading til true
        try {
            // Hent alle retter fra API'et
            const response = await fetch("http://localhost:3042/dishes")
            if (!response.ok) throw new Error("Failed to fetch dishes") // Hvis fejlagtigt svar fra serveren

            const data = await response.json() // Parse JSON data fra API'et
            const formattedData = data.data.map(dish => ({
                ...dish,
                price: {
                    normal: dish.price?.normal || 0, // Hvis price ikke findes, sæt til 0
                    family: dish.price?.family || 0 // Hvis family price ikke findes, sæt til 0
                },
                category: dish.category || "Unknown" // Hvis kategori ikke findes, sæt som "Unknown"
            }))

            setDishes(formattedData) // Gem retterne i state
            setFilteredDishes(formattedData) // Gem de samme retter i filteredDishes
        } catch (error) {
            setError(error.message) // Sæt fejlen i state
            console.error("Error fetching dishes:", error) // Log fejlen til konsollen
        } finally {
            setIsLoading(false) // Sæt loading til false, når data er hentet
        }
    }, []) // useCallback hook afhænger kun af fetchDishes funktionen

    // OPRET RETTER
    const createDish = async (formData) => {
        try {
            const response = await fetch("http://localhost:3042/dish", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Tilføj auth token i headeren
                },
                body: formData, // Send formData som request body
            })
            if (!response.ok) {
                throw new Error("Fejl ved oprettelse af retter") // Hvis oprettelsen fejler
            }

            const result = await response.json() // Parse JSON svaret
            return result
        } catch (error) {
            console.error("Fejl ved oprettelse:", error) // Log fejl til konsol
            throw error // Kaster fejl videre
        }
    }

    // OPDATER RETTER
    /* const updateDish = async (formData) => {
        try {
            const response = await fetch("http://localhost:3042/dish", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, // Tilføj auth token i headeren
                },
                body: formData, // Send formData som request body
            })
            if (!response.ok) {
                throw new Error("Fejl ved opdatering af retter") // Hvis opdateringen fejler
            }
            const result = await response.json() // Parse JSON svaret
            return result
        } catch (error) {
            console.error("Fejl ved opdatering:", error) // Log fejl til konsol
            throw error // Kaster fejl videre
        }
    } */

    // SLET RETTER
    const deleteDish = async (params) => {
        try {
            // Slet retten ved at sende en DELETE request
            await fetch(`http://localhost:3042/dish/${params}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, // Tilføj auth token i headeren
                },
            })

            // Filtrér den slettede ret ud af arrayet
            const filteredArray = dishes.filter((di) => di._id !== params)
            setDishes(filteredArray) // Opdater retterne i state
        } catch (error) {
            console.error("Fejl ved sletning:", error) // Log fejl til konsol
        }
    }

    // HENT RET BASED PÅ ID
    const fetchDishById = async (id) => {
        setError(null) // Resetter fejl
        setIsLoading(true) // Sætter loading til true

        try {
            // Hent retten ved ID fra API'et
            const response = await fetch(`http://localhost:3042/dish/${id}`)

            if (!response.ok) {
                const errorText = await response.text() // Hent fejlinformation hvis fejl
                throw new Error(`Failed to fetch dish: ${errorText}`)
            }

            const data = await response.json() // Parse JSON svar

            return {
                ...data.data,
                price: {
                    normal: data.data.price?.normal || 0,
                    family: data.data.price?.family || 0,
                },
                category: data.data.category || "Unknown",
                title: data.data.title || "", // Sikrer at title bliver inkluderet
                ingredients: data.data.ingredients || "" // Sikrer at ingredients bliver inkluderet
            }

        } catch (error) {
            setError(error.message) // Sæt fejl i state
            console.error("Error fetching dish:", error) // Log fejl til konsol
        } finally {
            setIsLoading(false) // Sæt loading til false når data er hentet
        }
    }

    // Refetch funktionen som henter alle retter på ny
    const refetch = useCallback(() => {
        fetchDishes() // Kald fetchDishes funktionen igen
    }, [fetchDishes]) // useCallback afhænger af fetchDishes

    useEffect(() => {
        fetchDishes() // Hent alle retter når komponenten mountes
    }, [fetchDishes])

    // Returner de nødvendige funktioner og data til andre komponenter
    return { 
        dishes,
        setDishes,
        fetchDishes,
        fetchDishById,
        setFilteredDishes,
        createDish,
        deleteDish,
        isLoading,
        refetch,
        error,
    }
}

export { useFetchDishes }