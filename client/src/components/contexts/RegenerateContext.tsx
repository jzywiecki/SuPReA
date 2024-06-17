import { useState, createContext, ReactNode, FC, } from 'react';

interface RegenerateContextProps {
    projectRegenerateID: string | null;
    componentRegenerate: string | null;
    regenerate: boolean;
    setProjectRegenerateID: (id: string | null) => void;
    setComponentRegenerate: (id: string | null) => void;
    triggerRegenerate: () => void;
}

const RegenerateContext = createContext<RegenerateContextProps>({
    projectRegenerateID: null,
    componentRegenerate: null,
    regenerate: false,
    setProjectRegenerateID: () => { },
    setComponentRegenerate: () => { },
    triggerRegenerate: () => { },
});

export const RegenerateProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [projectRegenerateID, setProjectRegenerateID] = useState<string | null>(null);
    const [componentRegenerate, setComponentRegenerate] = useState<string | null>(null);
    const [regenerate, setRegenerate] = useState(false);

    const triggerRegenerate = () => {
        setRegenerate((prev) => !prev);
    };

    return (
        <RegenerateContext.Provider
            value={{
                projectRegenerateID,
                setProjectRegenerateID,
                componentRegenerate,
                setComponentRegenerate,
                regenerate,
                triggerRegenerate,
            }}
        >
            {children}
        </RegenerateContext.Provider>
    );
};

export default RegenerateContext;