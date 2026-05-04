import api from "./AxiosApi";

//get all jobs
export const getAllJob = async () => {
    try{
        
        const res = await api.get("/job/all");
        return res.data;
    } catch(e){
           throw e;
        console.log("Unable to get all Jobs"+e);
    }
};

    export const createJob=async (data)=>{
try{
    const res=await api.post("/job/create",data);
    return res.data;
} catch(e){
       throw e;
    console.log("Unable to CreateJob"+e);
}

    };

    export const updateJob=async (id,data)=>{

        try{
            const res=await api.put(`/job/update/${id}`,data);
            return res.data;
        }
        catch(e){
            throw e;
        }
    };

    export const DeleteJob=async(id)=>{

        try{
            const res=await api.delete(`/job/delete/${id}`);
            return res.data;
        }catch(e){
            throw e;
        }
    }