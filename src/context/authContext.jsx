import { useLocalStorage } from "@uidotdev/usehooks" 
import { createContext, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate, useLocation } from "react-router-dom" 

// Opretter en AuthContext, der bruges til at dele autentificeringsdata globalt i stedet for at sende data fra komponent til komponent via props.
export const AuthContext = createContext() // Opretter en kontekst, som komponenter kan bruge til at få adgang til autentificeringsdata

// AuthContextProvider komponenten, der styrer og deler autentificeringsstatus med børnene
export const AuthContextProvider = ({ children }) => {
  // Gemmer autentificeringsdata (token) og brugerdata i localStorage
  const [auth, saveAuth] = useLocalStorage("auth", {}) // auth holder token og gemmer det i localStorage
  const [user, setUser] = useLocalStorage("user", {}) // user holder dekodet brugerdata og gemmer det i localStorage

  const location = useLocation() // Hook der giver den nuværende URL-path
  const navigate = useNavigate() // Hook der giver mulighed for at navigere til andre sider

  // useEffect tjekker, om brugeren er på en backoffice-side og ikke på login-siden
  useEffect(() => {
    // Denne useEffect kører hver gang pathen ændrer sig
    const checkUser = async () => {
      // Tjekker om brugeren er på en backoffice-side og ikke på login-siden
      if (
        location.pathname.includes("backoffice") && // Hvis pathen indeholder 'backoffice'
        !location.pathname.includes("login") // Og ikke indeholder 'login'
      ) {
        // Hvis token findes, forsøg at validere det
        if (auth.token !== undefined) {
          let response = await fetch("http://localhost:3042/auth/token", {
            method: "POST", // Sender en POST-request til serveren for at validere token
            headers: {
              Authorization: `Bearer ${auth.token}`, // Sender token i Authorization-headeren
              "Content-Type": "application/json", // Angiver at dataen er i JSON-format
            },
            body: JSON.stringify({ token: auth.token }), // Sender token som JSON-body
          })

          let result = await response.json() // Henter JSON-responsen fra serveren

          // Tjekker om tokenen er udløbet
          if (result.message === "Token Expired") {
            saveAuth({}) // Fjerner token og brugerdata fra localStorage
            setUser({})   // Tømmer brugerdata
            return navigate("/login") // Navigerer til login-siden, hvis token er udløbet
          } else {
            setUser(result.data) // Sætter brugerdata i state, hvis token er gyldigt
          }
        } else {
          // Hvis der ikke er en token, navigér til login-siden
          return navigate("/login")
        }
      }
    }

    checkUser() // Kalder funktionen for at tjekke brugerens status ved hver ændring i pathen
  }, [location.pathname, auth.token, navigate, saveAuth]) // useEffect afhænger af location.pathname, auth.token og navigate

  // Funktion til at hente token fra auth-objektet (kan være tomt, hvis der ikke er token)
  const token = auth.token ? auth.token : "" // Hvis der er en token, returneres den, ellers en tom streng

  // Funktion der tjekker om brugeren er logget ind baseret på token
  const signedIn = auth.token !== undefined // Hvis der er en token, er brugeren logget ind (true), ellers false

  // Funktion til at logge brugeren ind
  const signIn = async (email, password) => {
    // Sender login-data til serveren
    let response = await fetch("http://localhost:3042/auth/signin", {
      method: "POST", // Bruger POST-metoden til at sende login-data
      headers: {
        "Content-Type": "application/json", // Angiver at vi sender JSON-data
      },
      body: JSON.stringify({
        email: email, // Sender e-mail
        password: password, // Sender adgangskode
      }),
    })

    let result = await response.json() // Henter serverens svar som JSON

    // Dekoder token og henter brugerdata
    const user = jwtDecode(result.data.token) // Dekoder JWT-tokenet for at få brugerdata

    // Gemmer token og brugerdata i localStorage
    saveAuth({ token: result.data.token }) // Gemmer token
    setUser(user) // Gemmer brugerdata
    navigate("/") // Navigerer brugeren til forsiden efter succesfuld login

    return user // Returnerer brugerdata
  }

  // Funktion til at hente brugerdata baseret på den gemte token
  const getUser = () => {
    return token !== "" ? jwtDecode(token) : {} // Hvis der er en token, dekoder den og returnerer brugerdata
  }

  // Funktion til at logge brugeren ud
  const signOut = () => {
    saveAuth({}) // Fjerner token fra localStorage
    setUser({}) // Fjerner brugerdata fra localStorage
  }

  // Værdi der leveres til AuthContext.Provider for at blive brugt af alle komponenter der bruger denne kontekst
  const value = { 
    token,           // Den gemte token
    user,            // Brugerdata
    getUser,         // Funktion til at hente brugerdata
    signIn,          // Login-funktion
    signOut,         // Logout-funktion
    signedIn         // Boolesk værdi: Er brugeren logget ind?
  }

  // Returnerer AuthContext.Provider og giver adgang til auth-relaterede data og funktioner
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}