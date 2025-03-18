import { useParams } from "react-router-dom"
import { useFetchDishes } from "../../hooks/useFetchDishes"
import DishCard from "../../components/HomePage/Dishes/dishCard/DishCard"
import PageHeader from "../../components/PageHeader/PageHeader"

function SingleviewDish() {
  const { id } = useParams()
  const { fetchDishById, isLoading, error } = useFetchDishes()
  const dish = fetchDishById(id)

  if (isLoading) return <p>Loading...</p>
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