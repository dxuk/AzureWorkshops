#r "Microsoft.WindowsAzure.Storage"

using System.Net;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;

public static HttpResponseMessage Run(HttpRequestMessage req, IQueryable<Votes> inVotes, TraceWriter log)
{
    // parse query parameters
    var QuestionKey = req.GetQueryNameValuePairs().FirstOrDefault(q => string.Compare(q.Key, "Question", true) == 0).Value;
    var DateKey = req.GetQueryNameValuePairs().FirstOrDefault(q => string.Compare(q.Key, "EventDate", true) == 0).Value;

    return req.CreateResponse(HttpStatusCode.OK, (from votes in inTVotes select votes).Where(e => e.RowKey == QuestionKey && e.PartitionKey == DateKey).ToList());
}

public class Votes : TableEntity
{
    public string Voter { get; set; }
    public int Votes { get; set; }

}
