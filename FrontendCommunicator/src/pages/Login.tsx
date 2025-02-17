import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { useAuthServiceContext } from "../context/AuthContext.tsx";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

const Login = () => {
    const { login } = useAuthServiceContext();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validate: (values) => {
            const errors: Partial<typeof values> = {};
            if (!values.username) {
                errors.username = "Username is required";
            }
            if (!values.password) {
                errors.password = "Password is required";
            }
            return errors;
        },
        onSubmit: async (values) => {
            const { username, password } = values;
            const status = await login(username, password);
            if (status === 401) {
                console.log("Not authorized");
                formik.setErrors({
                    username: "Invalid username or password",
                    password: "Invalid username or password",
                });
            } else {
                navigate("/");
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 500, pb: 2 }}>
                    Log in
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>Log in to your account.
                    <TextField
                        autoFocus
                        fullWidth
                        id="username"
                        name="username"
                        label="Username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={!!formik.touched.username && !!formik.errors.username}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={!!formik.touched.password && !!formik.errors.password}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Button
                        variant="contained"
                        disableElevation
                        type="submit"
                        sx={{
                            mt: 2,
                            mb: 2,
                            backgroundColor: "gray",
                            color: "white",
                            width: "100%",
                        }}
                    >
                        Login
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don’t have an account?{" "}
                        <Link to="/signup">
                            Sign up here
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
