using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Response
{
    public class ViewStudentResponse
    {
        public List<studentList> studentList { get; set; }
        
    }
    public class studentList
    {
        public string name { get; set; }
        public string studentid { get; set; }
        public string sclass { get; set; }
        public string dob { get; set; }

    }
}
