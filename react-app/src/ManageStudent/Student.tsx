import React, { useEffect, useState } from "react";
import Papa from 'papaparse';
import { useNavigate } from "react-router-dom";
import { httpPost } from "../HttpService/HttpPost";
import { Oval } from 'react-loader-spinner';
import { FaCirclePlus  } from "react-icons/fa6";
import Select from "react-select";
import DataTable from "react-data-table-component";



function AddStudent(){
  type ReportRow = {
    name: string;
    studentid: string;
    sclass: string;
    dob: string;
 
};
    const [searchText, setSearchText] = useState("");
     const [listReport,setlistReport]=useState<ReportRow[]>([]);
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();
     const logindata = sessionStorage.getItem("logindata")??'';
     const [activeSection, setActiveSection] = useState<string>("");
     const [errorMessage, setErrorMessage] = useState("");
     const [studId,setStudID]=useState("");
     const [studName,setStudName]=useState("");
     const [studDate,setStudDate]=useState("");
     const [studentClass,setStudentClass]=useState("");
     const [successMessage, setsuccessMessage] = useState("");
     const [ListStudent, setListStudent] = useState<{ studentid: string; name: string;sclass:string,dob:string }[]>([])
     const [, setStudents] = useState<{ name: string; studentid: string ; sclass:string}[]>([]);
     const [drives, setDrives] = useState<{ drive_id: string; vaccination_date: string;vaccination_name:string }[]>([]);
     const [viewStudents, setViewStudent] = useState<{ status: string; student_id: string;student_name:string }[]>([]);
     const navItems = [
        { name: "Add Students", path: "AddStudent" },
        { name: "Bulk Student Add", path: "BulkAddStudent" },
        { name: "Edit Student", path: "EditStudent" },
        { name: "View Student", path: "ViewStudent" },
        { name: "Mark Vaccination", path: "MarkVaccination" },

      ];
      const [selectedOption, setSelectedOption] = useState("");
      const initialFormState = {
        name: "",
        dob: "",
        studentid: "",
        sclass:"",
    };
      const [formData, setFormData] = useState({
        name: "",
        dob: "",
        studentid: "",
        sclass:"",
      });
      const [errors, setErrors] = useState<{ name?: string; dob?: string; studentid?: string ; class?:string}>({});
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
      const validateForm = () => {
        let validationErrors: { name?: string; dob?: string; studentid?: string } = {};
    
        if (!formData.name) validationErrors.name = "Student name is required.";
        if (!formData.dob) validationErrors.dob = "Date of birth is required.";
        if (!formData.studentid) validationErrors.studentid = "Student ID is required.";
    
        setErrors(validationErrors);
    
        return Object.keys(validationErrors).length === 0;
      };
     
      const viewStudent=async()=>{
       setLoading(true);
        const response=await httpPost({endpoint:'/api/Dashboard/ViewStudent',jsonData:{}});
        const data = response;
          if (data.status === "SUCCESS" && data.data && data.data.studentList) {
            setStudents(data.data.studentList);
            setlistReport(data.data.studentList);
            setLoading(false);
          } else {
            alert("Something went wrong.!");
          }
        console.log("viewstudent");
      };
      const handleSubmit = async () => {
        if (validateForm()) {
          try {
            
            const response=await httpPost({endpoint:'/api/Dashboard/AddStudent',jsonData:{name:formData.name,dob:formData.dob,studentid:formData.studentid,sclass:formData.sclass}});
            const data = response;
         
            if(data.status=="SUCCESS"){
                alert("Student added successfully!");
                setFormData(initialFormState);
                setErrors({});
            }
            else{
                alert("Something went wrong.!");
            }

           
          } catch (error) {
            console.error("Error:", error);
          }
        }
      };
      const handleEditStudnetLoad=async()=>{
        setLoading(true);
        const response=await httpPost({endpoint:'/api/Dashboard/ViewStudent',jsonData:{}});
        const data = response;
          if (data.status === "SUCCESS" && data.data && data.data.studentList) {
            setListStudent(data.data.studentList);
      
            setLoading(false);
          } else {
            alert("Something went wrong.!");
          }
        console.log("viewstudent");
      };
      const handleNavClick = (section: string) => {
        setCsvData([]);
        setStudents([]);
        setActiveSection(section);
        if(section=="MarkVaccination"){
          handleLoadVaccination();
        }
        if(section=="EditStudent"){
          handleEditStudnetLoad();
        }
        if(section=="ViewStudent"){
          viewStudent();
        }
      };
        useEffect(() => {
            if (!logindata || logindata==="") {
                navigate("/");
                
            }
            
             
        }, [logindata, navigate]);
        const [csvData, setCsvData] = useState<string[][]>([]);

        const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            Papa.parse(file, {
              complete: (result) => {
                setCsvData(result.data as string[][]);
              },
              skipEmptyLines: true
            });
          }
        };
        const handleUpload = async () => {
          setLoading(true);
          for (let i = 1; i < csvData.length; i++) {
            const [studentid,name,dob,sclass] = csvData[i]; // Extract values
            await httpPost({endpoint:'/api/Dashboard/AddStudent',jsonData:{name:name,dob:dob,studentid:studentid,sclass:sclass}});
          }
          setLoading(false);
        };
        const handleLoadVaccination=async()=>{
          setLoading(true);
          const response=await httpPost({endpoint:'/api/Dashboard/UpcomingDrive',jsonData:{}});
          const data = response;
          if(data.data.status=="SUCCESS"){
            setDrives(data.data.drives);
          }
          else{

          }
          setLoading(false);
        };
        const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
          setLoading(true);
          const selectedValue = event.target.value;
          setSelectedOption(selectedValue);
          const response=await httpPost({endpoint:'/api/Dashboard/ViewStudentVaccination',jsonData:{drive_id:selectedValue}});
          const data = response;
          if(data.data.status=="SUCCESS"){
            setViewStudent(data.data.viewStudents);
          }
          else{

          }
          setLoading(false);
        };
        const handleVaccinationClick = async (studentId: string) => {
         
          setLoading(true);
          const response=await httpPost({endpoint:'/api/Dashboard/MarkVaccination',jsonData:{drive_id:selectedOption,student_id:studentId}})
          const data=response;
          if(data.data.status=="SUCCESS"){
              const response=await httpPost({endpoint:'/api/Dashboard/ViewStudentVaccination',jsonData:{drive_id:selectedOption}});
              const data = response;
              if(data.data.status=="SUCCESS"){
                setErrorMessage('');
                setViewStudent(data.data.viewStudents);
              }
          }
          else{
            setErrorMessage(data.data.message);
          }
          setLoading(false);
        };
        const options = ListStudent.map((list) => ({
          value: list.studentid,
          label: `${list.name} - Class: ${list.sclass}`,
        }));
        const handleChangeEditStudent= (e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedStudId = e.value;
          const selectedStudent = ListStudent.find(stud => stud.studentid ===selectedStudId );
          if (selectedStudent) {
              let formattedDate = new Date(selectedStudent.dob).toISOString().split("T")[0];
              setStudID(selectedStudent.studentid)
              setStudName(selectedStudent.name || '');
              setStudDate(formattedDate || '');
              setStudentClass(selectedStudent.sclass || '');
           
          }

        };
        const handleUpdate=async()=>{
          if(!studName){
              setErrorMessage("Student name cannot be empty!");
              return;
          }
          if(!studDate){
              setErrorMessage("Student date cannot be empty!");
              return;
          }
          if(!studentClass){
              setErrorMessage("student class cannot be empty!");
              return;
          }
          
          setLoading(true);
          const response=await httpPost({endpoint:'/api/Dashboard/EditStudent',
              jsonData:{student_id:studId,student_name:studName,student_class:studentClass,studnet_dob:studDate}});
          const data=response;
          if(data.data.status=="SUCCESS"){
              setsuccessMessage(data.data.message);
              setErrorMessage('');
              setStudName('');
              setStudDate('');
              setStudentClass('');
              handleEditStudnetLoad();
          }
          else{
              setsuccessMessage('');
              setErrorMessage(data.data.message);
          }
          setLoading(false);
        };
        const filteredReports = listReport.filter(
          (report) =>
              report.name.toLowerCase().includes(searchText.toLowerCase()) ||
              report.dob.toLowerCase().includes(searchText.toLowerCase()) ||
              report.sclass.toLowerCase().includes(searchText.toLowerCase()) ||
              report.studentid.toLowerCase().includes(searchText.toLowerCase()) 
              
      );
      const columns = [
          {
              name: "Student ID",
              selector: (row: ReportRow) => row.studentid,
              sortable: true,
          },
          {
              name: "Student Name",
              selector: (row: ReportRow) => row.name,
              sortable: true,
          },
          {
              name: "Student Class",
              selector: (row: ReportRow) => row.sclass,
              sortable: true,
          },
          {
              name: "Student DOB",
              selector: (row: ReportRow) => row.dob,
              sortable: true,
          },
          
      ];
    return(
        <div>
          
          {loading && (
            <div className="overlay">
              <Oval
                height={50}
                width={50}
                color="blue"
                secondaryColor="lightblue"
                ariaLabel="loading-indicator"
              />
              </div>
            )}
          
             
          <aside className="aside bg-light shadow border border-2 p-3" style={{ width: "250px", height: "100vh", position: "fixed", left: 0, top: 0 }}>
            <h2>Manage Student</h2>
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
                {activeSection === "AddStudent" && (
                <div className="add-student card shadow-lg rounded-4 w-75">👩‍🎓 Add Student Form
                <div className="flex-column">
                     {errors.name && <span className="text-danger">{errors.name}</span>}
                     {errors.dob && <span className="text-danger">{errors.dob}</span>}
                     {errors.studentid && <span className="text-danger">{errors.studentid}</span>}
                     {errors.class && <span className="text-danger">{errors.class}</span>}
                </div>
                <div className="d-flex justify-content-center">
                <div className="w-75 m-2">
                    <div className="d-flex">
                        <label className="w-50 mt-3">Student Name</label>
                        <input type="text" name="name" placeholder="Student Name" className="form-control m-2" value={formData.name} onChange={handleInputChange} />
                       
                    </div>

                    <div className="d-flex">
                        <label className="w-50 mt-3">Date Of Birth</label>
                        <input type="date" name="dob" placeholder="DOB" className="form-control m-2" value={formData.dob} onChange={handleInputChange} />
                       
                    </div>

                    <div className="d-flex">
                        <label className="w-50 mt-3">Student ID</label>
                        <input type="text" name="studentid" placeholder="Student ID" className="form-control m-2" value={formData.studentid} onChange={handleInputChange} />
                        
                    </div>

                    <div className="d-flex">
                        <label className="w-50 mt-3">Student class</label>
                        <input type="text" name="sclass" placeholder="Student Class" className="form-control m-2" value={formData.sclass} onChange={handleInputChange} />
                        
                    </div>

                    <div className="d-flex justify-content-center">
                        <input type="button" className="btn m-2" value="Cancel" />
                        <input type="button" className="btn btn-danger m-2" value="Add" onClick={handleSubmit} />
                    </div>
                    </div>
                </div>
                </div>
                )}
                {activeSection === "BulkAddStudent" && (
                <div className="bulk-add card shadow-lg rounded-4 w-75 m-3"><p className="p-2">📑 Bulk Add Students Section</p>
                 <div className="d-flex ">
                  <label htmlFor="xlFile" className="w-50 mt-2" > Upload CSV File :</label> <input type="file" name="xlFile" accept=".csv" className="form-control" onChange={handleFileUpload} id="xlFile"/>
                 </div>
                 <table className="table mt-3">
                  <thead>
                    <tr>
                      {csvData[0] && csvData[0].map((header, index) => <th key={index}>{header}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <input type="button" value="Upload" className="btn btn-primary" onClick={handleUpload}/>
                </div>
                )}
                {activeSection === "EditStudent" && (
                  <div>
                  <label htmlFor="option" className="h5 text-white-50">Select Student</label>
                  {ListStudent.length > 0 ? (
                    <Select
                      options={options}
                      value={options.find((option) => option.value === selectedOption)}
                      onChange={handleChangeEditStudent}
                      // onChange={(selectedOption) => handleChange({ target: { value: selectedOption.value } })}
                      placeholder="-----------Select Student-----------"
                      isSearchable
                    />
                  ) : (
                    <p>No drives available.</p>
                  )}
                  <div className="card rounded-3 shadow-lg mt-2">
                  {errorMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-danger">{errorMessage}</div>
                    )}
                  {successMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-success">{successMessage}</div>
                    )}
                  <div className="d-flex p-2">
                      <label htmlFor="" className="w-75 mt-2">Student Name :</label><input
                      type="text" name="" id=""
                      value={studName} 
                      onChange={(e)=>setStudName(e.target.value)} 
                      className="form-control w-100"  />
                  </div>
                  <div className="d-flex p-2">
                      <label htmlFor="" className="w-75 mt-2">Student DOB :</label><input
                      type="text" name="" id=""
                      value={studDate} 
                      onChange={(e)=>setStudDate(e.target.value)} 
                      className="form-control w-100"  />
                  </div>
                  <div className="d-flex p-2">
                      <label htmlFor="" className="w-75 mt-2">Student Class :</label><input
                      type="text" name="" id=""
                      value={studentClass} 
                      onChange={(e)=>setStudentClass(e.target.value)} 
                      className="form-control w-100"  />
                  </div>
                  <div className="justify-content-center">
                <input type="button" value="Update" className="btn btn-primary w-50" onClick={handleUpdate}/>
                </div>
                  </div>
                  
                </div>
                )}
                {activeSection === "ViewStudent" && (
                <div className="view-student card shadow-lg rounded-4 w-75" >
                 <div>
                 <DataTable 
                title="Student List"
                columns={columns}
                data={filteredReports}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, filteredReports.length]} 
            
                highlightOnHover
                striped
                subHeader
                subHeaderComponent={
                    
                  <div className="d-flex ">
                  
                  <input
                      type="text"
                      placeholder="Search"
                      className="form-control w-75"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                  />
                  </div>
                    
                }
                
                />
                    {/* {students.length > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Student Class</th>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                               <td>{student.sclass}</td>
                               <td>{student.studentid}</td>
                               <td>{student.name}</td>
                         
                           
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    ) : (
                    <p>No students available.</p>
                    )} */}
                 </div>
                </div>
                )}
               {activeSection === "MarkVaccination" && (
                <div className="mt-4">
                   {errorMessage && (
                        <div className="alert m-2 ml-3 p-2 alert-danger">{errorMessage}</div>
                    )}
                  <label htmlFor="option" className="h5 text-black-50">Select Vaccination</label>
                  {drives.length>0 ?(
                    
                    <select name="option" className="form-select" id="" 
                    value={selectedOption}
                    onChange={handleChange} >
                      <option value="" key="-1" >-----------Select Vaccination-----------</option>
                      {drives.map((drive, index) => (
                        <option value={drive.drive_id} key={index}>{drive.vaccination_name+' '+drive.vaccination_date}</option>
                      ))}
                    </select>
                  ):(
                    
                      <p>No drives available.</p>
                  )}
                  {viewStudents.length > 0 ? (
                    <table className="table table-bordered mt-2">
                        <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student NAME</th>
                            <th>Vaccination Status</th>
                            <th>Vaccin Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {viewStudents.map((student, index) => (
                            <tr key={index}>
                            <td>{student.student_id}</td>
                            <td>{student.student_name}</td>
                            <td>{student.status}</td>
                            <td>
                            <button className="btn btn-link" onClick={() => handleVaccinationClick(student.student_id)}><FaCirclePlus /></button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    ) : (
                    <p>No students available.</p>
                    )}
                </div>
                )}
            </div>
        </div>
        
        
    );
}
export default AddStudent;