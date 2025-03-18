import { Link } from "react-router-dom"
import { FaHeart, FaRegHeart  } from "react-icons/fa"
import { useLocalStorage } from "@uidotdev/usehooks"
import styles from "./dishCard.module.css"

function DishCard({ dish }) {
  const [favorites, setFavorites] = useLocalStorage("Favorites", [])
  const isFavorite = favorites.includes(dish._id)

  const handleLike = () => {
    setFavorites((prevFavorites) => 
      isFavorite 
        ? prevFavorites.filter((fav) => fav !== dish._id) 
        : [...prevFavorites, dish._id]
      )
  }


    return (
    
      <figure className={styles.dishCard}>
        
        <Link to={`/dishes/${dish._id}`}>
          <img src={dish.image}/>
        </Link>

        <figcaption>
          <h2>{dish.name}</h2>
          {isFavorite ? <FaHeart size={30} onClick={handleLike}/> : <FaRegHeart size={30} onClick={handleLike}/>}
        </figcaption>

      </figure>
      
    )
}

export default DishCard