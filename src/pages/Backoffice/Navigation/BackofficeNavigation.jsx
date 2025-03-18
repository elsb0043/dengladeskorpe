import { NavLink } from "react-router-dom"
import styles from "./backofficeNavigation.module.css"

const BackofficeNavigation = () => {
  return (
    <ul className={styles.backofficeNavigation}>
      {/* Navigation for Retter */}
      <li>
        <NavLink
          to='/backoffice/backofficedishes' // Link til retsiden i backoffice
          // Klasseændring, når linket er aktivt
          className={({ isActive }) => (isActive ? styles.active : "")}>
          Retter
        </NavLink>
      </li>
      
      {/* Navigation for Personale */}
      <li>
        <NavLink
          to='/backoffice/employees' // Link til personalesiden i backoffice
          // Klasseændring, når linket er aktivt
          className={({ isActive }) => (isActive ? styles.active : "")}>
          Personale
        </NavLink>
      </li>
    </ul>
  )
}

export default BackofficeNavigation