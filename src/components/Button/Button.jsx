import styles from './button.module.css'

function Button({ text, type = "button", onClick }) {

    return (
        <button className={styles.button} type={type} onClick={onClick}>
            {text}
        </button>
    )
}

export default Button