import { useState } from 'react' // Importerer useState fra React for at håndtere state
import styles from './down.module.css' // Import af CSS-modul til styling af dropdown
import { icons } from '../../services/Icons' // Import af ikoner (for eksempel en pil op/ned)

// SizeDropdown-komponenten håndterer visningen af en dropdown-menu, der tillader brugeren at vælge størrelse
function SizeDropdown() {
    // State til at holde styr på den valgte størrelse
    const [selectedSize, setSelectedSize] = useState('Almindelig') 

    // State til at styre om dropdown-menuen er åben eller lukket
    const [isOpen, setIsOpen] = useState(false)

    // Funktion til at toggle åbning og lukning af dropdown-menuen
    const toggleDropdown = () => setIsOpen(!isOpen)
    
    // Funktion til at opdatere den valgte størrelse og lukke dropdown-menuen
    const handleSelect = (value) => {
        setSelectedSize(value)  // Opdaterer valgt størrelse
        setIsOpen(false) // Lukker dropdown-menuen
    }

    return (
        <div className={styles.sizeDropdownContainer}>
            {/* Dropdown trigger: klik her for at åbne/lytte på ændring */}
            <div className={styles.sizeDropdown} onClick={toggleDropdown}>
                <span>{selectedSize}</span> {/* Vist valgt størrelse */}
                <span className={styles.arrow}>
                    {isOpen ? icons['ArrowUp'] : icons['ArrowDown']} {/* Ændrer pil-ikon afhængigt af om dropdown er åben */}
                </span>
            </div>
            
            {/* Vis dropdown-menuen, hvis isOpen er true */}
            {isOpen && (
                <ul className={styles.sizeDropdownMenu}>
                    {/* List elementer for størrelser */}
                    <li onClick={() => handleSelect('Almindelig')}>Almindelig</li>
                    <li onClick={() => handleSelect('Familie')}>Familie</li>
                </ul>
            )}
        </div>
    )
}

export default SizeDropdown