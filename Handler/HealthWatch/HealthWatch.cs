using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using Tavisca.Gossamer.Infrastructure;
using Tavisca.Gossamer.Interfaces;
using Tavisca.Gossamer.Model;
using Tavisca.Messaging.RabbitMQ;
using System.Linq;

namespace HealthWatch
{
    // try to avoid keeping state.
    public class HealthWatchHandler : IMessageProcesser
    {
        public void Process(byte[] payload, IDictionary headers)
        {
            try
            {
                _process(payload, headers);
            }
            catch (Exception e)
            {
                _status = "ERROR";
                _information = e.GetType().Name + ": " + e.Message;
                Logger.Log(_information);
            }
        }

        private void _process(byte[] payload, IDictionary headers)
        {
            Logger.Log("Received article create event.");
            var articleEvent = Serializer.Json.Deserialize<ArticleCreatedEvent>(payload);
            if (articleEvent == null) return;
            articleEvent.Deployment = 2047637487485349 + "";
            articleEvent.AccountId = 1918338163933441;

            Logger.Log("Article Id: " + articleEvent.Id + " created at " + articleEvent.TimestampInIso8601);

            var aId = articleEvent.Id;

            try
            {
                Logger.Log(Encoding.Default.GetString(Serializer.Json.Serialize<ArticleCreatedEvent>(articleEvent)));

                using (new ExecutionContextScope(new ExecutionContext { AccountId = articleEvent.AccountId }))
                {
                    var deploymentManager = ObjectBuilder.Build<IDeploymentManager>();
                    var deployment = deploymentManager.Get(long.Parse(articleEvent.Deployment));

                    if (deployment == null)
                    {
                        Logger.Log("Could not get deployment! \nQuitting");
                        return;
                    }

                    var executionContext = new ExecutionContext { AccountId = articleEvent.AccountId };

                    using (new ExecutionContextScope(executionContext))
                    {
                        if (ExecutionContext.Current == null)
                        {
                            Logger.Log("Could not get current execution context! \nQuitting");
                            return;
                        }
                        ExecutionContext.Current.SetupDeployment(deployment, false);
                        Handle(long.Parse(articleEvent.Deployment), articleEvent.Id, 2047637487485349, articleEvent.Article);
                    }
                }
                Console.WriteLine("Connection Created Handler Succeed");
            }
            catch (Exception ex)
            {
                Logger.Log("Error : " + ex.Message);
                Logger.Log("Error : " + ex.StackTrace);
                Logger.Log("Error : " + ex.InnerException);
                Logger.Log("\n--------------------------------------------------------\n");
            }
        }

        private void Handle(long deploymentId, long id, long schemaId, Article article)
        {
            try
            {
                var articleManager = ObjectBuilder.Build<IArticleManager>();
                if (article.__Properties.ContainsKey("Type") && article.__Properties.ContainsKey("Value"))
                {
                    Logger.Log("Received " + article.__Properties["Type"] + ", value: " + article.__Properties["Value"]);
                    var val = 0;
                    if (int.TryParse(article.__Properties["Value"], out val))
                    {
                        var stat = article.__Properties["Type"];
                        var userId = article.__Attributes["userId"];
                        var session = article.__Attributes["sessionkey"];

                        if (stat == "Heart_Rate" && (val > 150 || val < 70))
                        {
                            if (string.IsNullOrEmpty(userId))
                            {
                                Logger.Log("Could not get userId, quitting.");
                                return;
                            }
                            StatWarning(articleManager.Get("User", long.Parse(userId)), "Heart Beat", val, article.__UtcDateCreated, session);
                        }
                        if (stat == "Blood_Sugar" && (val > 120 || val < 70))
                        {
                            StatWarning(articleManager.Get("User", long.Parse(userId)), "Blood Sugar", val, article.__UtcDateCreated, session);
                        }
                    }
                }
            } catch(Exception ex)
            {
                Logger.Log(ex.Message);
                Logger.Log(ex.StackTrace);
                Logger.Log("\n--------------------------------------------------------\n");
            }
        }

        private void StatWarning(Article user,string statType, long value, DateTime statTime, string session)
        {
            Logger.Log("Article Id: " + user.__Id + " really weird " + statType + ": " + value);
            var emailAddress = user.__Properties["Email_Id"];

            var emailStatus = SendEmail(emailAddress, statType, user.__Properties["Name"], value, statTime);
            Logger.Log(emailStatus);

            var updateStatus = UpdateUser(user, statType, value, statTime, session);
            Logger.Log(updateStatus);
        }

        private static string SendEmail(string emailAddress, string statType, string userName, long statValue, DateTime statTime)
        {
            var body = userName + " recorded a value of " + statValue + " for " + statType + " at time " + statTime.ToUniversalTime();

            var mail = new System.Net.Mail.MailMessage
            {
                IsBodyHtml = true,
                Subject = "Important: " + statType + " for " + userName + " is " + statValue,
                Body = body,
                From = new MailAddress("tiatma@gmail.com")
            };
            
            mail.To.Add(new MailAddress("skunkworks@tavisca.com"));
            var smtpClient = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("tiatma@gmail.com", "test123!@#"),
                EnableSsl = true
            };

            try
            {
                smtpClient.Send(mail);
            }
            catch (Exception ex)
            {
                return string.Format("Error in sending mail: {0}, {1}", ex.GetType().Name, ex.Message);
            }
            finally
            {
                mail.Dispose();
            }

            return "Successfully sent email.";
        }

        private static string UpdateUser(Article user, string statType, long statValue, DateTime statTime, string session)
        {
            try
            {
                var articleManager = ObjectBuilder.Build<IArticleManager>();

                var alerts = user.__Attributes.ContainsKey("Alerts")
                                   ? new List<string>(user.__Attributes["Alerts"].Split('|'))
                                   : new List<string>();
                alerts.Add(string.Format("{0}_{1}_{2}", statType, statValue, statTime));
                var finalAlerts = string.Join("|",alerts);

                var commandCollection = new UpdateArticleCommandCollection
                                            {
                                                Id = user.__Id,
                                                Commands = new List<UpdateCommand>
                                                               {
                                                                   new UpdateAttributesCommand
                                                                       {
                                                                           AttributesToAddOrUpdate =
                                                                               new Dictionary<string, string>
                                                                                   {
                                                                                       {"Alerts", finalAlerts}
                                                                                   }
                                                                       }
                                                               }
                                            };

                var updateCommand =
                    "{\"UpdateCommands\":[{\"__type\":\"UpdateAttributesCommand:http://www.tavisca.com/gossamer/datacontracts/2011/11\",\"AttributesToAddOrUpdate\":[{\"Key\":\"Alerts\",\"Value\":\"" + finalAlerts + "\"}],\"AttributesToRemove\":null}]}";
                
                var url = "http://gossamer.tavisca.com/v0.9/Core/Article.svc/2047637487485349/user/";
                url += user.__Id + "?session=" + session;

                var request = WebRequest.Create(url);
                request.Method = "POST";
                request.ContentType = "application/json";

                Logger.Log("Sending request to url: " + url);
                Logger.Log(updateCommand);


                var stream = request.GetRequestStream();
                var bytes = Encoding.Default.GetBytes(updateCommand);
                stream.Write(bytes, 0, bytes.Length);
                request.GetResponse();

                return "Successfully updated user: " + user.__Id;
            }
            catch (Exception ex)
            {
                return string.Format("Error in updating user with id " + user.__Id + ": {0}, {1}", ex.GetType().Name, ex.Message);
            }
        }

        private string _status = string.Empty;
        public string Status
        {
            get { return _status; }
        }

        private string _information = string.Empty;
        public string Information
        {
            get
            {
                return _information;
            }
        }
    }
}