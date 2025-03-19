import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import styles from "./form.module.css"
import { useFetchEmployees } from "../../../hooks/useFetchEmployees"
import Button2 from "../../../components/Button/Button2"

const EmployeesForm = ({ isEditMode }) => {
    const [name, setName] = useState("")
    const [position, setPosition] = useState("")
    const [image, setImage] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const { refetch } = useOutletContext() 
    const navigate = useNavigate() 
    const { id } = useParams()
    const { createEmployee, fetchEmployeeById, updateEmployee } = useFetchEmployees()

    useEffect(() => {
        if (isEditMode && id) {
            const loadEmployeeData = async () => {
                try {
                    const response = await fetchEmployeeById(id)
    
                    if (response) {
                        setName(response.name) 
                        setText(response.text) 
                        setImage(response.image) 
                    }
                } catch (error) {
                    console.error("Error fetching employee:", error)
                }
            }
    
            loadEmployeeData()
        }
    }, [isEditMode, id, fetchEmployeeById])

    // FORHÅNDSVISNING AF BILLEDE
    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            const objUrl = window.URL.createObjectURL(file)
            setImage(objUrl)
        }
    }
    

    // HÅNDTERING AF FORMULAR-SUBMIT
    const handleSubmitEmployee = async (event) => {
        event.preventDefault()

        const employeeData = new FormData()
        employeeData.append("name", name)
        employeeData.append("position", position)

        // Tilføjer billedet hvis det er valgt
        if (selectedFile) {
            employeeData.append("file", selectedFile)
        }

        try {
            let response
            if (isEditMode && id) {
                employeeData.append("id", id)
                response = await updateEmployee(employeeData)
            } else {
                response = await createEmployee(employeeData)
            }

            console.log (
                isEditMode ? "Medarbejder er opdateret" : "Medarbejder er oprettet", 
                response
            )

            if (response) {
                await refetch()
                navigate("/backoffice/employees") 
            }
        } catch (error) {
            console.error("Fejl ved håndtering af medarbejder :", error)
        }
    }

    return (
        <form onSubmit={handleSubmitEmployee} className={styles.form}>
            <h2>{isEditMode ? "Opdater en medarbejder " : "Tilføj en medarbejder "}</h2>
            <div>
                <label htmlFor='image'>Vælg billede (valgfrit):</label>
                    {image && <img className={styles.previewImage} src={image} />}
                <input id='image' type='file' onChange={handleImageChange} />
            </div>
            <div>
                <label htmlFor='name'>Navn:</label>
                <input
                    id='name'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor='position'>Job:</label>
                <input
                    id='position'
                    type='text'
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                />
            </div>

            <Button2
                type='type'
                buttonText={isEditMode ? "Opdater en medarbejder " : "Tilføj en medarbejder "}
                background={!isEditMode && "green"}
            />
        </form>
    )
}

export default EmployeesForm