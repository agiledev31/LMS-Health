import { format } from "date-fns";
import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";

export default function ExamHeader({ progress, setOpenModal, isSubmitting }) {
  const [timeSpan, setTimeSpan] = useState(0);
  useEffect(() => {
    /**
     * @todo
     * Questions are not saved when creating a DP, check the DP creation in admin tab.
     *
     */

    const start_time = Date.now();
    let timer;
    timer = setInterval(() => {
      setTimeSpan(Date.now() - start_time);
    }, 100);
  }, []);
  return (
    <div className="w-[100vw] h-[100px] flex items-center border-b-2">
      <div className="w-[15vw] flex justify-center h-full items-center border-r-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
        >
          <path
            d="M34.7065 2.70034L29.3346 1.26093L24.8076 18.1559L20.7206 2.90301L15.3485 4.34243L19.7643 20.8221L8.76559 9.82343L4.83304 13.756L16.8973 25.8203L1.87319 21.7946L0.433777 27.1665L16.8495 31.5651C16.6615 30.7544 16.5621 29.9098 16.5621 29.0419C16.5621 22.8989 21.542 17.919 27.685 17.919C33.8281 17.919 38.808 22.8989 38.808 29.0419C38.808 29.9042 38.7098 30.7437 38.5242 31.5495L53.443 35.547L54.8823 30.175L38.4014 25.759L53.4265 21.733L51.987 16.3611L35.5067 20.7769L46.5054 9.77828L42.5728 5.84573L30.676 17.7426L34.7065 2.70034Z"
            fill="#FF4405"
          />
          <path
            d="M38.5085 31.6121C38.0479 33.5592 37.0756 35.3085 35.7414 36.71L46.5494 47.5181L50.482 43.5855L38.5085 31.6121Z"
            fill="#FF4405"
          />
          <path
            d="M35.6323 36.823C34.282 38.2021 32.5756 39.2312 30.6621 39.7616L34.5949 54.4391L39.9668 52.9996L35.6323 36.823Z"
            fill="#FF4405"
          />
          <path
            d="M30.4614 39.8153C29.5736 40.0435 28.6431 40.1648 27.6841 40.1648C26.6567 40.1648 25.6618 40.0255 24.7173 39.7648L20.7809 54.4556L26.1528 55.895L30.4614 39.8153Z"
            fill="#FF4405"
          />
          <path
            d="M24.5274 39.7106C22.6431 39.1539 20.967 38.1116 19.6443 36.7285L8.80972 47.5632L12.7423 51.4957L24.5274 39.7106Z"
            fill="#FF4405"
          />
          <path
            d="M19.555 36.6328C18.255 35.241 17.3081 33.5151 16.8573 31.598L1.88983 35.6085L3.32924 40.9804L19.555 36.6328Z"
            fill="#FF4405"
          />
        </svg>
      </div>
      <div className="h-full flex items-center  ml-auto mr-5">
        <span className="inline-flex items-center font-semibold rounded-full bg-[#D4E7FB] px-5 py-1 text-[14px] font-medium text-[#203772] border border-[#203772] ">
          Progression: {parseInt(progress)}%
        </span>
      </div>
      <div className="h-full flex items-center ml-12 mr-5">
        <span>Durée: {format(timeSpan, "mm:ss")}</span>
      </div>
      <div
        className="bg-[#E2959A] h-full w-[12vw] flex items-center justify-center ml-12 cursor-pointer"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <span className="text-white font-semibold">
          {isSubmitting ? <Spinner small center /> : "Terminer"}
        </span>
      </div>
    </div>
  );
}
