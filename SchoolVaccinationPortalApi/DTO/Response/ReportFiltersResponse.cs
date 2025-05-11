using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Response
{
    public class ReportFiltersResponse
    {
        public List<ListVaccin>  listVaccins { get; set; }
        public List<ListVaccinDate>  listVaccinDates{ get; set; }
        public List<ListStudentId>  listStudentIds{ get; set; }


    }
    public class ListVaccin
    {
        public string vaccin_name { get; set; }
    }
    public class ListVaccinDate
    {
        public string vaccin_date { get; set; }
    }
    public class ListStudentId
    {
        public string student_id { get; set; }
    }
}
