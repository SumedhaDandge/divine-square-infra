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
    INQUIRIES: "/inquiries",
    USERS: "/users",
    QUOTATIONS: "/quotations",
    UPLOAD: "/upload/s3",
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

  createAmenity(data: any): Promise<any> {
    return api._post(this._urlMapping.AMMENITIES, data);
  }

  updateAmenity(id: string, data: any): Promise<any> {
    return api._put(`${this._urlMapping.AMMENITIES}/${id}`, data);
  }

  createNearbyDevelopment(data: any): Promise<any> {
    return api._post(this._urlMapping.NEARBY_DEVELOPMENTS, data);
  }

  updateNearbyDevelopment(id: string, data: any): Promise<any> {
    return api._put(`${this._urlMapping.NEARBY_DEVELOPMENTS}/${id}`, data);
  }

  createLeadSource(data: any): Promise<any> {
    return api._post(this._urlMapping.LEAD_SOURCES, data);
  }

  updateLeadSource(id: string, data: any): Promise<any> {
    return api._put(`${this._urlMapping.LEAD_SOURCES}/${id}`, data);
  }

  listLeads(): Promise<any> {
    return api._get(this._urlMapping.LEADS);
  }

  createLead(data: any): Promise<any> {
    return api._post(this._urlMapping.LEADS, data);
  }

  bulkCreateLeads(data: any): Promise<any> {
      return api._post(`${this._urlMapping.LEADS}/bulk`, data);
  }

  uploadLeadExcel(data: FormData): Promise<any> {
      return api._postFormData(`${this._urlMapping.LEADS}/import`, data);
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

  listAllTasks(query?: any): Promise<any> {
      let url = this._urlMapping.LEAD_TASKS;
      if (query) {
        const params = new URLSearchParams(query);
        url += `?${params.toString()}`;
      }
      return api._get(url);
  }

  listLeadTasksById(leadId: string): Promise<any> {
    return api._get(`${this._urlMapping.LEAD_TASKS}/${leadId}`);
  }

  createLeadTask(data: any): Promise<any> {
    return api._post(`${this._urlMapping.LEAD_TASKS}`,data);
  }

  updateLeadTask(taskId: string, data: any): Promise<any> {
      return api._put(`${this._urlMapping.LEAD_TASKS}/${taskId}`, data);
  }

  // Inquiries
  listInquiries(): Promise<any> {
    return api._get(this._urlMapping.INQUIRIES);
  }

  createInquiry(data: any): Promise<any> {
    return api._post(this._urlMapping.INQUIRIES, data);
  }

  updateInquiry(id: string, data: any): Promise<any> {
    return api._patch(`${this._urlMapping.INQUIRIES}/${id}`, data);
  }

  deleteInquiry(id: string): Promise<any> {
    return api._delete(`${this._urlMapping.INQUIRIES}/${id}`);
  }

  // Users
  listUsers(): Promise<any> {
    return api._get(this._urlMapping.USERS);
  }

  createUser(data: any): Promise<any> {
    return api._post(this._urlMapping.USERS, data);
  }

  // Quotations
  createQuotation(data: any): Promise<any> {
      return api._post(this._urlMapping.QUOTATIONS, data);
  }

  listQuotations(leadId?: string): Promise<any> {
      const url = leadId 
        ? `${this._urlMapping.QUOTATIONS}/${leadId}` 
        : this._urlMapping.QUOTATIONS;
      return api._get(url);
  }

  // Task Actions
  cancelTask(taskId: string): Promise<any> {
      return api._patch(`${this._urlMapping.LEAD_TASKS}/cancel/${taskId}`, {});
  }

  uploadMedia(data: FormData): Promise<any> {
      return api._postFormData(this._urlMapping.UPLOAD, data);
  }
}

const divineSquareApi = new DivineSquareApi();
export { divineSquareApi };
