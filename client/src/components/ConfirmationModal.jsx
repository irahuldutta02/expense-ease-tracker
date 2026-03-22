import { useContext } from "react";
import { ConfirmationModelContext } from "../context/ContextProvider";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { cn } from "../utils/cn";

export const ConfirmationModal = () => {
  const { confirmationModel, confirmationModelData, closeConfirmationModel } =
    useContext(ConfirmationModelContext);

  if (!confirmationModel) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            confirmationModelData.onClose(null);
            closeConfirmationModel();
          }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-card border shadow-2xl rounded-[2.5rem] overflow-hidden p-8 text-center"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-500">
              <AlertCircle size={40} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Are you sure?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {confirmationModelData.question}
              </p>
            </div>

            <div className="flex w-full gap-3 mt-2">
              <button
                onClick={() => {
                  confirmationModelData.onClose(false);
                  closeConfirmationModel();
                }}
                className="flex-1 px-6 py-3 rounded-2xl bg-muted text-sm font-bold hover:bg-muted/80 transition-all active:scale-[0.98]"
              >
                {confirmationModelData.answer[1]}
              </button>
              <button
                onClick={() => {
                  confirmationModelData.onClose(true);
                  closeConfirmationModel();
                }}
                className="flex-1 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-[0.98]"
              >
                {confirmationModelData.answer[0]}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              confirmationModelData.onClose(null);
              closeConfirmationModel();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
