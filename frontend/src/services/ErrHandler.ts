
import { AxiosResponse } from "axios";
import { toast } from "sonner";

export const handleErrResult = (err: AxiosResponse) => {
  if (err.status === 401) {
    toast.error("Unauthorized to perform action!");
  } else if (err.status === 403) {
    window.location.replace("/login");
  }
};
