#r "Microsoft.WindowsAzure.Storage"

using System.Net;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;

public static HttpResponseMessage Run(HttpRequestMessage req, IQueryable<SlotBooking> inTable, TraceWriter log)
{

    var linkArticleKey = req.GetQueryNameValuePairs().FirstOrDefault(q => string.Compare(q.Key, "InFuture", true) == 0).Value;

    // Return all entries in the ArticleHeader Table
    return req.CreateResponse(HttpStatusCode.OK, (from article in inTable select article).Where(e => e.MenuArea == linkArticleKey).ToList());

}

public class SlotBooking : TableEntity
{
    public string Title { get; set; }
    public string Abstract { get; set; }
    public string MenuArea { get; set; }
    public string Link { get; set; }
    public string InFuture { get; set; }
}
