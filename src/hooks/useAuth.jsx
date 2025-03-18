import { useLocalStorage } from "@uidotdev/usehooks"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

/* En hook til at håndtere login og logout, gemme autentificeringsdata i localStorage og tilbyde funktioner til at administrere brugerens login-status */

const useAuth = () => {
    // States til e-mail og adgangskodeinput
    const [email, setEmail] = useState("") // Holder styr på e-mailfeltet
    const [password, setPassword] = useState("") // Holder styr på adgangskodefeltet
    const [error, setError] = useState("") // Holder fejlmeddelelser
    const [user, setUser] = useLocalStorage("user", {}) // Gemmer brugerdata i localStorage
    const [auth, setAuth] = useLocalStorage("auth", {}) // Gemmer autentificeringsdata (f.eks. token) i localStorage
    const navigate = useNavigate() // Navigationsfunktion til at omdirigere brugeren

    // Funktion til at logge brugeren ind
    const signIn = async (e) => {
        e.preventDefault() // Forhindrer standard formular-indsending - laver din egen logik i stedet for standardopførsel (Det er som at sige "Nej tak" til noget, der normalt ville ske)
        setError("") // Nulstiller fejlmeddelelser før nyt loginforsøg

        try {
            // Sender login-data til backend
            const response = await fetch("http://localhost:3042/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Informerer serveren om JSON-data
                },
                body: JSON.stringify({ email, password }), // Sender e-mail og adgangskode som JSON
            })

            if (!response.ok) {
                // Hvis login fejler, hentes og vises fejlbeskeden
                const errordata = await response.json()
                throw new Error(errordata.message || "Login failed.") // Smider en fejl med besked
            }

            // Henter svar fra serveren og dekoder tokenen
            const result = await response.json()
            const user = jwtDecode(result.data.token) // Dekoder brugerdata fra tokenen
            setUser(user) // Gemmer brugerdata i localStorage
            setAuth({ token: result.data.token }) // Gemmer token i localStorage
            navigate("/backoffice") // Navigerer til backoffice-siden efter succesfuldt login
        } catch (err) {
            setError(err.message) // Viser fejlmeddelelsen til brugeren
        }
    }

    // Funktion til at logge brugeren ud
    const signOut = () => {
        setAuth({}) // Fjerner autentificeringsdata
        setUser({}) // Fjerner brugerdata
        navigate("/login") // Navigerer til login-siden
    }

    // Ekstra data og funktioner for at håndtere autentificering
    const token = auth.token || "" // Henter token fra state, eller en tom streng hvis det ikke findes
    const signedIn = !!auth.token // Checker om brugeren er logget ind ved at se om der er en token

    // Returnerer alle nødvendige værdier og funktioner for at håndtere autentificering
    return {
        signIn,          // Login-funktion
        signedIn,        // Boolesk værdi: Er brugeren logget ind?
        signOut,         // Logout-funktion
        token,           // JWT token
        email,           // E-mailfeltets værdi
        setEmail,        // Funktion til at opdatere e-mail
        password,        // Adgangskodefeltets værdi
        setPassword,     // Funktion til at opdatere adgangskode
        user,            // Brugerdata (dekodet fra token)
        error,           // Fejlmeddelelse
    }
}

export default useAuth