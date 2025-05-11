using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Response
{
    public class ReportViewResponse
    {
        public List<ListReportView> listReportViews { get; set; }
    }
    public class ListReportView
    {
        public string STUDENT_ID { get; set; }
        public string STUDENT_NAME { get; set; }
        public string STATUS { get; set; }
        public string DRIVE_NAME { get; set; }
        public string VACCINATION_NAME { get; set; }
        public string VACCINATION_DATE { get; set; }
    }
}
