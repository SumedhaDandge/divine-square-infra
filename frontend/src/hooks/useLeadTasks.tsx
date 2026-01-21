import { useDataContext } from "@/contex/DataContext";
import { divineSquareService } from "@/services/DivineInfraService";
import { useState } from "react";


  const useLeadTasks = () => {
 const {setTaskByID} =  useDataContext()
 const [tasksLoading, setTaskLoading] = useState(false)
  const getTaskByID = async (id:any) =>{
    setTaskLoading(true)
    try {
      const response = await divineSquareService.listLeadTasksById(id)
    if (response.status === 200){
      setTaskByID(response.data)
    }
    } catch (error) {
      console.log("",error)
    } finally{
      setTaskLoading(false)
    }
  }
  return {
getTaskByID ,tasksLoading
  }
};



export default useLeadTasks;