
import { useState,useEffect  } from "react";
import { TailSpin } from 'react-loader-spinner';
import { httpGet } from "../HttpService/HttpPost";
import DataTable from "react-data-table-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function Reports(){
    type ReportRow = {
        studenT_ID: string;
        studenT_NAME: string;
        status: string;
        drivE_NAME: string;
        vaccinatioN_DATE: string;
        vaccinatioN_NAME: string;
    };
    const [loading, setLoading] = useState(false);
    const [listVaccin,setListVaccin]=useState<{vaccin_name:string}[]>([]);
    const [listVaccinDate,setListVaccinDate]=useState<{vaccin_date:string}[]>([]);
    const [listReport,setlistReport]=useState<ReportRow[]>([]);
    const [searchText, setSearchText] = useState("");
    const exportPDF = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const element = document.getElementById("setlistReport");
    
        if (element) {
            pdf.html(element, {
                callback: (pdf) => {
                    pdf.save("setlist.pdf");
                },
                x: 10, // Adjust X position
                y: 10, // Adjust Y position
                width: 180, // Limit width to fit page
                windowWidth: 1000 // Expand view width
            });
        } else {
            console.error("Element with ID 'setlistReport' not found!");
        }
    };
    const exportToCSV = () => {
        if (!filteredReports || filteredReports.length === 0) {
            console.error("No data available to export!");
            return;
        }
    
        const headers = ["Student Name", "Status", "Drive Name", "Vaccination Name", "Vaccination Date"];
        
        const rows = filteredReports.map(report => [
            report.studenT_NAME,
            report.status,
            report.drivE_NAME,
            report.vaccinatioN_NAME,
            report.vaccinatioN_DATE
        ]);
    
        const csvContent = [
            headers.join(","),  // Header row
            ...rows.map(row => row.map(value => `"${value}"`).join(","))  // Data rows
        ].join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "FilteredReports.csv";
    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    
    
    // const exportExcel = () => {
    //     const ws = XLSX.utils.json_to_sheet(filteredReports);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Reports");
    //     XLSX.writeFile(wb, "reports.xlsx");
    // };
    // Filter rows based on search text
    const filteredReports = listReport.filter(
        (report) =>
            report.studenT_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
            report.status.toLowerCase().includes(searchText.toLowerCase()) ||
            report.drivE_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
            report.vaccinatioN_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
            report.vaccinatioN_DATE.toLowerCase().includes(searchText.toLowerCase())
    );
    const columns = [
        {
            name: "Student ID",
            selector: (row: ReportRow) => row.studenT_ID,
            sortable: true,
        },
        {
            name: "Student Name",
            selector: (row: ReportRow) => row.studenT_NAME,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row: ReportRow) => row.status,
            sortable: true,
        },
        {
            name: "Drive Name",
            selector: (row: ReportRow) => row.drivE_NAME,
            sortable: true,
        },
        {
            name: "Vaccination Name",
            selector: (row: ReportRow) => row.vaccinatioN_NAME,
            sortable: true,
        },
        {
            name: "Vaccination Date",
            selector: (row: ReportRow) => row.vaccinatioN_DATE,
            sortable: true,
        },
    ];

    const LoadFilter= async()=>{
        setLoading(true);
        const response=await httpGet({endpoint:'/api/Dashboard/ReportFilter',jsonData:{}});
        const data=response;
        if(data.data.listVaccins.length>0){
            setListVaccin(data.data.listVaccins);
        }
        if(data.data.listVaccinDates){
            setListVaccinDate(data.data.listVaccinDates);
        }
        setLoading(false);
    };
    const LoadReport=async()=>{
        setLoading(true);
        const response=await httpGet({endpoint:'/api/Dashboard/ReportView',jsonData:{}});
        const data=response;
        if(data.data.listReportViews.length>0){
            setlistReport(data.data.listReportViews);
        }
       

    };
    useEffect(() => {
        LoadFilter();
        LoadReport();
    }, []);
    return(
        <>
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
        {/* <h4 className="text-black-50">Generate Report</h4>
        <div className="border border-3 rounded-4 justify-content-center d-flex  p-4 shadow-lg">
            
        {listVaccin.length>0 ?(
          <select name="option" className="form-select w-25 m-2" id="" >
          <option value="" key="-1"  >-----------Select Vaccination-----------</option>
          {listVaccin.map((drive, index) => (
            <option value={drive.vaccin_name} key={index}>{drive.vaccin_name}</option>
          ))}
        </select>
        ):(
            <p>No data</p>
        )}
          {listVaccinDate.length>0 ?(
          <select name="option" className="form-select w-25 m-2" id="" >
          <option value="" key="-1"  >--------Select Vaccination Date--------</option>
          {listVaccinDate.map((drive, index) => (
            <option value={drive.vaccin_date} key={index}>{drive.vaccin_date}</option>
          ))}
        </select>
        ):(
            <p>No data</p>
        )}
        <button className="btn btn-primary w-25 m-2">Search</button>
        </div> */}
        <div>
        <div id="setlistReport">
            <h1>Vaccination Reports</h1>
            <DataTable 
                title="Reports Table"
                columns={columns}
                data={filteredReports}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, filteredReports.length]} 
            
                highlightOnHover
                striped
                subHeader
                subHeaderComponent={
                    
                    <div className="d-flex ">
                    <button className="btn btn-link  w-50 text-decoration-none" onClick={exportPDF}>Export to PDF</button>
                    <button className="btn btn-link w-50 text-decoration-none" onClick={exportToCSV}>Export to CSV</button>
                    <input
                        type="text"
                        placeholder="Search"
                        className="form-control w-50"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    </div>
                }
            />
        </div>
        </div>
     
        </>
    )
}
export default Reports;