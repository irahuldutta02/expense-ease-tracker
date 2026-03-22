import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "../utils/cn";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../constants";

export const FileUpload = ({ onSetFileUrl, type, page }) => {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const uploadFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("my_file", file);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/cloudinary/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (res.status === 200) {
        onSetFileUrl(type === "multiple-image" ? [res.data.secure_url] : res.data.secure_url);
        toast.success("File uploaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload-input"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all duration-300",
          dragActive 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-muted-foreground/20 bg-muted/30 hover:bg-muted/50 hover:border-primary/50"
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground italic">Uploading to cloud...</p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-2 transition-transform group-hover:scale-110">
                <Upload size={24} />
              </div>
              <p className="mb-1 text-sm text-foreground font-bold">
                Click or drag & drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or SVG (MAX. 2MB)
              </p>
            </>
          )}
        </div>
        <input
          id="file-upload-input"
          name="file-upload-input"
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*"
          disabled={loading}
        />
      </label>
    </div>
  );
};
