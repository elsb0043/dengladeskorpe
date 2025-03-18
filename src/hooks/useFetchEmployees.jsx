import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../context/useAuthContext"

const useFetchEmployees = () => {
    const [employees, setEmployees] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useAuthContext()

    // HENT ALLE EMPLOYEES 
    const fetchEmployees = useCallback(async () => {
        setError(null)
        setIsLoading(true)
        try {
            const response = await fetch("http://localhost:3042/employees")
            const data = await response.json()
            setEmployees(data.data)
        } catch (error) {
            setError(error.message)
            console.error("Error fetching employees:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    
      // OPRET EMPLOYEES
      const createEmployee = async (formData) => {
        try {
            const response = await fetch("http://localhost:3042/employee", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
            if (!response.ok) {
                throw new Error("Fejl ved oprettelse af hold") 
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error("Fejl ved oprettelse:", error)
            throw error 
        }
    }


    // OPDATER EMPLOYEES
    const updateEmployee = async (formData) => {
        try {
            const response = await fetch("http://localhost:3042/employee", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
                body: formData,
            })
            if (!response.ok) {
                throw new Error("Fejl ved opdatering af hold")
            }
            const result = await response.json()
            return result
        } catch (error) {
            console.error("Fejl ved opdatering:", error)
            throw error
        }
    }


    // SLET EMPLOYEES
    const deleteEmployee = async (params) => {
        
        try {
            await fetch(`http://localhost:3042/employee/${params}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const filteredArray = employees.filter((em) => em._id !== params)
            setEmployees(filteredArray)
        } catch (error) {
            console.error("Fejl ved sletning:", error)
        }
    }


    // HENT EMPLOYEES BASERET PÅ ID
    const fetchEmployeeById = async (id) => {
        setError(null)
        setIsLoading(true)
    
        try {
            const response = await fetch(`http://localhost:3042/employee/${id}`)
    
            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to fetch employee: ${errorText}`)
            }
    
            const employee = await response.json()
            return employee.data[0]
        } catch (error) {
            setError(error.message)
            console.error("Error fetching employee:", error)
        } finally {
            setIsLoading(false) 
        }
    }

    const refetch = useCallback(() => {
        fetchEmployees()
    }, [fetchEmployees])
    
    useEffect(() => {
        fetchEmployees()
    }, [])
    
    return {
        employees,
        setEmployees,
        fetchEmployees,
        fetchEmployeeById,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        isLoading,
        refetch,
        error,
    }
}

export { useFetchEmployees }