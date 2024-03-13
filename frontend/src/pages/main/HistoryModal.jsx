import modal_bg from "../../assets/background-modal.png";
const HistoryModal = ({ onRemove, onCancel }) => {
  return (
    <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.3)] w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="bg-white w-[300px] relative rounded-xl bg-base-white shadow-[0px_20px_24px_-4px_rgba(16,_24,_40,_0.08),_0px_8px_8px_-4px_rgba(16,_24,_40,_0.03)] overflow-hidden flex flex-col items-center justify-start text-left text-[1.13rem] text-gray-900 font-text-md-semibold">
        <img
          className="w-[21rem] absolute my-0 mx-[!important] top-[0rem] left-[10.72rem] h-[21rem] z-[0]"
          alt=""
          src={modal_bg}
        />
        <div className="self-stretch flex flex-col items-center justify-start relative z-[1]">
          <div className="self-stretch flex flex-col items-start justify-start pt-[1.25rem] px-[1rem] pb-[0rem] gap-[0.75rem] z-[0]">
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEE4E2" />
              <rect
                x="4"
                y="4"
                width="48"
                height="48"
                rx="24"
                stroke="#FEF3F2"
                stroke-width="8"
              />
              <path
                d="M32 22V21.2C32 20.0799 32 19.5198 31.782 19.092C31.5903 18.7157 31.2843 18.4097 30.908 18.218C30.4802 18 29.9201 18 28.8 18H27.2C26.0799 18 25.5198 18 25.092 18.218C24.7157 18.4097 24.4097 18.7157 24.218 19.092C24 19.5198 24 20.0799 24 21.2V22M26 27.5V32.5M30 27.5V32.5M19 22H37M35 22V33.2C35 34.8802 35 35.7202 34.673 36.362C34.3854 36.9265 33.9265 37.3854 33.362 37.673C32.7202 38 31.8802 38 30.2 38H25.8C24.1198 38 23.2798 38 22.638 37.673C22.0735 37.3854 21.6146 36.9265 21.327 36.362C21 35.7202 21 34.8802 21 33.2V22"
                stroke="#D92D20"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div className="self-stretch flex flex-col items-start justify-start gap-[0.25rem]">
              <div className="self-stretch relative leading-[1.75rem] font-semibold">
                Remove from Favs
              </div>
              <div className="self-stretch relative text-[0.88rem] leading-[1.25rem] text-gray-600">
                <span>{`Are you sure you want to remove this session from your favorites ? This action `}</span>
                <b>cannot</b>
                <span> be undone.</span>
              </div>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="my-0 mx-[!important] absolute top-[0.75rem] right-[0.75rem] rounded-lg overflow-hidden flex flex-row items-center justify-center p-[0.63rem] z-[1]"
          >
            <svg
              className="w-[1.5rem] relative h-[1.5rem] overflow-hidden shrink-0"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#667085"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div className="w-[25rem] h-[1.25rem] hidden z-[2]" />
        </div>
        <div className="self-stretch flex flex-col items-start justify-start pt-[1.5rem] px-[0rem] pb-[0rem] z-[2] text-[1rem] text-base-white">
          <div className="w-[21.44rem] hidden flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[1rem] box-border"></div>
          <div className="self-stretch flex flex-col items-start justify-start pt-[0rem] px-[1rem] pb-[1rem] gap-[0.75rem]">
            <button
              onClick={onRemove}
              className="self-stretch rounded-lg bg-error-600 bg-[#D92D20] shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] overflow-hidden flex flex-row items-center justify-center py-[0.63rem] px-[1.13rem] gap-[0.5rem] border-[1px] border-solid border-error-600"
            >
              <div className="relative leading-[1.5rem] font-semibold ">
                Remove
              </div>
            </button>
            <button
              onClick={onCancel}
              className="self-stretch rounded-lg bg-base-white shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] overflow-hidden flex flex-row items-center justify-center py-[0.63rem] px-[1.13rem] gap-[0.5rem] text-gray-700 border-[1px] border-solid border-gray-300"
            >
              <div className="relative leading-[1.5rem] font-semibold">
                Cancel
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
