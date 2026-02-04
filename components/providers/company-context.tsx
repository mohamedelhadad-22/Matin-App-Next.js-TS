"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type CompanyStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MISSING_DOCS'

interface CompanyContextType {
    status: CompanyStatus
    setStatus: (status: CompanyStatus) => void
    isRestricted: boolean // if true then restricted
    isLoading: boolean
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<CompanyStatus>('PENDING')
    const [isLoading, setIsLoading] = useState(false)

    const isRestricted = status !== 'VERIFIED'

    return (
        <CompanyContext.Provider value={{ status, setStatus, isRestricted, isLoading }}>
            {children}
        </CompanyContext.Provider>
    )
}

export function useCompany() {
    const context = useContext(CompanyContext)
    if (!context) {
        throw new Error("useCompany must be used within a CompanyProvider")
    }
    return context
}