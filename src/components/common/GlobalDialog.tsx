import { useEffect, useState, useRef } from "react";
import { dialogService, type DialogState } from "@/services/dialogService";

export const GlobalDialog = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: "alert",
    message: "",
    resolve: () => {},
  });
  
  const [inputValue, setInputValue] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const unsubscribe = dialogService.subscribe((state) => {
      setDialogState(state);
      if (state.isOpen) {
        if (state.type === "prompt") {
          setInputValue(state.defaultValue || "");
        }
        dialogRef.current?.showModal();
      } else {
        dialogRef.current?.close();
      }
    });
    return unsubscribe;
  }, []);

  const handleConfirm = () => {
    if (dialogState.type === "prompt") {
      dialogState.resolve(inputValue);
    } else {
      dialogState.resolve(true);
    }
  };

  const handleCancel = () => {
    if (dialogState.type === "prompt") {
      dialogState.resolve(null);
    } else if (dialogState.type === "confirm") {
      dialogState.resolve(false);
    } else {
      dialogState.resolve(undefined);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="p-0 bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-sm focus:outline-none w-[90%] max-w-md m-auto rounded-xl shadow-2xl"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        handleCancel();
      }}
    >
      {dialogState.isOpen && (
        <div className="card-surface p-6 flex flex-col gap-4">
          <h3 className={`text-h3 ${dialogState.variant === "danger" ? "text-red-700 font-black" : "text-slate-800"}`}>
            {dialogState.type === "alert"
              ? "Thông báo"
              : dialogState.type === "confirm"
                ? "Xác nhận"
                : "Nhập thông tin"}
          </h3>
          
          <p className="text-body text-slate-600 whitespace-pre-wrap">{dialogState.message}</p>
          
          {dialogState.type === "prompt" && (
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-body"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
              autoFocus
            />
          )}
          
          <div className="flex justify-end gap-3 mt-4">
            {dialogState.type !== "alert" && (
              <button
                className="btn-outline px-4 py-2"
                onClick={handleCancel}
                autoFocus={dialogState.variant === "danger"}
              >
                Hủy
              </button>
            )}
            <button
              className={`${dialogState.variant === "danger" ? "btn-outline-danger" : "btn-primary"} px-4 py-2`}
              onClick={handleConfirm}
              autoFocus={dialogState.type !== "prompt" && dialogState.variant !== "danger"}
            >
              {dialogState.type === "alert" ? "Đóng" : "Xác nhận"}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};
