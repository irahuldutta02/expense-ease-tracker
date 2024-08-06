import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../constants";
import { setFileUploadHeader } from "../utils/setHeader";

export const FileUpload = ({ type, page, onSetFileUrl }) => {
  if (type === "single-image" && page === "profile") {
    return <SingleImageModalForm onSetFileUrl={onSetFileUrl} />;
  }

  if (type === "multiple-image" && page === "expense") {
    return <MultipleImageModalForm onSetFileUrl={onSetFileUrl} />;
  }
};

const SingleImageModalForm = ({ onSetFileUrl }) => {
  const [loading, setLoading] = useState(false);

  const fileUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected!");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("my_file", file);

    toast
      .promise(
        axios.post(BACKEND_URL + "/api/cloudinary/upload", formData, {
          headers: setFileUploadHeader(),
        }),
        {
          loading: "Uploading...",
          success: (res) => {
            onSetFileUrl(res?.data?.secure_url);
            return "File uploaded successfully!";
          },
          error: "Failed to upload file!",
        }
      )
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetForm = () => {
    document.getElementById("file_input").value = "";
  };

  return (
    <>
      <input
        className={`block p-[5px] w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        id="file_input"
        type="file"
        accept="image/*"
        disabled={loading}
        onClick={() => {
          !loading && resetForm();
        }}
        onChange={fileUpload}
      />
    </>
  );
};

const MultipleImageModalForm = ({ onSetFileUrl }) => {
  const [loading, setLoading] = useState(false);

  const fileUpload = async (e) => {
    setLoading(true);

    const files = e.target.files;
    if (files.length === 0) {
      toast.error("No files selected!");
      setLoading(false);
      return;
    }

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file!");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      toast.error("No valid image files selected!");
      setLoading(false);
      return;
    }

    const uploadPromises = validFiles.map((file) => {
      const formData = new FormData();
      formData.append("my_file", file);

      return axios.post(BACKEND_URL + "/api/cloudinary/upload", formData, {
        headers: setFileUploadHeader(),
      });
    });

    toast
      .promise(Promise.all(uploadPromises), {
        loading: "Uploading...",
        success: (responses) => {
          const urlArray = responses.map((res) => res?.data?.secure_url);
          onSetFileUrl(urlArray);
          return "All files uploaded successfully!";
        },
        error: "Failed to upload one or more files!",
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        resetForm();
      });
  };

  const resetForm = () => {
    document.getElementById("file_input").value = "";
  };

  return (
    <>
      <input
        className={`block p-[5px] w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        multiple
        id="file_input"
        type="file"
        accept="image/*"
        disabled={loading}
        onClick={() => {
          !loading && resetForm();
        }}
        onChange={fileUpload}
      />
    </>
  );
};
