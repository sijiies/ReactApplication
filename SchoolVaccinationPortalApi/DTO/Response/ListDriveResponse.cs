using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Response
{
    public class ListDriveResponse
    {
        public string message { get; set; }
        public string status { get; set; }

        public List<ListDrives> listDrives { get; set; }
    }
    public class ListDrives
    {
        public string drive_id { get; set; }
        public string drive_name { get; set; }
        public string drive_date { get; set; }
        public string doses { get; set; }
        public string vaccination_name { get; set; }
    }
}
