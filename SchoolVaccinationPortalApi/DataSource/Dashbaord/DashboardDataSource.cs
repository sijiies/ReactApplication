using DTO.Request;
using DTO.Response;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.Dashbaord
{
    public class DashboardDataSource
    {
        private readonly SqlHelper.Helper sqlHelper;
        public DashboardDataSource(SqlHelper.Helper sqlHelper) { this.sqlHelper = sqlHelper; }
        public Response<GetDashboardDataResponse> GetdashboardData()
        {
            Response<GetDashboardDataResponse> response = new Response<GetDashboardDataResponse>();
            response.Data = new GetDashboardDataResponse();
            GetDashboardDataResponse getDashboardDataResponse = new GetDashboardDataResponse();
            DataTable dt = new DataTable();
            string sql = "SELECT   (SELECT COUNT(*) FROM TBL_DRIVE) *   (SELECT COUNT(*) FROM TBL_STUDENT_MASTER) AS total";
            dt = sqlHelper.ExecuteQuery(sql, null);

    

            getDashboardDataResponse.totalStudents = dt.Rows[0][0].ToString()??"";
            sql = "SELECT COUNT(*) FROM TBL_VACCINATION_DETAILS T";
            dt = sqlHelper.ExecuteQuery(sql, null);

            getDashboardDataResponse.vaccinatedStudents = dt.Rows[0][0].ToString() ?? "";
            int totalStudents = int.Parse(getDashboardDataResponse.totalStudents);
            int vaccinatedStudents = int.Parse(getDashboardDataResponse.vaccinatedStudents);

            double vaccinatedPercentage = ((double)vaccinatedStudents / totalStudents) * 100;
            getDashboardDataResponse.vaccinatedPercentage = Math.Round(vaccinatedPercentage, 2).ToString();


            string sql1 = "SELECT T.VACCINATION_DATE,T.DRIVE_NAME FROM TBL_DRIVE T WHERE VACCINATION_DATE >= GETDATE() AND VACCINATION_DATE < DATEADD(DAY, 30, GETDATE());";

            dt = sqlHelper.ExecuteQuery(sql1, null);
            List<upcomingDrivesList> upcoming = new List<upcomingDrivesList>();
            if (dt.Rows.Count > 0)
            {
                foreach(DataRow dr in dt.Rows)
                {
                    upcomingDrivesList li = new upcomingDrivesList();
                    li.date = dr[0].ToString() ?? "";
                    li.location = dr[1].ToString() ?? "";
                    upcoming.Add(li);
                }
            }


            getDashboardDataResponse.upcomingDrives = new List<upcomingDrivesList>();
            getDashboardDataResponse.upcomingDrives = upcoming;
            response.Data = getDashboardDataResponse;
            return response;
        }
        public Response<AddStudentResponse> AddStudent(AddStudentRequest request)
        {
            Response<AddStudentResponse> response = new Response<AddStudentResponse>();
            AddStudentResponse res = new AddStudentResponse();
            response.Data = new AddStudentResponse();
            string sql = "INSERT INTO TBL_STUDENT_MASTER VALUES(@name,CAST(@dob AS DATE),@studentid,@sclass)";
            SqlParameter[] parameters = {
                                            new SqlParameter("@name", request.name),
                                            new SqlParameter("@dob",request.dob),
                                            new SqlParameter("@studentid",request.studentid),
                                            new SqlParameter("@sclass",request.sclass)
            };
            int Eres = sqlHelper.ExecuteNonQuery(sql, parameters);
            if (Eres == 1)
            {
                res.status = "SUCCESS";
                res.message = "SUCCESSFULLY ADDED";

            }
            else
            {
                res.status = "FAIL";
                res.message = "FAILED TO ADD";
            }
            response.Data = res;
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;

        }
        public Response<ViewStudentResponse> ViewStudent()
        {
            DataTable dt = new DataTable();
            string sql = "SELECT t.STUDENT_NAME,t.id,t.sclass,t.dob FROM TBL_STUDENT_MASTER t ";
            dt = sqlHelper.ExecuteQuery(sql, null);
            Response<ViewStudentResponse> response = new Response<ViewStudentResponse>();
           
            List<studentList> students = new List<studentList>();
            foreach (DataRow dr in dt.Rows)
            {
                studentList studentList = new studentList();
                studentList.name = dr[0].ToString()??"";
                studentList.studentid = dr[1].ToString()??"";
                studentList.sclass = dr[2].ToString()??"";
                studentList.dob = dr[3].ToString()??"";
                students.Add(studentList);
            }

            response.Data = new ViewStudentResponse();
            response.Data.studentList = students;
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;

            return response;
        }

        public Response<AddDriveResponse> AddDrive(AddDriveRequest request)
        {
            Response<AddDriveResponse> response = new Response<AddDriveResponse>();
            AddDriveResponse addDrive = new AddDriveResponse();
            DataTable dt = new DataTable();
            string sql = "select count(*) from TBL_DRIVE T WHERE T.VACCINATION_DATE=@DATE";
            SqlParameter[] parameters = {
                                    new SqlParameter("@DATE", request.vaccinationDate),
    };
            dt = sqlHelper.ExecuteQuery(sql, parameters);
            if (dt.Rows[0][0].ToString() != "0")
            {
                addDrive.status = "FAIL";
                addDrive.message = "Date is already booked, Please choose another Date.";
            }

            else
            {

                DateTime time = new DateTime();
                time = Convert.ToDateTime(request.vaccinationDate);
                if (time < DateTime.Now.AddDays(15))
                {
                    addDrive.status = "FAIL";
                    addDrive.message = "Please schedule at least 15 days in advance.";
                }


                else
                {
                    string InSql = "INSERT INTO TBL_DRIVE VALUES (@VNAME,@VDATE,@DOSE,'admin',@DNAME)";
                    SqlParameter[] parameters1 =
                    {
            new SqlParameter("@VNAME",request.vaccinationName),
            new SqlParameter("@VDATE",request.vaccinationDate),
            new SqlParameter("@DOSE",request.doses),
            new SqlParameter("@DNAME",request.driveName),

        };
                    int res = sqlHelper.ExecuteNonQuery(InSql, parameters1);
                    if (res == 1)
                    {
                        addDrive.status = "SUCCESS";
                        addDrive.message = "Vaccination Drive Added Successfully.";
                    }
                    else
                    {
                        addDrive.status = "FAIL";
                        addDrive.message = "Failed to add details.";
                    }
                }

            }
            response.Data = new AddDriveResponse();
            response.Data = addDrive;
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;

        }


        public Response<UpcomingDriveResponse> UpcomingDrives()
        {
            Response<UpcomingDriveResponse> response = new Response<UpcomingDriveResponse>();
            response.Data = new UpcomingDriveResponse();
            List<Drive> drives = new List<Drive>();
            DataTable dt = new DataTable();
            string sql = "SELECT T.DRIVE_ID, T.VACCINATION_NAME, T.VACCINATION_DATE FROM TBL_DRIVE T WHERE T.VACCINATION_DATE > SYSDATETIME()";
            dt = sqlHelper.ExecuteQuery(sql, null);
            if (dt.Rows.Count > 0)
            {
                foreach(DataRow dr in dt.Rows)
                {
                    Drive drive = new Drive();
                    drive.drive_id = dr[0].ToString() ?? "";
                    drive.vaccination_name = dr[1].ToString() ?? "";
                    drive.vaccination_date = dr[2].ToString() ?? "";
                    drives.Add(drive);
                }
                response.Data.Drives = drives;
                response.Data.status = "SUCCESS";
                response.Data.message = "SUCCESS";
            }
            else
            {
                response.Data.status = "NO DATA";
                response.Data.message = "No Upcoming Drive";
            }
            
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;
        }
        public Response<ViewStudentVaccinationResponse> ViewStudentVaccination(ViewStudentVaccinationRequest request)
        {
            Response<ViewStudentVaccinationResponse> response = new Response<ViewStudentVaccinationResponse>();
            response.Data = new ViewStudentVaccinationResponse();
            DataTable dt = new DataTable();
            List<ViewStudentVaccin> viewStudents = new List<ViewStudentVaccin>();
            string sql = "SELECT T.STUDENT_NAME,T.Id AS STUDENT_ID,M.STATUS FROM TBL_STUDENT_MASTER T left JOIN TBL_VACCINATION_DETAILS M ON T.Id=M.student_id AND M.drive_id =@id";
            SqlParameter[] parameters = {
                                            new SqlParameter("@id", request.drive_id),
            };
            dt = sqlHelper.ExecuteQuery(sql, parameters);
            if (dt.Rows.Count > 0)
            {
                foreach(DataRow dr in dt.Rows)
                {
                    ViewStudentVaccin view = new ViewStudentVaccin();
                    view.student_name = dr[0].ToString() ?? "";
                    view.student_id = dr[1].ToString() ?? "";
                    view.status = dr[2].ToString() ?? "";
                    viewStudents.Add(view);
                }
                response.Data.ViewStudents = viewStudents;
                response.Data.status = "SUCCESS";
                response.Data.message = "SUCCESS";
                
            }
            else
            {
                response.Data.status = "No data";
                response.Data.message = "No data";
            }
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;
        }
        public Response<MarkVaccinationResponse> MarkVaccination(MarkVaccinationRequest request)
        {
            Response<MarkVaccinationResponse> response = new Response<MarkVaccinationResponse>();
            response.Data = new MarkVaccinationResponse();
            DataTable dt = new DataTable();
            string sql = "SELECT COUNT(*) FROM TBL_VACCINATION_DETAILS T WHERE T.DRIVE_ID=@DID AND T.STUDENT_ID=@SID";
            SqlParameter[] parameters = {
                                            new SqlParameter("@DID", request.drive_id),
                                            new SqlParameter("@SID", request.student_id),
            };
            dt = sqlHelper.ExecuteQuery(sql, parameters);
            if (dt.Rows[0][0].ToString() != "0")
            {
                response.Data.status = "FAIL";
                response.Data.message = "Vaccin already taken.!";
            }
            else
            {
                string inSql = "INSERT INTO TBL_VACCINATION_DETAILS VALUES(@DID,@SID,'VACCINED')";
                SqlParameter[] sqlParameter =
                {
                      new SqlParameter("@DID", request.drive_id),
                      new SqlParameter("@SID", request.student_id),
                };
                int res = sqlHelper.ExecuteNonQuery(inSql, sqlParameter);
                if (res == 1)
                {
                    response.Data.status = "SUCCESS";
                    response.Data.message = "Vaccination marked successfully.!";
                }
                else
                {
                    response.Data.status = "FAIL";
                    response.Data.message = "Vaccination marked Failed.!";
                }
            }
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;
        }
        public Response<ListDriveResponse> ListDrives()
        {
            Response<ListDriveResponse> response = new Response<ListDriveResponse>();
            response.Data = new ListDriveResponse();
            List<ListDrives> listDrives = new List<ListDrives>();
            DataTable dt = new DataTable();
            string sql = "SELECT t.DRIVE_ID,T.DRIVE_NAME,T.VACCINATION_DATE,T.DOSES,T.VACCINATION_NAME FROM TBL_DRIVE T ";
            dt = sqlHelper.ExecuteQuery(sql, null);
            if (dt.Rows.Count > 0)
            {
                foreach(DataRow dr in dt.Rows)
                {
                    DTO.Response.ListDrives list1 = new ListDrives();
                    list1.drive_id = dr[0].ToString()??"";
                    list1.drive_name = dr[1].ToString()??"";
                    list1.drive_date = dr[2].ToString()??"";
                    list1.doses = dr[3].ToString().Trim() ?? "";
                    list1.vaccination_name = dr[4].ToString().Trim() ?? "";

                    listDrives.Add(list1);
                }
                
                response.Data.listDrives = listDrives;
                response.Data.status = "SUCCESS";
                response.Data.message = "SUCCESS";
            }
            else
            {
                response.Data.status = "NO DATA";
                response.Data.message = "No Drive Records";
            }
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;
        }
        public Response<UpdateDriveRequestResponse> UpdateDrive(UpdateDriveRequest request)
        {
            Response<UpdateDriveRequestResponse> response = new Response<UpdateDriveRequestResponse>();
            response.Data = new UpdateDriveRequestResponse();
           DataTable dt = new DataTable();
            string sql = "SELECT t.DRIVE_ID,T.DRIVE_NAME,T.VACCINATION_DATE,T.DOSES FROM TBL_DRIVE T WHERE  T.VACCINATION_DATE > SYSDATETIME() AND T.DRIVE_ID=@ID";
            SqlParameter[] parameters = {
                                            new SqlParameter("@ID", request.drive_id),
          
            };
            dt = sqlHelper.ExecuteQuery(sql, parameters);
            if (dt.Rows.Count > 0)
            {
                string udapteSql = "UPDATE TBL_DRIVE SET VACCINATION_NAME=@VNAME, DRIVE_NAME=@NAME ,VACCINATION_DATE=@DATE ,DOSES=@DOSE WHERE DRIVE_ID=@ID";
                SqlParameter[] parameters1 = {
                                            new SqlParameter("@ID", request.drive_id),
                                            new SqlParameter("@DOSE", request.doses),
                                            new SqlParameter("@DATE", request.drive_date),
                                            new SqlParameter("@NAME", request.drive_name),
                                            new SqlParameter("@VNAME", request.v_name),
                };
                int res = sqlHelper.ExecuteNonQuery(udapteSql, parameters1);
                if (res == 1)
                {
                    response.Data.status = "SUCCESS";
                    response.Data.message = "SUCCESS";
                }
                else
                {
                    response.Data.status = "FAIL";
                    response.Data.message = "Failed to update.!";
                }
            }
            else
            {
                response.Data.status = "FAIL";
                response.Data.message = "Past Drive Cannot be Modified.!";
            }
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;
        }
        
        public Response<ReportFiltersResponse> ReportFilter()
        {
            Response<ReportFiltersResponse> response = new Response<ReportFiltersResponse>();
            response.Data = new ReportFiltersResponse();
            DataTable dt = new DataTable();
            List<ListVaccin> listVaccins = new List<ListVaccin>();
            List<ListVaccinDate> listVaccinDates = new List<ListVaccinDate>();
            string sql = "SELECT T.VACCINATION_NAME,T.VACCINATION_DATE FROM TBL_DRIVE T";
            dt = sqlHelper.ExecuteQuery(sql, null);

            if (dt.Rows.Count > 0)
            {
                foreach(DataRow dr in dt.Rows)
                {
                    ListVaccin list = new ListVaccin();
                    list.vaccin_name = dr[0].ToString() ?? "";
                    ListVaccinDate listVaccinDate = new ListVaccinDate();
                    DateTime parsedDate;
                    if (DateTime.TryParse(dr[1].ToString() ?? "", out parsedDate))
                    { 
                        listVaccinDate.vaccin_date = parsedDate.ToString("yyyy-MM-dd");
                    }

                
                    listVaccins.Add(list);
                    listVaccinDates.Add(listVaccinDate);
                }
            }
            response.Data.listVaccins = listVaccins;
            response.Data.listVaccinDates = listVaccinDates;
            sql = "SELECT T.Id FROM TBL_STUDENT_MASTER T";
            dt = sqlHelper.ExecuteQuery(sql, null);
            List<ListStudentId> studentIds = new List<ListStudentId>();
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    ListStudentId list = new ListStudentId();
                    list.student_id = dr[0].ToString() ?? "";
                    studentIds.Add(list);
                }
            }
            response.Data.listStudentIds = studentIds;
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;

        }

        public Response<ReportViewResponse> ReportView()
        {
            Response<ReportViewResponse> response = new Response<ReportViewResponse>();
            DataTable dt = new DataTable();
            response.Data = new ReportViewResponse();
            string sql = "SELECT T.Id AS STUDENT_ID,T.STUDENT_NAME,M.STATUS,D.DRIVE_NAME,D.VACCINATION_NAME,D.VACCINATION_DATE FROM TBL_STUDENT_MASTER T left JOIN TBL_VACCINATION_DETAILS M ON T.Id=M.student_id LEFT JOIN TBL_DRIVE D ON D.DRIVE_ID=M.DRIVE_ID";
            dt = sqlHelper.ExecuteQuery(sql, null);
            List<ListReportView> list = new List<ListReportView>();
            if (dt.Rows.Count > 0)
            {
                foreach(DataRow dr in dt.Rows)
                {
                    ListReportView view = new ListReportView();
                    view.STUDENT_ID = dr[0].ToString() ?? "";
                    view.STUDENT_NAME = dr[1].ToString() ?? "";
                    view.STATUS = dr[2].ToString() ?? "";
                    view.DRIVE_NAME = dr[3].ToString() ?? "";
                    view.VACCINATION_NAME = dr[4].ToString() ?? "";
                    view.VACCINATION_DATE = dr[5].ToString() ?? "";
                    list.Add(view);
                }
            }
            response.Data.listReportViews = list;
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;

        } 

        public Response<EditStudentResponse> EditStudent(EditStudentRequest request)
        {
            Response<EditStudentResponse> response = new Response<EditStudentResponse>();
            response.Data = new EditStudentResponse();
            DataTable dt = new DataTable();
            string sql = "SELECT * FROM TBL_STUDENT_MASTER T WHERE T.ID=@STUDID";
            SqlParameter[] parameters = {
                                            new SqlParameter("@STUDID", request.student_id),

            };
            dt = sqlHelper.ExecuteQuery(sql, parameters);
            if (dt.Rows.Count > 0)
            {
                sql = "UPDATE TBL_STUDENT_MASTER SET STUDENT_NAME=@NAME,DOB=@DOB,sclass=@SCLASS WHERE ID=@STUDID";
                SqlParameter[] parameters1 = {
                                            new SqlParameter("@STUDID", request.student_id),
                                            new SqlParameter("@NAME", request.student_name),
                                            new SqlParameter("@DOB", request.studnet_dob),
                                            new SqlParameter("@SCLASS", request.student_class),

                };
                int res = sqlHelper.ExecuteNonQuery(sql,parameters1);
                if (res == 1)
                {
                    response.Data.status = "SUCCESS";
                    response.Data.message = "SUCESS";
                }
                else
                {
                    response.Data.status = "FAILED";
                    response.Data.message = "UPDATE FAILED";
                }
            }
            else
            {
                response.Data.status = "NO DATA";
                response.Data.message = "No Records";
            }
            response.status = ResponseTypeContants.SUCCESS;
            response.apiStatus = ApiStatusConstants.COMPLETED;
            response.responseMsg = ResponseTypeContants.SUCCESS;
            return response;
        }
    }
}
