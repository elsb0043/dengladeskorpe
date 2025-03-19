import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../context/useAuthContext"

const useFetchDishes = () => {
    const [dishes, setDishes] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { token } = useAuthContext()

    // HENT ALLE RETTER
    const fetchDishes = useCallback(async () => {
        setError(null)
        setIsLoading(true)
        try {
            const response = await fetch("http://localhost:3042/dishes")
            if (!response.ok) {
                throw new Error("Fejl ved hentning af retter")
            }

            const data = await response.json()

            // Mappet data for at sikre, at price og category altid er defineret
            const formattedData = data.data.map(dish => ({
                ...dish,
                price: {
                    normal: dish.price?.normal || 0,
                    family: dish.price?.family || 0
                },
                category: dish.category || "Ukendt"
            }))

            setDishes(formattedData)
        } catch (error) {
            setError(error.message)
            console.error("Error fetching dishes:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Filter state
    const [pizzas, setPizzas] = useState([])
    const [halfbakedPizzas, setHalfbakedPizzas] = useState([])
    const [durumRolls, setDurumRolls] = useState([])

    // Filter funktion baseret på category eller ID
    const filterDishes = useCallback(() => {
        if (dishes.length) {
            setPizzas(dishes.filter((dish) => dish.category.includes("Pizzas")))
            setHalfbakedPizzas(dishes.filter((dish) => dish.category.includes("HalfbakedPizzas")))
            setDurumRolls(dishes.filter((dish) => dish.category.includes("DurumRolls")))
        }
    }, [dishes])

    // Trigger filtrering når dishes er blevet fetchet
    useEffect(() => {
        fetchDishes()
    }, [fetchDishes])

    useEffect(() => {
        filterDishes()
    }, [dishes, filterDishes])

    return {
        dishes,
        setDishes,
        isLoading,
        error,
        pizzas,
        halfbakedPizzas,
        durumRolls,
        fetchDishes
    }
}

export { useFetchDishes }