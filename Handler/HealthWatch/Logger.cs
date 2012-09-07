using System;
using System.Collections.Generic;
using System.IO;

namespace HealthWatch
{
    public static class Logger
    {
        private static readonly List<string> Messages = new List<string>();

        public static void Log(string message)
        {
            Messages.Add(message);

            if (Messages.Count <= 1) return;

            try
            {
                TextWriter tw = new StreamWriter(@"D:\RabbitMqListeners\prod\plugins\lgossamer\public\messageLog.txt");
                Messages.ForEach(tw.WriteLine);
                tw.Close();
            }
            catch
            {
                
            }
        }
    }
}