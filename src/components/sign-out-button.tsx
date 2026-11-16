import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "@/lib/actions/auth";

export const SignOutButton = () => {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="outlined"
        color="error"
        size="small"
        startIcon={<LogoutIcon />}
        sx={{ textTransform: "none", whiteSpace: "nowrap" }}
      >
        Sign out
      </Button>
    </form>
  );
};
