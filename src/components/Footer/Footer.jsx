import styles from './footer.module.css'

function Footer() {

    return (
        <footer>
            <div className={styles.footerContent}>
                <img className={styles.footerLogo} src="/assets/logo.png" alt="Logo" />
                <div className={styles.footerContact}>
                    <div className={styles.footerContactInfo}>
                        <p>
                            Email: gladskorpe@pizzaglad.dk
                        </p>
                    </div>
                    <div className={styles.footerContactInfo}>
                        <p>
                            Tlf: 12345678
                        </p>
                    </div>
                    <div className={styles.footerContactInfo}>
                        <p>
                            Adresse: Skorpevej 42, 1234 Pizzabyen
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer