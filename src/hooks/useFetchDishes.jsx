import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../context/useAuthContext"

const useFetchDishes = (setFilteredDishes) => {
    const [dishes, setDishes] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useAuthContext()

    // HENT ALLE DISHES 
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


    // OPRET DISHES
    const createDish = async (formData) => {
        try {
            const response = await fetch("http://localhost:3042/dish", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
            if (!response.ok) {
                throw new Error("Fejl ved oprettelse af retter") 
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error("Fejl ved oprettelse:", error)
            throw error 
        }
    }


    // OPDATER DISHES
    const updateDish = async (formData) => {
        try {
            const response = await fetch("http://localhost:3042/dish", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
                body: formData,
            })
            if (!response.ok) {
                throw new Error("Fejl ved opdatering af retter")
            }
            const result = await response.json()
            return result
        } catch (error) {
            console.error("Fejl ved opdatering:", error)
            throw error
        }
    }


    // SLET DISHES
    const deleteDish = async (params) => {
        
        try {
            await fetch(`http://localhost:3042/dish/${params}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const filteredArray = dishes.filter((di) => di._id !== params)
            setDishes(filteredArray)
        } catch (error) {
            console.error("Fejl ved sletning:", error)
        }
    }


    // HENT DISHES BASERET PÅ ID
    const fetchDishById = async (id) => {
        setError(null)
        setIsLoading(true)
    
        try {
            const response = await fetch(`http://localhost:3042/dish/${id}`)
    
            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to fetch dish: ${errorText}`)
            }
    
            const dish = await response.json()
            return dish.data[0]
        } catch (error) {
            setError(error.message)
            console.error("Error fetching dish:", error)
        } finally {
            setIsLoading(false) 
        }
    }

    const refetch = useCallback(() => {
        fetchDishes()
        setFilteredDishes()
    }, [fetchDishes])


    useEffect(() => {
        fetchDishes()
        setFilteredDishes()
    }, [fetchDishes])

    return { 
        dishes,
        setDishes,
        fetchDishes,
        fetchDishById,
        createDish,
        updateDish,
        deleteDish,
        isLoading,
        refetch,
        error,
    }
}

export { useFetchDishes }