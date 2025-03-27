import styles from './button.module.css'

function Button({ text, type = "button", onClick, onClickExtra }) {
    
    const handleClick = (e) => {
        if (onClick) onClick(e)
        if (onClickExtra) onClickExtra(e)
    }

    return (
        <button className={styles.button} type={type} onClick={handleClick}>
            {text}
        </button>
    )
}

export default Button