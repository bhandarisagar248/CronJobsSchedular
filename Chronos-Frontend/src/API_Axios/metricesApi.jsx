import api from "./AxiosApi";

//get all jobs
export const LoadMetrices = async () => {
    try{
        
        const res = await api.get("/job/dashboard/metrics");
        return res.data;
    } catch(e){
           throw e;
        console.log("Unable to get all Metrices"+e);
    }
};
