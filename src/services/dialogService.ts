type DialogType = "alert" | "confirm" | "prompt";
export type DialogVariant = "primary" | "danger";

export interface DialogState {
  isOpen: boolean;
  type: DialogType;
  message: string;
  defaultValue?: string;
  variant?: DialogVariant;
  resolve: (value: any) => void;
}

let listeners: ((state: DialogState) => void)[] = [];

let currentState: DialogState = {
  isOpen: false,
  type: "alert",
  message: "",
  variant: "primary",
  resolve: () => {},
};

export const dialogService = {
  subscribe: (listener: (state: DialogState) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  _notify: () => {
    listeners.forEach((listener) => listener(currentState));
  },
  alert: (message: string): Promise<void> => {
    return new Promise((resolve) => {
      currentState = {
        isOpen: true,
        type: "alert",
        message,
        resolve: () => {
          resolve();
          dialogService.close();
        },
      };
      dialogService._notify();
    });
  },
  confirm: (message: string, variant: DialogVariant = "primary"): Promise<boolean> => {
    return new Promise((resolve) => {
      currentState = {
        isOpen: true,
        type: "confirm",
        message,
        variant,
        resolve: (value: boolean) => {
          resolve(value);
          dialogService.close();
        },
      };
      dialogService._notify();
    });
  },
  prompt: (message: string, defaultValue?: string): Promise<string | null> => {
    return new Promise((resolve) => {
      currentState = {
        isOpen: true,
        type: "prompt",
        message,
        defaultValue,
        resolve: (value: string | null) => {
          resolve(value);
          dialogService.close();
        },
      };
      dialogService._notify();
    });
  },
  close: () => {
    currentState = { ...currentState, isOpen: false };
    dialogService._notify();
  },
};
