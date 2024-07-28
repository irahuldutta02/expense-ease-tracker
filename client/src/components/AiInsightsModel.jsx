import { FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGetInsightQuery } from "../redux/insightApiSlice";
import { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import useTypingEffect from "../hooks/useTypingEffect";

export const AiInsightsModel = ({ startDate, endDate, onCloseModel }) => {
  const formatDate = (date) => {
    return date.split("-").reverse().join("-");
  };

  const { data, isLoading, isError, refetch } = useGetInsightQuery({
    formDate: formatDate(startDate),
    toDate: formatDate(endDate),
  });

  const [fullText, setFullText] = useState("");
  const displayedText = useTypingEffect(fullText);

  useEffect(() => {
    if (data?.insights) {
      setFullText(data.insights);
    }
  }, [data]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-50"
        onClick={onCloseModel}
      ></div>
      <div
        id="close-model"
        className="fixed inset-0 flex justify-center items-start sm:m-4 sm:rounded-lg overflow-auto z-50"
        onClick={(e) => {
          if (e.target.id === "close-model") {
            onCloseModel();
          }
        }}
      >
        <div className="w-full">
          <div className="bg-white sm:rounded-lg shadow dark:bg-gray-700 min-h-screen sm:min-h-[95vh]">
            {/* header */}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 w-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Insights
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="editUserModal"
                onClick={onCloseModel}
              >
                <FaTimes size={20} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* body */}
            <div className="p-6 h-[80vh] space-y-6 w-full overflow-y-auto">
              {isLoading && (
                <>
                  <div className="flex justify-center items-center flex-col gap-8 w-full p-4">
                    <ThreeDots
                      height="80"
                      width="80"
                      radius="9"
                      color="#4fa94d"
                      ariaLabel="three-dots-loading"
                      visible={true}
                    />
                    <p>
                      Analyzing data for the selected period. Please wait...
                    </p>
                  </div>
                </>
              )}
              {isError && (
                <>
                  <div className="flex justify-start items-center flex-col gap-8 w-full p-4">
                    <h1 className="text-3xl font-bold dark:text-white">
                      Page Not Found
                    </h1>
                    <div className="flex justify-center items-center gap-4">
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400"
                        onClick={refetch}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </>
              )}
              {!isLoading && !isError && data && data.insights && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="markdown"
                  components={{
                    table: ({ ...props }) => (
                      <table
                        className="min-w-full bg-white dark:bg-gray-800"
                        {...props}
                      />
                    ),
                    th: ({ ...props }) => (
                      <th
                        className="px-4 py-2 border-b bg-gray-50 dark:bg-gray-700 dark:text-white"
                        {...props}
                      />
                    ),
                    td: ({ ...props }) => (
                      <td
                        className="px-4 py-2 border-b dark:bg-gray-800 dark:text-white"
                        {...props}
                      />
                    ),
                  }}
                >
                  {displayedText}
                </ReactMarkdown>
              )}
            </div>
            {/* footer */}
            <div className="flex justify-center items-center p-4 border-t rounded-b dark:border-gray-600 w-full">
              <p>
                Powered by{" "}
                <a
                  href="https://gemini.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Google Gemini
                </a>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
