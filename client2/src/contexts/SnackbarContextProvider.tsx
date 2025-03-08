import { ReactNode } from "react";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { IoIosClose } from "react-icons/io";

const SnackbarContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3500}
            action={(snackbarId) => (
                <button onClick={() => closeSnackbar(snackbarId)}>
                    <IoIosClose size={20} />
                </button>
            )}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            {children}
        </SnackbarProvider>
    );
}

export default SnackbarContextProvider;
