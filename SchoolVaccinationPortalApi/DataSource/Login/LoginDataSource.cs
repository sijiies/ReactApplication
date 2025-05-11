using DTO.Request;
using DTO.Response;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.Login
{
    public class LoginDataSource
    {
        private readonly SqlHelper.Helper sqlHelper;

        public LoginDataSource(SqlHelper.Helper sqlHelper)
        {
            this.sqlHelper = sqlHelper;
        }

        public Response<LoginResponse> Login(LoginRequest request)
        {
            string sql = "SELECT TRIM(t.role) as Role,TRIM(t.username) as username  FROM TBL_USER_MASTER t where t.username=@username and t.password=@password";
            SqlParameter[] parameters = { 
                                            new SqlParameter("@username", request.username), 
                                            new SqlParameter("@password",request.password) 
                                        };
            DataTable dt= sqlHelper.ExecuteQuery(sql, parameters);
            Response<LoginResponse> response = new Response<LoginResponse>();
            response.Data = new LoginResponse();
            LoginResponse res = new LoginResponse();

            if (dt.Rows.Count > 0)
            {
                res.Status = "SUCCESS";
                res.Loginrole = dt.Rows[0][0].ToString()??"".Trim();
                res.username = dt.Rows[0][1].ToString()??"".Trim();
                response.status = ResponseTypeContants.SUCCESS;
                response.apiStatus = ApiStatusConstants.COMPLETED;
                response.responseMsg = ResponseTypeContants.SUCCESS;
            }
            response.Data = res;
            

            
            return response;
        }
    }
}
