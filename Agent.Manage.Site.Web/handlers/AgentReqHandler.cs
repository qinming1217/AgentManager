using Aspose.Cells;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Web;
using System.Web.SessionState;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace Agent.Manage.Site.Web.hanglers
{
	public class AgentReqHandler : IHttpHandler, IRequiresSessionState
	{
		private log4net.ILog logger = log4net.LogManager.GetLogger(typeof(AgentReqHandler));

		/// <summary>
		/// 用户Id
		/// </summary>
		private int _userId = 0;
		/// <summary>
		/// webserivce地址
		/// </summary>
		private string webserviceUrl = System.Configuration.ConfigurationManager.AppSettings["agentservice"];

		#region IHttpHandler Members
		public bool IsReusable
		{
			// Return false in case your Managed Handler cannot be reused for another request.
			// Usually this would be false in case you have some state information preserved per request.
			get { return true; }
		}

		public void ProcessRequest(HttpContext context)
		{
			try
			{
				string requestType = context.Request["reqtype"];

				logger.Info(requestType);

				if (requestType != "AgentLogin" && requestType != "InitUserInfo" && !ValidUser(context))
				{
					if (requestType == "FinancialUpload" || requestType == "InvitationUpload")
					{
						string redirect = string.Empty;
						redirect = "window.parent.location.href = '/login.html'";
						context.Response.Write(string.Format("<script>{0};</script>", redirect));
					}
					else
					{
						context.Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(new { resCode = -1 }));
					}
					context.Response.End();
				}
				Workbook workBook = null;
				string resp = RequestHandler(requestType, context.Request, out workBook);

				if (requestType.ToLower().StartsWith("export"))
				{
					resp = resp.Substring(1, resp.Length - 2);
					if (resp.Length > 0)
					{
						//失败操作
						if (resp != "-1")
						{
							var bytes = Convert.FromBase64String(resp);

							string fileName = string.Empty;
							switch (requestType.ToLower())
							{
								case "exportwithdrawapply":
									{
										fileName = HttpUtility.UrlEncode("提现记录明细_" + DateTime.Now.ToString("yyyyMMdd"));
										break;
									}
								case "exportreport":
									{
										fileName = HttpUtility.UrlEncode("业务报表_" + DateTime.Now.ToString("yyyyMMdd"));
										break;
									}
							}
							context.Response.Clear();
							context.Response.ClearContent();
							context.Response.ClearHeaders();
							context.Response.ContentType = "application/octet-stream";
							context.Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName + ".xlsx");
							context.Response.AddHeader("Content-Length", bytes.Length.ToString());

							context.Response.OutputStream.Write(bytes, 0, bytes.Length);
						}
					}
				}
				else if (requestType.ToLower().EndsWith("upload"))
				{
					if (string.IsNullOrEmpty(resp))
					{

						using (MemoryStream ms = new MemoryStream())
						{
							workBook.Save(ms, SaveFormat.Xlsx);
							var bytes = ms.ToArray();
							string fileName = HttpUtility.UrlEncode("导入结果反馈");
							context.Response.Clear();
							context.Response.ClearContent();
							context.Response.ClearHeaders();
							context.Response.ContentType = "application/octet-stream";
							context.Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName + ".xlsx");
							context.Response.AddHeader("Content-Length", bytes.Length.ToString());

							context.Response.OutputStream.Write(bytes, 0, bytes.Length);
						}
					}
					else
					{
						string redirect = string.Empty;
						System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
						string timestamp = Math.Round((DateTime.Now - startTime).TotalSeconds / 1000).ToString();
						string type = requestType.ToLower().Substring(0, requestType.ToLower().LastIndexOf("upload"));
						redirect = string.Format("window.parent.document.getElementById('myIframe').src = 'biz.html#/{0}?v={1}'", type, timestamp);

						context.Response.Write(string.Format("<script>alert('{0}');{1};</script>", resp, redirect));
					}
				}
				else
				{
					context.Response.Write(resp);
				}
			}
			catch (Exception ex)
			{
				logger.Error(ex.StackTrace);
			}
			context.Response.End();
		}

		#endregion

		private string CreateHttpRequest(string url, string postData)
		{
			string result = "";
			try
			{
				HttpItem item = new HttpItem()
				{
					URL = url,
					Method = "POST",
					Postdata = postData,
					Encoding = Encoding.UTF8
					//PostdataByte = Encoding.ASCII.GetBytes(postData),
					//PostDataType = PostDataType.Byte
				};
				HttpHelper helper = new HttpHelper();
				result = helper.GetHtml(item).Html;
			}
			catch (Exception e)
			{

			}

			return result;
		}

		#region helper
		private bool ValidUser(HttpContext context)
		{
			if (context.Session["user"] == null)
			{
				return false;
			}
			_userId = Convert.ToInt32(context.Session["user"]);
			return true;
		}

		private string RequestHandler(string requestType, HttpRequest httpRequest, out Workbook workBook)
		{
			workBook = null;
			string result = string.Empty;
			string requestData = httpRequest.Form.AllKeys.Length > 0 ? httpRequest.Form.ToString() : httpRequest.QueryString.ToString();


			logger.Info(requestData);

			try
			{
				switch (requestType.ToLower())
				{
					case "orderquery":
					case "submitquery":
					case "submitorder":
					case "querywithdrawapply":
					case "commisionquery":
					case "exportwithdrawapply":
					case "exportreport":
						result = CreateHttpRequest(webserviceUrl + requestType, "uid=" + _userId + "&" + requestData);
						break;
					case "agentlogin":
						SessionInfo session = new SessionInfo();
						string loginname = httpRequest.QueryString["loginname"];
						string password = httpRequest.QueryString["password"];

						password = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(password, "MD5");

						session.value = CreateHttpRequest(webserviceUrl + requestType, "loginname=" + loginname + "&password=" + password.ToUpper());

						session.key = Guid.NewGuid().ToString();
						HttpContext.Current.Session[session.key] = session.value;

						result = Newtonsoft.Json.JsonConvert.SerializeObject(session);
						break;
					case "inituserinfo":
						string sessionKey = httpRequest.QueryString["sessionKey"];
						int uid = Convert.ToInt32(httpRequest.QueryString["uid"]);

						HttpContext.Current.Session["user"] = uid;

						if (HttpContext.Current.Session[sessionKey] != null)
						{
							result = HttpContext.Current.Session[sessionKey].ToString();
						}
						else
						{
							result = Newtonsoft.Json.JsonConvert.SerializeObject(new { resCode = -1 });
						}
						break;
					case "initsalesmanager":
						if (HttpContext.Current.Session["SalesManager"] == null)
						{
							result = CreateHttpRequest(webserviceUrl + requestType, "uid=" + _userId);
							HttpContext.Current.Session["SalesManager"] = result;
						}
						else
						{
							result = HttpContext.Current.Session["SalesManager"].ToString();
						}
						break;
					case "invitationupload":
						if (httpRequest.Files.Count > 0)
						{
							#region 校验
							int rowsCount = 0;
							List<string> titles = new List<string>() 
                            { 
                              "批次号","邀约状态","邀约上门交单时间","电销坐席姓名","电销坐席工号",
                            };

							result = CheckFiles(httpRequest.Files[0], titles, out workBook, out rowsCount);

							Worksheet workSheet = workBook.Worksheets[0];
							#endregion

							#region 读取
							//读取excel内容
							List<Invitation> invitationList = new List<Invitation>();
							Invitation invitation = null;
							for (int j = 1; j <= rowsCount; j++)
							{
								invitation = new Invitation();
								invitation.batchNo = NullToString(workSheet.Cells[j, 0].Value);
								invitation.status = NullToString(workSheet.Cells[j, 1].Value);
								invitation.submitTime = NullToString(workSheet.Cells[j, 2].Value);
								invitation.phoneSaleName = NullToString(workSheet.Cells[j, 3].Value);
								invitation.phoneSaleNo = NullToString(workSheet.Cells[j, 4].Value);

								invitationList.Add(invitation);
							}
							#endregion

							#region 上传
							//上传到数据库
							string invitationStr = Newtonsoft.Json.JsonConvert.SerializeObject(invitationList);
							DataResponse dataResp = Newtonsoft.Json.JsonConvert.DeserializeObject<DataResponse>
								(CreateHttpRequest(webserviceUrl + requestType, "uid=" + _userId + "&invitationStr=" + HttpUtility.UrlEncode(invitationStr)));
							#endregion

							#region 更新结果
							//填充Excel结果
							FillUploadResult(dataResp, workSheet);
							#endregion
						}
						break;
					case "financialupload":
						if (httpRequest.Files.Count > 0)
						{
							#region 校验
							int rowsCount = 0;
							//文件列名
							List<string> titles = new List<string>() 
                            { 
                              "提现记录ID","储蓄卡号","户名","所属银行","所属支行",
                              "提现金额","打款状态","打款日期","代理人姓名","代理人身份证号"
                            };

							//内容校验
							result = CheckFiles(httpRequest.Files[0], titles, out workBook, out rowsCount);

							if (result != string.Empty)
							{
								break;
							}

							Worksheet workSheet = workBook.Worksheets[0];
							#endregion

							#region 读取
							//读取excel内容
							List<Financial> financialList = new List<Financial>();
							Financial financial = null;
							for (int j = 1; j <= rowsCount; j++)
							{
								financial = new Financial();
								financial.cashRecordId = NullToString(workSheet.Cells[j, 0].Value);
								financial.playMoneyStatus = NullToString(workSheet.Cells[j, 6].Value);
								financial.playMoneyTime = NullToString(workSheet.Cells[j, 7].Value);

								financialList.Add(financial);
							}
							#endregion

							#region 上传
							//上传到数据库
							string financialStr = Newtonsoft.Json.JsonConvert.SerializeObject(financialList);
							DataResponse dataResp = Newtonsoft.Json.JsonConvert.DeserializeObject<DataResponse>
								(CreateHttpRequest(webserviceUrl + requestType, "uid=" + _userId + "&financialStr=" + HttpUtility.UrlEncode(financialStr)));
							#endregion

							#region 更新结果
							//填充Excel结果
							FillUploadResult(dataResp, workSheet);
							#endregion
						}
						break;
					default: { break; }
				}
			}
			catch (Exception ex)
			{
				throw ex;
			}
			return result;
		}
		public string NullToString(object o)
		{
			return o != null ? o.ToString() : "";
		}
		#endregion
		public string CheckFiles(HttpPostedFile file, List<string> titles, out Workbook workBook, out int rowsCount)
		{
			string result = string.Empty;
			workBook = new Workbook(file.InputStream);
			Worksheet workSheet = workBook.Worksheets[0];
			rowsCount = workSheet.Cells.MaxDataRow;
			int columsCount = workSheet.Cells.MaxDataColumn + 1;
			//检查列数是否一致
			if (columsCount != titles.Count)
			{
				result = "文件列数不一致";
				return result;
			}
			//检查excel标题是否正确
			for (int i = 0; i < columsCount; i++)
			{
				if (workSheet.Cells[0, i].Value == null)
				{
					result = "文件列名不能为空";
					return result;
				}
				if (workSheet.Cells[0, i].Value.ToString() != titles[i])
				{
					result = "文件列名不一致";
					return result;
				}
			}
			return result;
		}
		public Worksheet FillUploadResult(DataResponse dataResp, Worksheet workSheet)
		{
			//上传结果
			List<UploadResult> uploadResultList = null;
			if (dataResp.resCode == 0)
			{
				uploadResultList = dataResp.content;
				//最大行
				int rowsCount = workSheet.Cells.MaxDataRow;
				//最大列
				int columsCount = workSheet.Cells.MaxDataColumn + 1;
				//添加列头
				workSheet.Cells[0, columsCount].Value = "导入结果";
				if (uploadResultList == null || uploadResultList.Count == 0)
				{
					for (int j = 1; j <= rowsCount; j++)
					{
						workSheet.Cells[j, columsCount].Value = "成功";
					}
				}
				else
				{
					int j = 1;
					foreach (var uploadResult in uploadResultList)
					{
						string id = workSheet.Cells[j, 0].Value.ToString();
						if (uploadResult.id == id)  //如失败则在导入结果列添加失败原因
						{
							workSheet.Cells[j, columsCount].Value = "失败：原因为" + uploadResult.result;
						}
						else                        //如失败结果未找到则为成功
						{
							workSheet.Cells[j, columsCount].Value = "成功";
						}
						j++;
						continue;
					}
				}
			}

			return workSheet;
		}
	}
}

public class Invitation
{
	/// <summary>
	/// 批次号
	/// </summary>
	public string batchNo { get; set; }
	/// <summary>
	/// 邀约状态
	/// </summary>
	public string status { get; set; }
	/// <summary>
	/// 邀约上门交单时间
	/// </summary>
	public string submitTime { get; set; }
	/// <summary>
	/// 电销姓名
	/// </summary>
	public string phoneSaleName { get; set; }
	/// <summary>
	/// 工号
	/// </summary>
	public string phoneSaleNo { get; set; }
}
public class Financial
{
	/// <summary>
	/// 提现记录编号
	/// </summary>
	public string cashRecordId { get; set; }
	/// <summary>
	/// 储蓄卡号
	/// </summary>
	public string cardNo { get; set; }
	/// <summary>
	/// 户名
	/// </summary>
	public string accountName { get; set; }
	/// <summary>
	/// 开户行
	/// </summary>
	public string bank { get; set; }
	/// <summary>
	/// 支行
	/// </summary>
	public string subBank { get; set; }
	/// <summary>
	/// 打款状态
	/// </summary>
	public string playMoneyStatus { get; set; }
	/// <summary>
	/// 提现金额
	/// </summary>
	public string playMoneyTime { get; set; }
	/// <summary>
	/// 代理人姓名
	/// </summary>
	public string agentName { get; set; }
	/// <summary>
	/// 代理人身份证号
	/// </summary>
	public string agentIdCard { get; set; }
}
public class SessionInfo
{
	/// <summary>
	/// session键
	/// </summary>
	public string key { get; set; }
	/// <summary>
	/// session值
	/// </summary>
	public string value { get; set; }
}

public class UploadResult
{
	/// <summary>
	/// 编号
	/// </summary>
	public string id { get; set; }
	/// <summary>
	/// 结果
	/// </summary>
	public string result { get; set; }
}
public class DataResponse
{
	/// <summary>
	/// 响应编码
	/// </summary>
	public int resCode;
	/// <summary>
	/// 响应消息
	/// </summary>
	public string resMsg;
	/// <summary>
	/// 响应内容
	/// </summary>
	public List<UploadResult> content;
}
