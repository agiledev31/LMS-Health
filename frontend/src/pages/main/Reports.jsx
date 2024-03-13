import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/main/Breadcrumb";
import Label from "../../components/common/Label";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { format } from "date-fns";

function Reports() {
  const authHttpClient = useAuthHttpClient();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const pages = [{ name: "Reports", current: true }];

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await authHttpClient.get("report/");
        setReports(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleClick = async (report) => {
    try {
      const response = await authHttpClient.put("report/" + report._id, {
        seen: true,
      });
      document.location.replace(
        process.env.REACT_APP_URL + "/editQuestion/" + report.question._id
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log(reports);
  return (
    <div>
      <div className="-mt-4 mb-6">
        <Breadcrumb pages={pages} />
      </div>
      <div className="flex justify-between">
        <div className="text-3xl font-bold">Reports</div>
      </div>
      <div className="mt-4 -mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 p-4 bg-gray-50  border-t-2 border-gray-200">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="divide-y divide-gray-200 bg-white">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 flex items-center gap-2"
              >
                Report
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                From
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Created at
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-xs"
              >
                Question
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {reports.map((report) => (
              <tr
                key={report._id}
                className="even:bg-gray-50"
                onClick={() => handleClick(report)}
              >
                <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 flex items-center gap-2">
                  {report.report}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {report.user_id?.email ?? "Deleted account!"}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {format(new Date(report.sent_at), "MMM dd, yyyy")}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 overflow-hidden max-w-xs truncate">
                  {report.question.question}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <Label>{report.seen ? "Seen" : "Not seen"}</Label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
