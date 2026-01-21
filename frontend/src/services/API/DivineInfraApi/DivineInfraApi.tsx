import { api } from "../Api";

class DivineSquareApi {
  _urlMapping = {
    LOGIN: "/auth/login",

    PROJECT: "/projects",

    AMMENITIES: "/masters/amenity",
    NEARBY_DEVELOPMENTS: "/masters/nearby-development",
    LEAD_SOURCES: "/masters/lead-source",
    LEADS: "/leads",
    LEAD_TASKS: "/lead-tasks",
  };

  Login(data: any): Promise<any> {
    return api._post(this._urlMapping.LOGIN, data);
  }

  // Project related APIs can be added here
  listProjects(): Promise<any> {
    return api._get(this._urlMapping.PROJECT);
  }

  createProject(data: any): Promise<any> {
    return api._post(this._urlMapping.PROJECT, data);
  }

  getProject(projectId: string): Promise<any> {
    return api._get(`${this._urlMapping.PROJECT}/${projectId}`);
  }

  updateProject(projectId: string, data: any): Promise<any> {
    return api._put(`${this._urlMapping.PROJECT}/${projectId}`, data);
  }

  // Master Apis
  listAmmeneities(): Promise<any> {
    return api._get(this._urlMapping.AMMENITIES);
  }

  listNearByDevelopments(): Promise<any> {
    return api._get(this._urlMapping.NEARBY_DEVELOPMENTS);
  }

  listLeadSources(): Promise<any> {
    return api._get(this._urlMapping.LEAD_SOURCES);
  }

  listLeads(): Promise<any> {
    return api._get(this._urlMapping.LEADS);
  }

  createLead(data: any): Promise<any> {
    return api._post(this._urlMapping.LEADS, data);
  }

  getLead(leadId: string): Promise<any> {
    return api._get(`${this._urlMapping.LEADS}/${leadId}`);
  }

  updateLead(leadId: string, data: any): Promise<any> {
    return api._put(`${this._urlMapping.LEADS}/${leadId}`, data);
  }

  listLeadTasks(leadId: string): Promise<any> {
    return api._get(`${this._urlMapping.LEAD_TASKS}/${leadId}`);
  }

  listLeadTasksById(leadId: string): Promise<any> {
    return api._get(`${this._urlMapping.LEAD_TASKS}/${leadId}`);
  }

  createLeadTask(data: any): Promise<any> {
    return api._get(`${this._urlMapping.LEAD_TASKS}`);
  }
}

const divineSquareApi = new DivineSquareApi();
export { divineSquareApi };
