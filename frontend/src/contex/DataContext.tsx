import { createContext, useContext, useState } from "react";


const AppDataContext = createContext<any>(null);

export const useDataContext = () => useContext(AppDataContext);


export const AppDataProvider = ({ children }: any) => {
        const [projects, setProjects] = useState<any[]>([]);
        const [ammenities, setAmmeneities] = useState<any[]>([]);
        const [nearbyDevelopments, setNearbyDevelopments] = useState<any[]>([]);
        const [leadSources, setLeadSources] = useState<any[]>([]);
        const [leads, setLeads] = useState<any[]>([]);

        return (
        <AppDataContext.Provider value={{
            projects, setProjects,
            ammenities, setAmmeneities,
            nearbyDevelopments, setNearbyDevelopments ,
            leadSources, setLeadSources,
            leads, setLeads
        }}>
            {children}
        </AppDataContext.Provider>
    );
};