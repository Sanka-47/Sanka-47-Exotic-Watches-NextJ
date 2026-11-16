import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { login } from "@/lib/actions/auth";

export const SignInButton = () => {
  return (
    <form action={login}>
      <Button
        type="submit"
        variant="contained"
        startIcon={<GoogleIcon />}
        sx={{ textTransform: "none" }}
      >
        Sign in with Google
      </Button>
    </form>
  );
};
