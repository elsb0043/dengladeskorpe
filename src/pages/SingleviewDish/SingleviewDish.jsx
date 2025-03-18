import { useParams } from "react-router-dom"
import { useFetchDishes } from "../../hooks/useFetchDishes"

function SingleviewDish() {
  const { id } = useParams()
  const { fetchDishById } = useFetchDishes()
  const dish = fetchDishById(id)

  return (
    <>
      <PageHeader
        title={dish?.name}
        headerImg={dish?.image}
      />
    </>
  )
}

export default SingleviewDish