using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Request
{
    public class AddStudentRequest
    {
        public string name { get; set; }
        public string dob { get; set; }
        public string studentid { get; set; }

        public string sclass { get; set; }
    }
}
