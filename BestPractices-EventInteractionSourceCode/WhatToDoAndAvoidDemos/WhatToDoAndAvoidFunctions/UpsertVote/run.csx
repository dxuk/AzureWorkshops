#r "Microsoft.WindowsAzure.Storage"

using System.Net;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, ICollector<Votes> outVotes, TraceWriter log)
{

    dynamic data = await req.Content.ReadAsAsync<object>();
    string name = data?.name;

    if (name == null)
    {
        return req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a name in the request body");
    }

    outVotes.Add(new Votes()
    {
        PartitionKey = "Functions",
        RowKey = Guid.NewGuid().ToString(),
        Voter = "Will",
        VoteCount = 3

    });

    return req.CreateResponse(HttpStatusCode.Created);

}

public class Votes : TableEntity
{

    public string Voter { get; set; }
    public int VoteCount { get; set; }

}
