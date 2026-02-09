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

  bulkCreateLeads(data: any): Promise<any> {
    return divineSquareApi.bulkCreateLeads(data);
  }

  uploadLeadExcel(data: FormData): Promise<any> {
    return divineSquareApi.uploadLeadExcel(data);
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

  listAllTasks(query?: any): Promise<any> {
      return divineSquareApi.listAllTasks(query);
  }

  updateLeadTask(taskId: string, data: any): Promise<any> {
    return divineSquareApi.updateLeadTask(taskId, data);
  }

  // Inquiries
  listInquiries(): Promise<any> {
    return divineSquareApi.listInquiries();
  }

  createInquiry(data: any): Promise<any> {
    return divineSquareApi.createInquiry(data);
  }

  updateInquiry(id: string, data: any): Promise<any> {
    return divineSquareApi.updateInquiry(id, data);
  }

  deleteInquiry(id: string): Promise<any> {
    return divineSquareApi.deleteInquiry(id);
  }

  // Users
  listUsers(): Promise<any> {
    return divineSquareApi.listUsers();
  }

  createUser(data: any): Promise<any> {
    return divineSquareApi.createUser(data);
  }

  // Quotations
  createQuotation(data: any): Promise<any> {
      return divineSquareApi.createQuotation(data);
  }

  listQuotations(leadId?: string): Promise<any> {
      return divineSquareApi.listQuotations(leadId);
  }

  // Task Actions
  cancelTask(taskId: string): Promise<any> {
      return divineSquareApi.cancelTask(taskId);
  }

  // Upload
  uploadMedia(data: FormData): Promise<any> {
      return divineSquareApi.uploadMedia(data);
  }
}

const divineSquareService = new DivineSquareService();
export { divineSquareService };
