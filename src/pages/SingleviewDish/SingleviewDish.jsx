import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useFetchDishes } from "../../hooks/useFetchDishes"
import DishCard from "../../components/HomePage/Dishes/dishCard/DishCard"
import PageHeader from "../../components/PageHeader/PageHeader"

function SingleviewDish() {
  const { id } = useParams()
  const { fetchDishById, error } = useFetchDishes()
  const [dish, setDish] = useState(null)
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    const getDish = async () => {
      if (!id) return
      setLocalLoading(true) 
      try {
        const fetchedDish = await fetchDishById(id)
        if (fetchedDish) setDish(fetchedDish)
      } catch (error) {
        console.error("Error fetching dish:", error)
      } finally {
        setLocalLoading(false)
      }
    }

    getDish()
  }, [id, fetchDishById])

  if (localLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!dish) return <p>Dish not found</p>

  return (
    <>
      <PageHeader title={dish.name} />
      <DishCard dish={dish} />
    </>
  )
}

export default SingleviewDish