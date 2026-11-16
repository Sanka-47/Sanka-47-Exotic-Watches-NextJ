"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  type AlertColor,
} from "@mui/material";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  destructive?: boolean;
}

interface FeedbackContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  notify: (message: string, severity?: AlertColor) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmOptions | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: AlertColor } | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setDialog(options);
    });
  }, []);

  const closeDialog = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setDialog(null);
  }, []);

  const notify = useCallback((message: string, severity: AlertColor = "success") => {
    setToast({ message, severity });
  }, []);

  const value = useMemo(() => ({ confirm, notify }), [confirm, notify]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      <Dialog open={Boolean(dialog)} onClose={() => closeDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{dialog?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialog?.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog(false)}>Cancel</Button>
          <Button
            onClick={() => closeDialog(true)}
            variant="contained"
            color={dialog?.destructive ? "error" : "primary"}
            autoFocus
          >
            {dialog?.confirmLabel ?? "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast?.severity ?? "success"} onClose={() => setToast(null)} variant="filled">
          {toast?.message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used inside a FeedbackProvider");
  }
  return context;
}
