import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit3, Trash2, Search, Loader2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

export const SimpleManagementPage = ({
  title,
  data,
  isLoading,
  isError,
  refetch,
  createMutation,
  updateMutation,
  deleteMutation,
  placeholder = "Enter name...",
  openConfirmationModel
}) => {
  const [inputName, setInputName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [createAction, { isLoading: isCreating }] = createMutation();
  const [updateAction, { isLoading: isUpdating }] = updateMutation();
  const [deleteAction, { isLoading: isDeleting }] = deleteMutation();

  const filteredData = data
    ?.filter(item => item.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.Name.localeCompare(b.Name)) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputName.trim()) {
      toast.error("Name is required!");
      return;
    }

    if (isEditing) {
      openConfirmationModel({
        question: `Update this ${title.slice(0, -1).toLowerCase()}?`,
        answer: ["Update", "Cancel"],
        onClose: async (result) => {
          if (result) {
            try {
              await updateAction({ id: editItem._id, data: { name: inputName } }).unwrap();
              toast.success("Updated successfully!");
              resetForm();
              refetch();
            } catch (err) {
              toast.error(err?.data?.message || "Update failed");
            }
          }
        },
      });
    } else {
      try {
        await createAction({ name: inputName }).unwrap();
        toast.success("Added successfully!");
        setInputName("");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to add");
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditItem(null);
    setInputName("");
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditItem(item);
    setInputName(item.Name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (item) => {
    openConfirmationModel({
      question: `Delete this ${title.slice(0, -1).toLowerCase()}?`,
      answer: ["Delete", "Cancel"],
      onClose: async (result) => {
        if (result) {
          try {
            await deleteAction(item._id).unwrap();
            toast.success("Deleted successfully!");
            refetch();
          } catch (err) {
            toast.error(err?.data?.message || "Delete failed");
          }
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          <p className="text-muted-foreground">Manage your {title.toLowerCase()} for better tracking</p>
        </div>
      </div>

      {/* Input Section */}
      <motion.div 
        layout
        className="bg-card border shadow-xl shadow-primary/5 rounded-[2.5rem] p-8"
      >
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder={placeholder}
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full pl-6 pr-4 py-4 bg-muted/50 border rounded-2xl text-lg font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg text-muted-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className={cn(
              "flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50",
              isEditing ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            )}
          >
            {isCreating || isUpdating ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isEditing ? (
              <>Save Changes</>
            ) : (
              <><Plus size={20} /> Add New</>
            )}
          </button>
        </form>
      </motion.div>

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Current {title} ({filteredData.length})
          </h2>
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-12 bg-card border border-dashed rounded-[2rem]">
            <AlertCircle size={40} className="text-destructive mb-2" />
            <p className="text-destructive font-bold">Failed to load data</p>
            <button onClick={refetch} className="mt-4 text-sm font-bold text-primary hover:underline">Try Again</button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center p-20 bg-muted/20 border border-dashed rounded-[2rem]">
            <p className="text-muted-foreground font-medium italic">No {title.toLowerCase()} found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex items-center justify-between p-4 bg-card border rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all hover:border-primary/30"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {idx + 1}
                    </span>
                    <span className="text-lg font-bold tracking-tight">{item.Name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 rounded-xl text-blue-500 hover:bg-blue-500/10 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
