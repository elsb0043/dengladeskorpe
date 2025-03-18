import useAuth from '../../../hooks/useAuth'
import Button from '../../Button/Button'
import styles from './login.module.css'

// Funktionel komponent til login
function Login() {
    // Henter nødvendige værdier og funktioner fra useAuth-hooket
    const { setEmail, setPassword, error, signIn } = useAuth()

    return (
        <div className={styles.loginContent}>
            {/* Formular til at håndtere login */}
            <form className={styles.loginForm} onSubmit={signIn}>
                {/* Viser en fejlbesked, hvis der er en fejl */}
                {error && <p className={styles.failedLogin}>{error}</p>}
                
                {/* Input-felt til email */}
                <input 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)} // Opdaterer email-state i useAuth
                    required 
                    placeholder='Email' 
                />
                
                {/* Input-felt til kodeord */}
                <input 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)} // Opdaterer password-state i useAuth
                    placeholder='Password' 
                />
                
                {/* Knap til at sende formularen */}
                <Button text="Log Ind" type="type" />
            </form>
        </div>
    )
}

export default Login