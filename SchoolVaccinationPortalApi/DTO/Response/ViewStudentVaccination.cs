using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Response
{
    public class ViewStudentVaccinationResponse
    {
        public string status { get; set; }
        public string message { get; set; }
        public List<ViewStudentVaccin> ViewStudents { get; set; }
    }
    public class ViewStudentVaccin
    {
        public string student_name { get; set; }
        public string student_id { get; set; }
        public string status { get; set; }
    }
}
