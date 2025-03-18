import styles from './header.module.css'

function PageHeader({ smalltext, title, subtitle, img }) {

    return (
        <div className={styles.header} style={{ backgroundImage: `url(${img})` }}>
            <div className={styles.headerContent}>
                <h3>{smalltext}</h3>
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
            </div>
        </div>
    )
}

export default PageHeader