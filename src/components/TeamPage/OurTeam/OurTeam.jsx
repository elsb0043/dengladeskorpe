import { useFetchEmployees } from '../../../hooks/useFetchEmployees'
import styles from './team.module.css'

function OurTeam() {
    // Henter employee data via en custom hook
    const { employees } = useFetchEmployees()

    return (
        <div className={styles.team}>
            <div className={styles.teamText}>
                <h2>Personalet hos Den Glade Skorpe</h2>
                <p>Hos Den Glade Skorpe har vi et dedikeret og venligt personale, der altid går den ekstra mil for at sikre, at kunderne får den bedste oplevelse. Teamet består af erfarne pizzabagere, der med passion tilbereder lækre pizzaer med friske råvarer.</p>
            </div>
            <div className={styles.teamCards}>
                {/* Kort til at vise hver medarbejder */}
                {employees.map(em => (
                    <div key={em._id} className={styles.teamCard}>
                    {/* Vis medarbejderens billede */}
                    <img src={em.image} />
                    <div className={styles.teamCardText}>
                        <h3>{em.name}</h3>
                        <p>{em.position}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default OurTeam