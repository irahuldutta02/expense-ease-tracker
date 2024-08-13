import { FaTimes } from "react-icons/fa";

export const ImageModel = ({ showImageModel, closeImageModel, images }) => {
  return (
    <>
      {/* add expense modal */}
      {showImageModel && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50"></div>
          <div
            id="close-model"
            className="fixed inset-0 flex justify-center items-start sm:items-center sm:m-4 overflow-y-auto sm:overflow-hidden z-50"
          >
            <div className="w-full max-w-6xl">
              {/* <!-- Modal content --> */}
              <div className="relative bg-white sm:rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Attachments
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="editUserModal"
                    onClick={closeImageModel}
                  >
                    <FaTimes size={20} />
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className="p-4 sm:max-h-[70vh] overflow-y-auto">
                  <div className="flex justify-center items-center gap-4 flex-col">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center gap-4 border border-gray-300 rounded-lg p-2 dark:border-gray-600 cursor-pointer"
                        onClick={() => {
                          window.open(image);
                        }}
                      >
                        <img
                          src={image}
                          alt="Attachment"
                          className="rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* <!-- Modal footer --> */}
                <div className="flex justify-center gap-4 items-center p-8 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
