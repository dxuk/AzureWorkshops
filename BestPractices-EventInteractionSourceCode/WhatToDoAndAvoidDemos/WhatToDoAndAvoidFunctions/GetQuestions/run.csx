#r "Microsoft.WindowsAzure.Storage"

using System.Net;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;

public static HttpResponseMessage Run(HttpRequestMessage req, IQueryable<Questions> inQuestions, TraceWriter log)
{
    bool redison = false;

    if (redison)
    {
        // Redis Cache Mode enabled
        // parse query parameters
        var DateKey = req.GetQueryNameValuePairs().FirstOrDefault(q => string.Compare(q.Key, "EventDate", true) == 0).Value;
        if (DateKey == "Today")
        {
            // Special value 
            DateKey = DateTime.Now.ToString("dd-MM-yyyy");
        }
        // Return all entries in the ArticleHeader Table
        return req.CreateResponse(HttpStatusCode.OK, (from questions in inQuestions select questions).Where(e => e.PartitionKey == DateKey).ToList());
    }
    else {

        // Redis Cache Mode enabled
        // parse query parameters
        var DateKey = req.GetQueryNameValuePairs().FirstOrDefault(q => string.Compare(q.Key, "EventDate", true) == 0).Value;
        if (DateKey == "Today")
        {
            // Special value 
            DateKey = DateTime.Now.ToString("dd-MM-yyyy");
        }
        // Return all entries in the ArticleHeader Table
        return req.CreateResponse(HttpStatusCode.OK, (from questions in inQuestions select questions).Where(e => e.PartitionKey == DateKey).ToList());
    }


}

public class Questions : TableEntity
{
    public string AskedBy { get; set; }
    public string Topic { get; set; }
    public string SubTopic { get; set; }
    public string Question { get; set; }
}
