using System;
using System.Collections.Generic;
using System.Text;


namespace DTO.Response
{
    public class BaseResponse
    {
        public string trackerId { get; set; }
        public string flag { get; set; }
        public string message { get; set; }
        public string timeStamp { get; set; }
    }
}
