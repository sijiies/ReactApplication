using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Response
{
    public class GetDashboardDataResponse
    {
        public string totalStudents { get; set; }
        public string vaccinatedStudents { get; set; }
        public string vaccinatedPercentage { get; set; }
        public List<upcomingDrivesList> upcomingDrives { get; set; }
    }
    public class upcomingDrivesList
    {
        public string  date { get; set; }
        public string  location { get; set; }
    }
}
