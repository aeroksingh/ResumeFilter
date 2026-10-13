import { createContext, useState, useMemo } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const value = useMemo(() => ({
        user, setUser, loading, setLoading, error, setError
    }), [user, loading, error])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
