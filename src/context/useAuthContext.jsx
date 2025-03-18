import { useContext } from "react" // Importerer useContext-hooket fra React
import { AuthContext } from "./authContext" // Importerer AuthContext fra authContext.js

// Custom hook til at tilgå AuthContext
export const useAuthContext = () => useContext(AuthContext)