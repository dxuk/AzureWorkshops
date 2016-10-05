#r "Microsoft.WindowsAzure.Storage"
using System.Net;
using Microsoft.WindowsAzure.Storage.Table;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, ICollector<Questions> outQuestion, TraceWriter log)
{
    // Check SecCode ... 
    dynamic data = await req.Content.ReadAsAsync<object>();
    if (data?.SecCode == "123123")
    {

        // Map fields   
        outQuestion.Add(new Questions()
        {
            PartitionKey = data?.SessionDate,
            RowKey = Guid.NewGuid().ToString(),
            Question = data?.Question,
            Topic = data?.Topic,
            AskedBy = data?.AskedBy

        });
        return req.CreateResponse(HttpStatusCode.Created);
    }
    else
    {
        return req.CreateResponse(HttpStatusCode.Forbidden);
    }
}
public class Questions : TableEntity
{
    public string AskedBy { get; set; }
    public string Topic { get; set; }
    public string SubTopic { get; set; }
    public string Question { get; set; }
    public string SessionDate { get; set; }

}
