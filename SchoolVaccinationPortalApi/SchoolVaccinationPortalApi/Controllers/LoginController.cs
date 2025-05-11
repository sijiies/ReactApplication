using DataSource.Login;
using DTO.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace SchoolVaccinationPortalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly LoginDataSource _dataSource;
        public LoginController(LoginDataSource dataSource)
        {
            _dataSource = dataSource;
        }
        [Authorize]
        [HttpPost]
        public IActionResult Login(DTO.Request.LoginRequest request)
        {
            try
            {
                Response<LoginResponse> response = new Response<LoginResponse>();
                response = _dataSource.Login(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
