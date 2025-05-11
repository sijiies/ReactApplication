using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Request
{
    public class MarkVaccinationRequest
    {
        public string drive_id { get; set; }
        public string student_id { get; set; }
    }
}
