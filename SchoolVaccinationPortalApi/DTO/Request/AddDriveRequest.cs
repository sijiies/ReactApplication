using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Request
{
    public class AddDriveRequest
    {
        public string vaccinationName { get; set; }
        public string vaccinationDate { get; set; }
        public string doses { get; set; }
        public string driveName { get; set; }
    }
}
