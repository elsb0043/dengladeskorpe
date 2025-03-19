import { Link } from "react-router-dom"
import styles from "./dishCard.module.css"

function DishCard({ dish }) {
  
  return (
    <div className={styles.dishCard}>
      <Link to={`/dish/${dish._id}`}>
        <img src={dish.image} />
      </Link>
      <p>{dish.title}</p>
    </div>
  )
}

export default DishCard