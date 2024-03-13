import Session from "./Session";
import { Spinner } from "../../icons/Spinner";
import { useData } from "../../../providers/learningDataProvider";

export default function Sessions() {
  const { isLoading, sessions } = useData();

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      {isLoading ? (
        <div
          role="status"
          className="h-[70vh] pb-20 flex justify-center items-center"
        >
          <Spinner />
        </div>
      ) : (
        <div className="inline-block min-w-full align-middle">
          <div className="flex justify-between"></div>
          {sessions.map((session, index) => (
            <Session
              key={index}
              index={index}
              session={session}
            />
          ))}
        </div>
      )}
    </div>
  );
}
