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

    // OPRET RET
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
                throw new Error("Fejl ved oprettelse af ret")
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error("Fejl ved oprettelse:", error)
            throw error
        }
    }

    // OPDATER RET
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
                throw new Error("Fejl ved opdatering af ret")
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error("Fejl ved opdatering:", error)
            throw error
        }
    }

    // SLET RET
    const deleteDish = async (dishId) => {
        try {
            await fetch(`http://localhost:3042/dish/${dishId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setDishes((prevDishes) =>
                prevDishes.filter((dish) => dish._id !== dishId)
            )
        } catch (error) {
            console.error("Fejl ved sletning:", error)
            setError(error.message)
        }
    }

    // HENT RET BASERET PÅ ID
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

    let pizzas = dishes.filter(dish => 
        dish.mealType.includes("Pizzas"))
    
    let halfbakedPizzas = dishes.filter(dish => 
        dish.mealType.includes("HalfbakedPizzas"))
    
    let durumRolls = dishes.filter(dish => 
        dish.mealType.includes("DurumRolls"))
        

    // Memoiseret funktion til at genhente retter
    const refetch = useCallback(() => {
        fetchDishes()
    }, [fetchDishes])


    useEffect(() => {
        fetchDishes()
    }, [])

    return {
        dishes,
        setDishes,
        fetchDishes,
        fetchDishById,
        deleteDish,
        createDish,
        updateDish,
        isLoading,
        refetch,
        error,
        pizzas,
        halfbakedPizzas,
        durumRolls
    }
}

export { useFetchDishes }