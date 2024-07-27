export const setFileUploadHeader = () => {
  const { token } = JSON.parse(localStorage.getItem("userInfo"));

  if (token) {
    return {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };
  }
};
