import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import PieChart from "../../PieChart";
import { useAuth } from "../../../../providers/authProvider";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { Spinner } from "../../../icons/Spinner";

function Overview({ item }) {
  return (
    <>
      <div className="inline-block min-w-full py-2 align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
          <div className="p-6 bg-white text-xl font-extrabold">
            Liste des objectifs
          </div>
          <table className="min-w-full divide-y divide-gray-300">
            <tbody className="divide-y divide-gray-200 bg-white">
              {item?.objects.map(({ title, rank }, idx) => (
                <tr key={idx}>
                  <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                    {title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {rank}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-8 bg-gray-50">
        {/* statistics card */}
        <StatisticsChart item={item} />
      </div>
    </>
  );
}

const StatisticsChart = ({ item }) => {
  const [successRate, setSuccessRate] = useState(null);
  const [progressRate, setProgressRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  useEffect(() => {
    const getSuccessRate = async () => {
      setIsLoading(true)
      try {
        const response = await authHttpClient.post(`/progress/item/filter`, {
          user_id: user._id,
          item_id: item._id,
        });
        setSuccessRate(response.data.data[0]?.success_rate);
        setProgressRate(response.data.data[0]?.progress_rate);
        setIsLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    if(item) getSuccessRate();
  }, [item]);

  return (
    isLoading ? (
      <div
        role="status"
        className="h-[70vh] pb-20 flex justify-center items-center"
      >
        <Spinner />
      </div>
    ) : (<>
      <div className="rounded-2xl bg-white p-6 relative">
        <div className="absolute top-4 right-4 text-gray-500 hover:cursor-pointer group-hover:text-primary-600">
          <EllipsisVerticalIcon className="w-6 h-6" />
        </div>
        <div>
          <PieChart
            data={
              successRate
                ? [
                    successRate.excellent,
                    successRate.good,
                    successRate.average,
                    successRate.poor,
                  ]
                : [0, 0, 0, 1]
            }
            color={["#7F56D9", "#9E77ED", "#B692F6", "#D6BBFB", "#EAECF0"]}
          />
        </div>
        <div className="py-4">How you answer?</div>
        <div className="text-green-500 text-4xl font-extrabold">
          {successRate
            ? Math.round(
                ((successRate.excellent + successRate.good) * 100) /
                  (successRate.excellent +
                    successRate.good +
                    successRate.average +
                    successRate.poor)
              )
            : 0}
          % success
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 relative">
        <div className="absolute top-4 right-4 text-gray-500 hover:cursor-pointer group-hover:text-primary-600">
          <EllipsisVerticalIcon className="w-6 h-6" />
        </div>
        <div>
          <PieChart
            data={
              progressRate
                ? [progressRate, item.n_questions - progressRate]
                : [0, 1]
            }
            color={["#475467", "#F2F4F7"]}
          />
        </div>
        <div className="py-4">Progress rate</div>
        <div className="text-green-500 text-4xl font-extrabold">
          {progressRate 
            ? Math.round((progressRate * 100) / item.n_questions)
            : 0}
          % done
        </div>
      </div>
    </>)
  );
};

export default Overview;
