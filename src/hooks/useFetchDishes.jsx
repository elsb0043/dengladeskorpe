import { useCallback, useEffect, useState } from "react"

const useFetchDishes = (setFilteredDishes) => {
    const [dishes, setDishes] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchDishes = useCallback(async () => {
        setError(null)
        setIsLoading(true)
        try {
            const response = await fetch("http://localhost:3042/dishes")
            if (!response.ok) throw new Error("Failed to fetch dishes")

            const data = await response.json()
            const formattedData = data.data.map(dish => ({
                ...dish,
                price: {
                    normal: dish.price?.normal || 0,
                    family: dish.price?.family || 0
                },
                category: dish.category || "Unknown"
            }))

            setDishes(formattedData)
            setFilteredDishes(formattedData)
        } catch (error) {
            setError(error.message)
            console.error("Error fetching dishes:", error)
        } finally {
            setIsLoading(false)
        }
    }, [setFilteredDishes])

    useEffect(() => {
        fetchDishes()
    }, [fetchDishes])

    return { dishes, isLoading, error }
}

export { useFetchDishes }