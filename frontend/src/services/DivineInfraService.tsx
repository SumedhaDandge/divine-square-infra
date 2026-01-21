import { divineSquareApi } from "./API/DivineInfraApi/DivineInfraApi";

class DivineSquareService {
  Login(data: any): Promise<any> {
    return divineSquareApi.Login(data);
  }

  // Project related services can be added here
  listProjects(): Promise<any> {
    return divineSquareApi.listProjects();
  }

  createProject(data: any): Promise<any> {
    return divineSquareApi.createProject(data);
  }

  getProject(projectId: string): Promise<any> {
    return divineSquareApi.getProject(projectId);
  }

  updateProject(projectId: string, data: any): Promise<any> {
    return divineSquareApi.updateProject(projectId, data);
  }

  // Master Apis
  listAmmeneities(): Promise<any> {
    return divineSquareApi.listAmmeneities();
  }

  listNearByDevelopments(): Promise<any> {
    return divineSquareApi.listNearByDevelopments();
  }

  listLeadSources(): Promise<any> {
    return divineSquareApi.listLeadSources();
  }

  listLeads(): Promise<any> {
    return divineSquareApi.listLeads();
  }

  createLead(data: any): Promise<any> {
    return divineSquareApi.createLead(data);
  }

  getLead(leadId: string): Promise<any> {
    return divineSquareApi.getLead(leadId);
  }
  updateLead(leadId: string, data: any): Promise<any> {
    return divineSquareApi.updateLead(leadId, data);
  }

  createLeadTask(data:any): Promise<any> {
    return divineSquareApi.createLeadTask( data);
  }

  listLeadTasksById(leadId: string) :Promise<any> {
    return divineSquareApi.listLeadTasksById( leadId);
  }


}

const divineSquareService = new DivineSquareService();
export { divineSquareService };
