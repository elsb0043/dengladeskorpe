import { useAuthContext } from '../../../context/useAuthContext'
import { useNavigate } from 'react-router-dom' // Importer useNavigate
import Button from '../../Button/Button'
import styles from './logout.module.css'

function Logout() {
    const { signOut } = useAuthContext() // Hent signOut funktion fra context

    return (
        <div className={styles.logout}>
            <Button text="Log Ud" type="type" onClick={signOut} />
        </div>
    )
}

export default Logout