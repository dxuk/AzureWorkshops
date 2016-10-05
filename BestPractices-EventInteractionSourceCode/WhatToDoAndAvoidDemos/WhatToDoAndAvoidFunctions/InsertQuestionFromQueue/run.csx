#r "Microsoft.WindowsAzure.Storage"
using System.Net;
using Microsoft.WindowsAzure.Storage.Table;

public static void Run(Questions QueuedQuestion, ICollector<Questions> outQuestion)
{
    // Map fields and drop the new object on the collector

    outQuestion.Add(new Questions()
    {
        PartitionKey = QueuedQuestion.SessionDate,
        RowKey = Guid.NewGuid().ToString(),
        Question = QueuedQuestion.Question,
        Topic = QueuedQuestion.Topic,
        AskedBy = QueuedQuestion.AskedBy

    });
}
public class Questions : TableEntity
{
    public string AskedBy { get; set; }
    public string Topic { get; set; }
    public string SubTopic { get; set; }
    public string Question { get; set; }
    public string SessionDate { get; set; }
}