import { Outlet, useNavigate } from "react-router-dom"
import { useAlert } from "../../context/alertContext"
import { useFetchDishes } from "../../hooks/useFetchDishes"
import { useFetchEmployees } from "../../hooks/useFetchEmployees"
import Button2 from "../../components/Button/Button2"

// DISHES
const BackofficeDishes = () => {
  // Henter retter og nødvendige funktioner fra useFetchDishes hook
  const { dishes, deleteDish, refetch } = useFetchDishes()
  const { showError, showConfirmation } = useAlert()
  const navigate = useNavigate()

  // Funktion til at navigere til siden for at tilføje en ret
  const handleAddDish = () => {
    navigate("/backoffice/backofficedishes/add")
  }

  // Funktion til at navigere til siden for at redigere en ret
  const handleEdit = (dishId) => {
    navigate(`/backoffice/backofficedishes/edit/${dishId}`)
  }

  // Funktion til at vise en bekræftelsesdialog ved sletning af en ret
  const handleConfirmation = (dishId) => {
    showConfirmation(
      "Du er ved at slette denne ret", // Bekræftelsestekst
      "Er du sikker?", // Spørgsmål
      () => deleteDish(dishId), // Hvis bekræftet, slet retten
      () => showError("Sletning annulleret.") // Hvis annulleret, vis fejlbesked
    )
  }

  return (
    <article>
      <table>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Billede</th>
            <th>Ingredienser</th>
            <th>Pris (almindelig)</th>
            <th>Pris (familie)</th>
            <th>Kategori</th>
            <th>Handling</th>
          </tr>
        </thead>
        <tbody>
          {dishes?.map((dish) => (
            <tr key={dish._id} className="backofficeItem">
              <td>{dish.title}</td>
              <td>
                <img src={dish.image} alt={dish.title} />
              </td>
              <td>{dish.ingredients?.join(", ")}</td>
              <td>{dish.price?.normal ? `${dish.price.normal},-` : "Ikke angivet"}</td>
              <td>{dish.price?.family ? `${dish.price.family},-` : "Ikke angivet"}</td>
              <td>{dish.category || "Ikke angivet"}</td>
              <td className="buttons">
                {/* Sletningsknap */}
                <Button2
                  buttonText="Slet"
                  background="red"
                  onClick={() => handleConfirmation(dish._id)}
                />
                {/* Redigeringsknap */}
                {/* <Button2
                  buttonText="Redigér"
                  onClick={() => handleEdit(dish._id)}
                /> */}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              {/* Tilføj ret-knap */}
              <Button2
                buttonText="Tilføj ret"
                background="green"
                onClick={handleAddDish}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {/* Outlet for at lade underkomponenter få adgang til refetch */}
      <Outlet context={{ refetch }} />
    </article>
  )
}


// EMPLOYEES
const BackofficeEmployees = () => {
  // Henter medarbejdere og nødvendige funktioner fra useFetchEmployees hook
  const { employees, deleteEmployee, refetch } = useFetchEmployees()
  const { showError, showConfirmation } = useAlert()
  const navigate = useNavigate()

  // Funktion til at navigere til siden for at tilføje en medarbejder
  const handleAddEmployee = () => {
    navigate("/backoffice/employees/add")
  }

  // Funktion til at navigere til siden for at redigere en ret
  const handleEdit = (employeeId) => {
    navigate(`/backoffice/employees/edit/${employeeId}`)
  }

  // Funktion til at vise en bekræftelsesdialog ved sletning af en medarbejder
  const handleConfirmation = (employeeId) => {
    showConfirmation(
      "Du er ved at slette denne medarbejder ", // Bekræftelsestekst
      "Er du sikker?", // Spørgsmål
      () => deleteEmployee(employeeId), // Hvis bekræftet, slet medarbejderen
      () => showError("Sletning annulleret.") // Hvis annulleret, vis fejlbesked
    )
  }

  return (
    <article>
      <table>
        <thead>
          <tr>
            <th>Billede</th>
            <th>Navn</th>
            <th>Job</th>
            <th>Handling</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => (
            <tr key={employee._id} className='backofficeItem'>
              <td>
                <img src={employee.image} alt={employee.name}></img>
              </td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td className='buttons'>
                {/* Sletningsknap */}
                <Button2
                  buttonText="Slet"
                  background="red"
                  onClick={() => handleConfirmation(employee._id)}
                />
                {/* Redigeringsknap */}
                <Button2
                  buttonText='Redigér'
                  onClick={() => handleEdit(employee._id)}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td>
              {/* Tilføj medarbejder-knap */}
              <Button2
                buttonText='Tilføj en medarbejder '
                background='green'
                onClick={() => handleAddEmployee()}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {/* Outlet for at lade underkomponenter få adgang til refetch */}
      <Outlet context={{ refetch }} />
    </article>
  )
}

export { BackofficeDishes, BackofficeEmployees }