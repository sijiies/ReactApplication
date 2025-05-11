import { useState } from "react";
import { TailSpin,DNA } from 'react-loader-spinner';
import { httpGet, httpPost, httpPut } from "../HttpService/HttpPost";
import { parse } from 'date-fns';

function Drive(){
    const [vaccinationname, setVaccinationname] = useState("");
    const [driveid, setdriveid] = useState("");
    const [vaccinationdate, setVaccinationdate] = useState("");
    const [drives, setDrives] = useState<{ drive_id: string; drive_date: string;drive_name:string,doses:string, vaccination_name:string }[]>([]);
    const [Doses, setDoses] = useState("");
    const [Dirvename, setDrivename] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setsuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState("");
    const navItems = [
        { name: "Create Drive", path: "CreateDrive" },
        { name: "Modify Drive", path: "ModifyDrive" },
       

      ];
       const handleLoadVaccination=async()=>{
                setLoading(true);
                const response=await httpGet({endpoint:'/api/Dashboard/ListDrives',jsonData:{}});
                const data = response;
                if(data.data.status=="SUCCESS"){
                  setDrives(data.data.listDrives);
                }
                else{
      
                }
                setLoading(false);
        };
      const handleNavClick = (section: string) => {
        
        setActiveSection(section); // Set active section
        if(section=="ModifyDrive"){
            handleLoadVaccination();
        }
      };
      const handleSubmit = async ()=>{
        if(!vaccinationname){
            setErrorMessage("Vaccination name cannot be empty!");
            return;
        }
        if(!vaccinationdate){
            setErrorMessage("Vaccination date cannot be empty!");
            return;
        }
        if(!Doses){
            setErrorMessage("Doses date cannot be empty!");
            return;
        }
        if(!Dirvename){
            setErrorMessage("Drive Name cannot be empty!");
            return;
        }
        setLoading(true);
        const response=await httpPost({endpoint:'/api/Dashboard/AddDrive',jsonData:{vaccinationName:vaccinationname,vaccinationDate:vaccinationdate,doses:Doses,driveName:Dirvename}});
        const data = response;
        if(data.data.status=="SUCCESS"){
            setLoading(false); setErrorMessage('');
            setsuccessMessage(data.data.message);
            setVaccinationname('');
            setVaccinationdate('');
            setDoses('');
            setDrivename('');
            

        }
        else{
            setsuccessMessage('');
            setErrorMessage(data.data.message);
            setLoading(false);
            return;
        }
      };
      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedDriveId = e.target.value;
                    const selectedDrive = drives.find(drive => drive.drive_id ===selectedDriveId );
                    if (selectedDrive) {
                      const selectedDate = parse(selectedDrive.drive_date, 'dd-MM-yyyy HH:mm:ss', new Date());
                      const formattedDate = selectedDate.toISOString().split('T')[0];
                        setdriveid(selectedDrive.drive_id)
                        // Update state with selected drive details
                        setVaccinationname(selectedDrive.vaccination_name || '');
                        setVaccinationdate(formattedDate || '');
                        setDrivename(selectedDrive.drive_name || '');
                        setDoses(selectedDrive.doses || '');
                    }
              };
              const handleUpdate=async()=>{
                if(!vaccinationname){
                    setErrorMessage("Vaccination name cannot be empty!");
                    return;
                }
                if(!vaccinationdate){
                    setErrorMessage("Vaccination date cannot be empty!");
                    return;
                }
                if(!Doses){
                    setErrorMessage("Doses date cannot be empty!");
                    return;
                }
                if(!Dirvename){
                    setErrorMessage("Drive Name cannot be empty!");
                    return;
                }
                setLoading(true);
                const response=await httpPut({endpoint:'/api/Dashboard/UpdateDrive',
                    jsonData:{drive_id:driveid,drive_name:Dirvename,drive_date:vaccinationdate,doses:Doses,v_name:vaccinationname}});
                const data=response;
                if(data.data.status=="SUCCESS"){
                    setsuccessMessage(data.data.message);
                    setErrorMessage('');
                    setVaccinationname('');
                    setVaccinationdate('');
                    setDoses('');
                    setDrivename('');
                    setdriveid('');
                    setDrives([]);
                    handleLoadVaccination();
                }
                else{
                    setsuccessMessage('');
                    setErrorMessage(data.data.message);
                }
                setLoading(false);
              };
return(
    <>
    <div>
        
    {loading && (
                    <div className="overlay">
                      <TailSpin
                        height={150}
                        width={150}
                        color="white"
                        strokeWidth={3}
                     
                      />
                      </div>
                    )}
          
          <aside className="aside bg-light shadow border border-2 p-3" style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0 }}>
  <h2>Manage Vaccination Drive</h2>
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
          
          <div className="content d-flex justify-content-center">
          {activeSection === "CreateDrive" && (
            <div className="card w-75">
                {errorMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-danger">{errorMessage}</div>
                    )}
                {successMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-success">{successMessage}</div>
                    )}
                <h5 className="text-black-50">Create Vaccination Drive</h5>
                <div className="d-flex p-2">
                    <label htmlFor="vaccinationname" className="w-75 mt-2">Vaccination Name :</label><input
                    type="text" name="vaccinationname" id="vaccinationname"
                    value={vaccinationname} 
                    onChange={(e)=>setVaccinationname(e.target.value)} 
                    className="form-control w-100"  />
                </div>
                <div className="d-flex p-2">
                    <label htmlFor="drive_date" className="w-75 mt-2">Date of Drive :</label>
                    <input type="date" name="drive_date" id="drive_date" 
                    className="form-control w-100" 
                    value={vaccinationdate} 
                    onChange={(e)=>setVaccinationdate(e.target.value)} 
                    />
                </div>
                <div className="d-flex p-2">
                    <label htmlFor="drive_date" className="w-75 mt-2">Drive Name :</label>
                    <input type="text" name="drive_date" id="drive_date" 
                    className="form-control w-100" 
                    value={Dirvename} 
                    onChange={(e)=>setDrivename(e.target.value)} 
                    />
                </div>
                <div className="d-flex p-2">
                    <label htmlFor="available_doses" className="w-75 mt-2">Number of Available Doses:</label>
                    <input type="number" name="available_doses" id="available_doses"
                     className="form-control w-100" 
                     value={Doses} 
                     onChange={(e)=>setDoses(e.target.value)} />
                </div>
                <div className="justify-content-center">
                <input type="button" value="Submit" className="btn btn-primary w-50" onClick={handleSubmit}/>
                </div>
               
            </div>
          )}
          {activeSection === "ModifyDrive" && (
            <div>
                <label htmlFor="option" className="h5 text-black-50">Select Vaccination</label>
                  {drives.length>0 ?(
                    
                    <select name="option" className="form-select" id="" value={selectedOption} onChange={handleChange} >
                      <option value="" key="-1"  >-----------Select Vaccination-----------</option>
                      {drives.map((drive, index) => (
                        <option value={drive.drive_id} key={index}>{drive.drive_name+' '+drive.drive_date}</option>
                      ))}
                    </select>
                  ):(
                    
                      <p>No drives available.</p>
                  )}
                  <div className="card mt-3">
                    
                  <h5 className="text-black-50">Update Vaccination Drive</h5>
                  {errorMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-danger">{errorMessage}</div>
                    )}
                {successMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-success">{successMessage}</div>
                    )}
                <div className="d-flex p-2">
                    <label htmlFor="vaccinationname" className="w-75 mt-2">Vaccination Name :</label><input
                    type="text" name="vaccinationname" id="vaccinationname"
                    value={vaccinationname} 
                    onChange={(e)=>setVaccinationname(e.target.value)} 
                    className="form-control w-100"  />
                </div>
                <div className="d-flex p-2">
                    <label htmlFor="drive_date" className="w-75 mt-2">Date of Drive :</label>
                    <input type="date" name="drive_date" id="drive_date" 
                    className="form-control w-100" 
                    value={vaccinationdate} 
                    onChange={(e)=>setVaccinationdate(e.target.value)} 
                    />
                </div>
                <div className="d-flex p-2">
                    <label htmlFor="drive_date" className="w-75 mt-2">Drive Name :</label>
                    <input type="text" name="drive_date" id="drive_date" 
                    className="form-control w-100" 
                    value={Dirvename} 
                    onChange={(e)=>setDrivename(e.target.value)} 
                    />
                </div>
                <div className="d-flex p-2">
                    <label htmlFor="available_doses" className="w-75 mt-2">Number of Available Doses:</label>
                    <input type="number" name="available_doses" id="available_doses"
                     className="form-control w-100" 
                     value={Doses} 
                     onChange={(e)=>setDoses(e.target.value)} />
                </div>
                
                <div className="justify-content-center">
                <input type="button" value="Update" className="btn btn-primary w-50" onClick={handleUpdate}/>
                </div>
                  </div>
            </div>
            
          )}
        </div>
    </div>
    </>
)
}
export default Drive;