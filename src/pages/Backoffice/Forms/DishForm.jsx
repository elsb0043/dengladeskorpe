import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import styles from "./form.module.css"
import { useFetchDishes } from "../../../hooks/useFetchDishes"
import Button2 from "../../../components/Button/Button2"

const DishForm = ({ isEditMode }) => {
    const [title, setTitle] = useState("") // State til titel
    const [category, setCategory] = useState("") // State til kategori
    const [normalPrice, setNormalPrice] = useState("") // State til almindelig pris
    const [familyPrice, setFamilyPrice] = useState("") // State til familie pris
    const [image, setImage] = useState(null) // State til billede
    const [selectedFile, setSelectedFile] = useState(null) // State til valgt billede
    const [ingredients, setIngredients] = useState("") // State til ingredienser

    const { refetch } = useOutletContext() // Henter refetch funktionen fra Outlet context
    const navigate = useNavigate() // Bruges til at navigere efter submit
    const { id } = useParams() // Henter id fra URL (bruges i edit mode)
    const { createDish, fetchDishById } = useFetchDishes() // Henter funktioner til at hente og opdatere retter

    // useEffect hook til at hente eksisterende data, hvis vi er i redigeringstilstand
    useEffect(() => {
        if (isEditMode && id) {
            const loadDishData = async () => {
                try {
                    const response = await fetchDishById(id) // Hent retten ved id
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
            loadDishData() // Hent retten
        }
    }, [isEditMode, id, fetchDishById]) // Afhængigheder for useEffect: isEditMode, id, fetchDishById

    // Håndter billede upload
    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file) // Sæt den valgte fil i state
            const objUrl = window.URL.createObjectURL(file) // Opret en objekt-URL for billedet
            setImage(objUrl) // Sæt URL'en som billede
        }
    }

    // Håndter submit af formularen
    const handleSubmitDish = async (event) => {
        event.preventDefault() // Forhindrer default form submit

        const dishData = new FormData() // Opret en FormData objekt til at sende data
        dishData.append("title", title)
        dishData.append("category", category)
        dishData.append("ingredients", ingredients)

        const price = {
            normal: parseFloat(normalPrice), // Konverter pris til float
            family: parseFloat(familyPrice) // Konverter familiepris til float
        }
        dishData.append("price", JSON.stringify(price)) // JSON-stringify objektet og tilføj det til FormData

        // Hvis der er valgt et billede, tilføj det til FormData
        if (selectedFile) {
            dishData.append("file", selectedFile)
        }

        try {
            let response
            if (isEditMode && id) {
                dishData.append("id", id) // Hvis vi er i redigeringstilstand, tilføj id
            } else {
                response = await createDish(dishData) // Opret en ny ret
            }

            console.log(
                isEditMode ? "Ret er opdateret" : "Ret er oprettet",
                response
            )

            // Efter successfuld opdatering/tilføjelse, refetch data og naviger væk
            if (response) {
                await refetch() // Refetch data fra parent-komponenten
                navigate("/backoffice/backofficedishes") // Naviger tilbage til backoffice-siden
            }
        } catch (error) {
            console.error("Fejl ved håndtering af ret:", error) // Fejl ved oprettelse eller opdatering
        }
    }

    return (
        <form onSubmit={handleSubmitDish} className={styles.form}>
            <h2>{isEditMode ? "Opdater ret" : "Tilføj ret"}</h2> {/* Dynamisk heading afhængigt af om vi er i redigeringstilstand */}

            {/* Billedeinput */}
            <div>
                <label htmlFor="image">Vælg billede (valgfrit):</label>
                {image && <img className={styles.previewImage} src={image} />} {/* Vis billede, hvis det er valgt */}
                <input className={styles.backInput} id="image" type="file" onChange={handleImageChange} /> {/* Billede input */}
            </div>

            {/* Input til titel */}
            <div>
                <label htmlFor="title">Titel:</label>
                <input
                    className={styles.backInput}
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} // Håndter titel ændring
                    required
                />
            </div>

            {/* Dropdown til kategori */}
            <div>
                <label htmlFor="category">Kategori:</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)} // Håndter kategori ændring
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
                    className={styles.backInput}
                    id="normalPrice"
                    type="number"
                    value={normalPrice}
                    onChange={(e) => setNormalPrice(e.target.value)} // Håndter prisændring
                    required
                />
            </div>

            {/* Input til familie pris */}
            <div>
                <label htmlFor="familyPrice">Familie pris:</label>
                <input
                    className={styles.backInput}
                    id="familyPrice"
                    type="number"
                    value={familyPrice}
                    onChange={(e) => setFamilyPrice(e.target.value)} // Håndter familie pris ændring
                    required
                />
            </div>

            {/* Input til ingredienser */}
            <div>
                <label htmlFor="ingredients">Ingredienser:</label>
                <textarea
                    className={styles.backTextarea}
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)} // Håndter ingrediensændring
                    required
                    placeholder="Fx Pepperoni, Hvidløg, Salat"
                />
            </div>

            {/* Knap til at submitte formularen */}
            <Button2
                type="submit"
                buttonText="Tilføj ret" // Dynamisk tekst afhængigt af om vi er i redigeringstilstand
                background={!isEditMode ? "green" : undefined} // Sæt baggrundsfarve til grøn, hvis vi er i tilføj tilstand
            />
        </form>
    )
}

export default DishForm