using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Request
{
    public class EditStudentRequest
    {
        public string student_id { get; set; }
        public string student_name { get; set; }
        public string student_class { get; set; }
        public string studnet_dob { get; set; }
    }
}
