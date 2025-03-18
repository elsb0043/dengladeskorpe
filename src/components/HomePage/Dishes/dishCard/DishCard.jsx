import { Link } from "react-router-dom"
import styles from "./dishCard.module.css"

function DishCard({ dish }) {

    return (
    
      <figure className={styles.dishCard}>
        <Link to={`/dishes/${dish._id}`}>
          <img src={dish.image}/>
        </Link>

        <figcaption>
          <h3>{dish.name}</h3>
        </figcaption>
      </figure>
      
    )
}

export default DishCard