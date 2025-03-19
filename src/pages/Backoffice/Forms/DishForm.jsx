import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import styles from "./form.module.css"
import { useFetchDishes } from "../../../hooks/useFetchDishes"
import Button2 from "../../../components/Button/Button2"

const DishForm = ({ isEditMode }) => {
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("") 
    const [normalPrice, setNormalPrice] = useState("")
    const [familyPrice, setFamilyPrice] = useState("")
    const [image, setImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [ingredients, setIngredients] = useState("")

    const { refetch } = useOutletContext()
    const navigate = useNavigate()
    const { id } = useParams()
    const { createDish, fetchDishById, updateDish } = useFetchDishes()

    useEffect(() => {
        if (isEditMode && id) {
            const loadDishData = async () => {
                try {
                    const response = await fetchDishById(id)
                    if (response) {
                        setTitle(response.title)
                        setCategory(response.category)
                        setNormalPrice(response.normalPrice)
                        setFamilyPrice(response.familyPrice)
                        setImage(response.image)
                        setIngredients(response.ingredients)
                    }
                } catch (error) {
                    console.error("Error fetching dish:", error)
                }
            }
            loadDishData()
        }
    }, [isEditMode, id, fetchDishById])

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            const objUrl = window.URL.createObjectURL(file)
            setImage(objUrl)
        }
    }

    const handleSubmitDish = async (event) => {
        event.preventDefault()
    
        const dishData = new FormData()
        dishData.append("title", title)
        dishData.append("category", category)
        dishData.append("ingredients", ingredients)

        const price = {
            normal: parseFloat(normalPrice),
            family: parseFloat(familyPrice)
        }
        dishData.append("price", JSON.stringify(price)) // JSON-stringify objektet
    
        if (selectedFile) {
            dishData.append("file", selectedFile)
        }
    
        try {
            let response
            if (isEditMode && id) {
                dishData.append("id", id)
                response = await updateDish(dishData)
            } else {
                response = await createDish(dishData)
            }
    
            console.log(
                isEditMode ? "Ret er opdateret" : "Ret er oprettet",
                response
            )
    
            if (response) {
                await refetch()
                navigate("/backoffice/backofficedishes")
            }
        } catch (error) {
            console.error("Fejl ved håndtering af ret:", error)
        }
    }    

    return (
        <form onSubmit={handleSubmitDish}>
            <h2>{isEditMode ? "Opdater ret" : "Tilføj ret"}</h2>

            {/* Billedeinput */}
            <div>
                <label htmlFor="image">Vælg billede (valgfrit):</label>
                {image && <img className={styles.previewImage} src={image} />}
                <input id="image" type="file" onChange={handleImageChange} />
            </div>

            {/* Input til titel */}
            <div>
                <label htmlFor="title">Titel:</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            {/* Dropdown til kategori */}
            <div>
                <label htmlFor="category">Kategori:</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option className={styles.category} value="">Vælg kategori</option>
                    <option value="Pizzaer">Pizzaer</option>
                    <option value="Indbagte pizzaer">Indbagte pizzaer</option>
                    <option value="Durum ruller">Durum ruller</option>
                </select>
            </div>

            {/* Input til almindelig pris */}
            <div>
                <label htmlFor="normalPrice">Almindelig pris:</label>
                <input
                    id="normalPrice"
                    type="number"
                    value={normalPrice}
                    onChange={(e) => setNormalPrice(e.target.value)}
                    required
                />
            </div>

            {/* Input til familie pris */}
            <div>
                <label htmlFor="familyPrice">Familie pris:</label>
                <input
                    id="familyPrice"
                    type="number"
                    value={familyPrice}
                    onChange={(e) => setFamilyPrice(e.target.value)}
                    required
                />
            </div>

            {/* Input til ingredienser */}
            <div>
                <label htmlFor="ingredients">Ingredienser:</label>
                <textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                />
            </div>

            {/* Knap til at submitte formularen */}
            <Button2
                type="submit"
                buttonText={isEditMode ? "Opdater ret" : "Tilføj ret"}
                background={!isEditMode ? "green" : undefined}
            />
        </form>
    )
}

export default DishForm
