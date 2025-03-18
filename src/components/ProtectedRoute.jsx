import { Navigate } from "react-router-dom"

// ProtectedRoute-komponenten beskytter specifikke ruter og sikrer, at kun tilladte brugere kan få adgang
const ProtectedRoute = ({ isAllowed, redirectTo = "/login", children }) => {
  // Tjekker om brugeren har tilladelse til at få adgang til den beskyttede rute
  if (!isAllowed) {
    // Hvis brugeren ikke har tilladelse, omdirigeres de til en angivet rute (standard er "/login")
    return <Navigate to={redirectTo} />
  }

  // Hvis brugeren har tilladelse, renderes børnene (de tilladte komponenter/ruter)
  return children
}

export default ProtectedRoute