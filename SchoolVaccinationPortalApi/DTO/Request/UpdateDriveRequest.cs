using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Request
{
    public class UpdateDriveRequest
    {
        public string drive_id  { get; set; }
        public string drive_name  { get; set; }

        public string drive_date { get; set; }
        public string doses { get; set; }
        public string v_name { get; set; }
    }
}
