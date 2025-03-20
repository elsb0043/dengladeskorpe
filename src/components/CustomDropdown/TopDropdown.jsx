import { useState } from 'react' // Importerer useState fra React for at håndtere state
import styles from './down.module.css' // Import af CSS-modul til styling af dropdown
import { icons } from '../../services/Icons' // Import af ikoner (for eksempel en pil op/ned)

// TopDropdown-komponenten er en dropdown, der giver brugeren mulighed for at vælge topping
function TopDropdown({ label, selectedValue, onChange }) {
    // State til at styre om dropdown-menuen er åben eller lukket
    const [isOpen, setIsOpen] = useState(false)

    // Liste af tilgængelige toppingmuligheder
    const toppingsOptions = [
        "Chili",
        "Hvidløg",
        "Rød Peber",
        "Kebab",
    ]

    // Funktion til at toggle åbning og lukning af dropdown-menuen
    const toggleDropdown = () => setIsOpen(!isOpen)

    // Funktion til at opdatere den valgte topping og lukke dropdown-menuen
    const handleSelect = (value) => {
        onChange(value)  // Kald onChange for at opdatere parent-komponenten med den valgte topping
        setIsOpen(false) // Lukker dropdown-menuen
    }

    return (
        <div className={styles.topDropdownContainer}>
            {/* Dropdown trigger: klik her for at åbne/lytte på ændring */}
            <div className={styles.topDropdown} onClick={toggleDropdown}>
                <span>{selectedValue || label}</span> {/* Vist den valgte værdi eller label */}
                <span className={styles.arrow}>
                    {isOpen ? icons['ArrowUp'] : icons['ArrowDown']} {/* Ændrer pil-ikon afhængigt af om dropdown er åben */}
                </span>
            </div>

            {/* Vis dropdown-menuen, hvis isOpen er true */}
            {isOpen && (
                <ul className={styles.topDropdownMenu}>
                    {/* Map igennem toppingmuligheder og rendér hvert element */}
                    {toppingsOptions.map((option, index) => (
                        <li key={index} onClick={() => handleSelect(option)}>
                            {option} {/* Vist toppingmulighed */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default TopDropdown