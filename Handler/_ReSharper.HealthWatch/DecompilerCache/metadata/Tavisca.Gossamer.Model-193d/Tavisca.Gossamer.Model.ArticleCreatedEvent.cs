// Type: Tavisca.Gossamer.Model.ArticleCreatedEvent
// Assembly: Tavisca.Gossamer.Model, Version=0.91.0.0, Culture=neutral
// Assembly location: D:\Repos\Gossamer\1. Library\Gossamer\Tavisca.Gossamer.Model.dll

using System;

namespace Tavisca.Gossamer.Model
{
    [Serializable]
    public class ArticleCreatedEvent : ArticleEvent
    {
        public Article Article { get; set; }
        public override string EventType { get; set; }
    }
}
