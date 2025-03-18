import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi"
import { RxCross2 } from "react-icons/rx"
import { useBasket } from '../../context/basketContext'
import { icons } from '../../services/Icons'
import styles from './nav.module.css'

function Navigation() {
    const [isOpen, setIsOpen] = useState(false) // Styre, om menuen er åben eller lukket
    const { basket } = useBasket() // Henter basket contexten, som indeholder produkter i kurven

    const toggleNav = () => setIsOpen((prev) => !prev) // Skifter tilstanden for menuens åbning
    const closeNav = () => setIsOpen(false) // Lukker menuen

    // Navigation menu links og deres stier
    const Nav = [
        { 
          path: "/", 
          title: "Forside" 
        },
        { 
          path: "/team", 
          title: "Personalet" 
        },
        { 
          path: "/contact", 
          title: "Kontakt" 
        },
        { 
          path: "/checkout", 
          title: "Kurv" 
        },
        { 
          path: "/backoffice", 
          title: "Backoffice" 
        },
    ]

    return (
        <nav className={styles.navBar}>
            {/* Logo, som navigerer til startsiden */}
            <Link to="/">
                <img className={styles.navLogo} src="/assets/logo.png" alt="Logo" />
            </Link>

            <div className={styles.navList}>
              <div className={styles.navIcons}>
                {/* Basket link til checkout */}
                <Link to="/checkout" className={styles.basket}>
                  <img className={styles.basketImg} src="/assets/basket_icon.png" />
                  <div>{basket.length}</div> {/* Antal varer i kurven */}
                </Link>
                
                {/* Hamburger menu, der åbner og lukker navigationen */}
                <div className={styles.hamburger} onClick={toggleNav}>
                  {isOpen ? <RxCross2 size={30} /> : <GiHamburgerMenu size={25} />}
                </div>
              </div>
              
              {/* Links til navigationen, vises kun når menuen er åben */}
              <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
                {Nav.map((item, index) => (
                    <NavLink key={index} to={item.path} onClick={closeNav} className={({ isActive }) => (isActive ? styles.active : '')}>
                        {item.title} {/* Titel på menuitem */}
                    </NavLink>
                ))}
              </div>
            </div>
        </nav>
    )
}

export default Navigation