import { useLocation, useRoutes } from "react-router-dom"
import { useAuthContext } from "./context/useAuthContext"
import { BackofficeDishes, BackofficeEmployees } from "./pages/Backoffice/BackofficeItems"
import headerImg from "/assets/headerImg.png"
/* CUSTOM PAGES */
import Navigation from "./components/Navigation/Navigation"
import HomePage from "./pages/Home"
import TeamPage from "./pages/Team"
import ContactPage from "./pages/Contact"
import CheckoutPage from "./pages/Checkout"
import Footer from "./components/Footer/Footer"
/* BACKOFFICE */
import ProtectedRoute from "./components/ProtectedRoute"
import Backoffice from "./pages/Backoffice/Backoffice"
import Login from "./components/BackofficePage/Login/Login"
import DishForm from "./pages/Backoffice/Forms/DishForm"
import EmployeesForm from "./pages/Backoffice/Forms/EmployeeForm"
import PageHeader from "./components/PageHeader/PageHeader"
import Dishes from "./components/HomePage/Dishes/Dishes"
import SingleviewDish from "./pages/SingleviewDish/SingleviewDish"

function App() {
  // Henter authentication state via custom hook useAuth
  const { signedIn } = useAuthContext()

  const location = useLocation() // Bruges til at hente den nuværende URL (path)
  
  // Bestemmer om navigationen og footer skal vises baseret på URL'en
  const isNav = ["/", "/team", "/contact", "/checkout"].includes(location.pathname)
  const isFooter = ["/", "/team", "/contact", "/checkout"].includes(location.pathname)
  const isPageHeader = ["/", "/team", "/contact", "/checkout"].includes(location.pathname)

  // Definerer ruterne i appen
  const routes = useRoutes([
    { 
      path: "/", 
      element: <HomePage />
    },
    { 
      path: "/team", 
      element: <TeamPage />
    },
    { 
      path: "/contact", 
      element: <ContactPage />
    },
    { 
      path: "/checkout", 
      element: <CheckoutPage />
    },
    { 
      path: "/login", 
      element: <Login />
    },
    { 
      path: "/backoffice", 
      element: (
        <ProtectedRoute isAllowed={signedIn}>
            <Backoffice /> {/* Backoffice komponent, beskyttet af login */}
        </ProtectedRoute>
      ),
      children: [
        {
          path: "backofficedishes", 
          element: <BackofficeDishes />, // Ret oversigt i backoffice
          children: [
            {
              path: "add", // Rute til at tilføje en nyt ret
              element: <DishForm />,
            },
            {
              path: "edit/:id", // Rute til at redigere en ret baseret på ID
              element: <DishForm isEditMode={true} />,
            },
          ],
        },
        {
          path: "employees", 
          element: <BackofficeEmployees />,
          children: [
            {
              path: "add",
              element: <EmployeesForm />,
            },
            {
              path: "edit/:id", 
              element: <EmployeesForm isEditMode={true} />,
            },
          ],
        },
      ],
    },
    {
      path: "*", // Fallback rute, hvis ingen af de øvrige ruter matches
      element : <div>NOT FOUND</div> // Vis en fejlmeddelelse, hvis ingen rute findes
    },
  ])

  return (
    <>
      {isNav && <Navigation />}
      {isPageHeader && <PageHeader smalltext='Den' title='Glade' subtitle='Skorpe' img={headerImg} />}
      <div>{routes}</div>
      {isFooter && <Footer />}
    </>
  )
}

export default App