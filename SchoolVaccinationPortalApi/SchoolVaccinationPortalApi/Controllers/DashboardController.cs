using DataSource.Dashbaord;
using DataSource.Login;
using DTO.Request;
using DTO.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SchoolVaccinationPortalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardDataSource _dataSource;
        public DashboardController(DashboardDataSource dataSource)
        {
            _dataSource = dataSource;
        }
        [HttpGet("GetDashboard")]
        public IActionResult GetDashboardData()
        {
            try
            {
                Response<GetDashboardDataResponse> response = new Response<GetDashboardDataResponse>();
                response = _dataSource.GetdashboardData();
                return Ok(response);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
           
        }
        [HttpPost("AddStudent")]
        public IActionResult AddStudent(AddStudentRequest request)
        {
            try
            {
                Response<AddStudentResponse> response = new Response<AddStudentResponse>();
                response = _dataSource.AddStudent(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpPost("ViewStudent")]
        public IActionResult ViewStudent()
        {
            try
            {
                Response<ViewStudentResponse> response = new Response<ViewStudentResponse>();   
                response = _dataSource.ViewStudent();
                return Ok(response);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("AddDrive")]
        public IActionResult AddDrive(AddDriveRequest request)
        {
            try
            {
                Response<AddDriveResponse> response = new Response<AddDriveResponse>();
                response = _dataSource.AddDrive(request);
                return Ok(response);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("UpcomingDrive")]
        public IActionResult UpcomingDrive()
        {
            try
            {
                Response<UpcomingDriveResponse> response = new Response<UpcomingDriveResponse>();
                response = _dataSource.UpcomingDrives();
                return Ok(response);
            }
             catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("ViewStudentVaccination")]
        public IActionResult ViewStudentVaccination(ViewStudentVaccinationRequest request)
        {
            try
            {
                Response<ViewStudentVaccinationResponse> response = new Response<ViewStudentVaccinationResponse>();
                response = _dataSource.ViewStudentVaccination(request);
                return Ok(response);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("MarkVaccination")]
        public IActionResult MarkVaccination(MarkVaccinationRequest request)
        {
            try
            {
                Response<MarkVaccinationResponse> response = new Response<MarkVaccinationResponse>();
                response = _dataSource.MarkVaccination(request);
                return Ok(response);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("ListDrives")]
        public IActionResult ListDrives()
        {
            try
            {
                Response<ListDriveResponse> response = new Response<ListDriveResponse>();
                response = _dataSource.ListDrives();
                return Ok(response);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateDrive")]
        public IActionResult UpdateDrive(UpdateDriveRequest request)
        {
            try
            {
                Response<UpdateDriveRequestResponse> response = new Response<UpdateDriveRequestResponse>();
                response = _dataSource.UpdateDrive(request);
                return Ok( response);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ReportFilter")]
        public IActionResult ReportFilter()
        {
            try
            {
                Response<ReportFiltersResponse> response = new Response<ReportFiltersResponse>();
                response = _dataSource.ReportFilter();
                return Ok(response);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("ReportView")]
        public IActionResult ReportView()
        {
            try
            {
                Response<ReportViewResponse> respons = new Response<ReportViewResponse>();
                respons = _dataSource.ReportView();
                return Ok(respons);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("EditStudent")]
        public IActionResult EditStudent(EditStudentRequest request)
        {
            try
            {
                Response<EditStudentResponse> response = new Response<EditStudentResponse>();
                response = _dataSource.EditStudent(request);
                return Ok(response);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
