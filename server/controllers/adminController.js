
const lead = require("../models/Lead")

const getAdminAnalytics =async (req, res)=>{
    try{
        const leads=await lead.find().populate(
            "createdBy",
            "name email"
        );
        const employeeStats = {};
        leads.forEach((lead)=>{
            const userId=lead.createdBy._id.toString();

            // {
            //     "101": {
            //         employeeName: "Vikas",
            //         employeeEmail: "vikas@gmail.com",

            //         totalLeads: 0,
            //         new: 0,
            //         contacted: 0,
            //         qualified: 0,
            //         closed: 0
            //     }
            //     }

            if(!employeeStats[userId]){
                employeeStats[userId]={
                    employeeName:lead.createdBy.name,
                    employeeEmail:lead.createdBy.email,
                    
                    totalLeads: 0,
                    new:0,
                    contacted: 0,
                    qualified: 0,
                    closed: 0,

                };
            
            }
                employeeStats[userId].totalLeads++
                employeeStats[userId][lead.status]++
        })

        res.status(200).json({
            success:true,
            data: Object.values(employeeStats)

        })

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message,

        })

    }
}

module.exports={
      getAdminAnalytics,
}