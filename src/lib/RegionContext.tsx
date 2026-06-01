"use client";

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type RegionContextType = {
    regionName: string;
    displayName: string;
    niche: 'car' | 'truck' | 'coating';
    path: string;
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children, regionName, displayName, niche = 'car', path = '' }: { children: ReactNode, regionName: string, displayName?: string, niche?: 'car' | 'truck' | 'coating', path?: string }) {
    const finalDisplayName = displayName || regionName;
    return (
        <RegionContext.Provider value={{ regionName, displayName: finalDisplayName, niche, path }}>
            {children}
        </RegionContext.Provider>
    );
}

export function useRegion() {
    const context = useContext(RegionContext);
    if (context === undefined) {
        // Fallback for Astro islands that might be rendered without a parent provider
        return {
            regionName: '大阪',
            displayName: '大阪',
            niche: 'car' as const,
            path: '/'
        };
    }
    return context;
}
