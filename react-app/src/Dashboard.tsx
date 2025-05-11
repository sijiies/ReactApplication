
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { httpGet } from "./HttpService/HttpPost";
import { format } from "date-fns";
import { parse } from 'date-fns';   


type Metrics = {
  totalStudents: string;
  vaccinatedStudents: string;
  vaccinatedPercentage: string;
  upcomingDrives: { date: string; location: string }[];
};

function Dashboard() {
    const [data, setData] = useState<Metrics | null>(null);
    const navigate = useNavigate();
    const logindata = sessionStorage.getItem("logindata")??'';
   
    
    useEffect(() => {
        if (!logindata || logindata==="") {
            navigate("/");
            
        }
        else{
          const fetchData = async () => {
            if (!logindata || logindata === "") {
              navigate("/");
            } else {
              try {
                const data = await httpGet({ endpoint: "/api/Dashboard/GetDashboard" });
                setData(data.data);
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            }
          };
      
          fetchData();
        
        }
    }, [logindata, navigate]);

    const navItems = [
        { name: "Manage Students", path: "/ManageStudent/Student" },
        { name: "Vaccination Drives", path: "/Vaccination/VaccinationDrives" },
        { name: "Reports", path: "/Report/Reports" },
      ];
    
      
        const handleNavClick = (path: string) => {
          navigate(path);
        };
    return (
        
        <div className="dashboard">
            
  <aside className="aside bg-light shadow border border-2 p-3" style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0 }}>
  <h2>Vaccination Dashboard</h2>
  <ul className="nav flex-column">
    {navItems.map((item, index) => (
      <li key={index} className="nav-item active m-2">
        <a
          className="text-decoration-none"
          onClick={() => handleNavClick(item.path)}
          href="#"
        >
          {item.name}
        </a>
      </li>
    ))}
  </ul>
</aside>

      
      {data ? (
        <>
        <main>
       
        <div className="d-flex justify-content-center">
        <div className="card w-50 rounded-4 shadow-lg ">
            <h4 className="text-danger opacity-75">Upcoming Vaccination Drives (Next 30 Days)</h4>
            <div className="d-flext justify-content-center">
            {data.upcomingDrives.length > 0 ? (
              <ul className="list-group">
                {data.upcomingDrives.map((drive, index) => (
                  
                  <li className="list-group-item" key={index}>
                     {drive.date ? (
                      <strong style={{ color: "blueviolet" }}>
                        {drive.date}
                      </strong>
                    ) : (
                      <span style={{ color: "red" }}>Invalid Date</span>
                    )}
                    <span style={{ fontStyle: "italic", color: "red" }}>
                      - Location: {drive.location}
                    </span>

                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming drives scheduled.</p>
            )}
            </div>
         
          </div>
        </div>
        <div className="container d-flex m-2 p-2 justify-content-center">
       
       <p className="m-2">Total Students: <strong className="text-danger">{data.totalStudents}</strong></p>
       <p className="m-2">Vaccinated Students: <strong className="text-danger">{data.vaccinatedStudents}</strong></p>
       <p className="m-2">Vaccinated Percentage: <strong className="text-danger">{data.vaccinatedPercentage}%</strong></p>
     </div>
        </main>
          

        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
    );
}

export default Dashboard;
