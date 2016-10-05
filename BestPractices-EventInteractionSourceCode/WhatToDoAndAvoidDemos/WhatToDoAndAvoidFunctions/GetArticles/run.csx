#r "Microsoft.WindowsAzure.Storage"

using System.Net;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;

public static HttpResponseMessage Run(HttpRequestMessage req, IQueryable<ArticleHeader> inTable, IQueryable<ArticleDetail> inTable2, TraceWriter log)
{

    // parse query parameter

    var linkArticleKey = req.GetQueryNameValuePairs().FirstOrDefault(q => string.Compare(q.Key, "FetchSet", true) == 0).Value;

    var mdto = new ArticleDTO();

    mdto.Header = (from article in inTable select article).Where(e => e.RowKey == linkArticleKey && e.PartitionKey == "ArticleHeaders").FirstOrDefault();
    mdto.Detail = (from articled in inTable2 select articled).Where(e => e.PartitionKey == linkArticleKey).ToList();

    return req.CreateResponse(HttpStatusCode.OK, mdto);
}

public class ArticleDTO
{

    public ArticleHeader Header { get; set; }
    public List<ArticleDetail> Detail { get; set; }

}

public class ArticleHeader : TableEntity
{
    public string Title { get; set; }
    public string Abstract { get; set; }
}

public class ArticleDetail : TableEntity
{
    public string Title { get; set; }
    public string Date { get; set; }
    public string Narrative { get; set; }
    public string Link { get; set; }
}