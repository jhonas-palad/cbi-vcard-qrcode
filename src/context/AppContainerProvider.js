import React, {createContext, useRef} from 'react';

const AppContainerContext = createContext(null);

export const AppContainerProvider = ({children}) => {

    const containerRef = useRef(null);

    return (
        <AppContainerContext.Provider value={containerRef}>
            {children}
        </AppContainerContext.Provider>
    )
}

export default AppContainerContext