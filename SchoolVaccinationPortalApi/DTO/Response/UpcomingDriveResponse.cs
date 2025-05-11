using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Response
{
    public class UpcomingDriveResponse
    {
        public string status { get; set; }
        public string message { get; set; }
        public List<Drive> Drives { get; set; }
    }
    public class Drive
    {
        public string drive_id { get; set; }
        public string vaccination_date { get; set; }
        public string vaccination_name { get; set; }
    }
}
