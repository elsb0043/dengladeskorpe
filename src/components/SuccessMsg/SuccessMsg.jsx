import styles from './msg.module.css'

function SuccessMsg({ message }) {
    return (
        <div className={styles.successMsgContainer}>
            <div className={styles.successMsgContent}>
                <h3>{message}</h3>
            </div>
        </div>
    )
}

export default SuccessMsg