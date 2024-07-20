import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { loginSubcompany } from "../../features/authSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function LoginSubcompany() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English

  const dispatch = useDispatch();
  const goTo = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const userLanguages = navigator.languages;
    const supportedLanguages = ["es", "en", "pt"];

    const foundLanguage = userLanguages.find((language) =>
      supportedLanguages.includes(language.split("-")[0])
    );

    if (foundLanguage) {
      setSelectedLanguage(foundLanguage.split("-")[0]);
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "auth/clearError" });
  }, [dispatch]);

  const handleInputChange = (e) => {
    setError("");
    dispatch({ type: "auth/clearError" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError(translations[selectedLanguage].completeFields);
      return;
    }

    if (!validateEmail(formData.email) || formData.password.length < 8) {
      setError(translations[selectedLanguage].invalidEmailOrPassword);
      return;
    }

    setLoading(true); // Establece el estado de carga en verdadero antes de la petición

    try {
      const result = await dispatch(loginSubcompany(formData));
      if (result.payload && result.payload.token) {
        goTo("/subcompanies/dashboard");
      }
    } catch (error) {
      // Manejar errores de inicio de sesión
    } finally {
      setLoading(false); // Establece el estado de carga en falso después de la petición
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const translations = {
    en: {
      login: "Log in",
      signIn: "Sign in as a subcompany",
      email: "Email",
      password: "Password",
      submit: "Log in",
      loading: "Loading...",
      completeFields: "Please complete all fields.",
      invalidEmailOrPassword: "Invalid email or password.",
      forgotPassword: "Forgot Password?",
    },
    es: {
      login: "Iniciar sesión",
      signIn: "Iniciar sesión como subempresa",
      email: "Correo electrónico",
      password: "Contraseña",
      submit: "Iniciar sesión",
      loading: "Cargando...",
      completeFields: "Por favor, complete todos los campos.",
      invalidEmailOrPassword: "Correo electrónico o contraseña inválidos.",
      forgotPassword: "¿Olvidó su contraseña?",
    },
    pt: {
      login: "Entrar",
      signIn: "Entrar como subempresa",
      email: "E-mail",
      password: "Senha",
      submit: "Entrar",
      loading: "Carregando...",
      completeFields: "Por favor, preencha todos os campos.",
      invalidEmailOrPassword: "E-mail ou senha inválidos.",
      forgotPassword: "Esqueceu a senha?",
    },
  };

  const currentTranslations = translations[selectedLanguage];

  return (
    <div
      style={{ position: "relative", height: "100vh" }}
      className="bg-[#E5AFF4]"
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100%" }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-xl p-4 py-8"
          >
            <Typography variant="h4" align="center" gutterBottom>
              {currentTranslations.login}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {currentTranslations.signIn}
            </Typography>

            <TextField
              id="email"
              name="email"
              type="email"
              label={currentTranslations.email}
              variant="outlined"
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              id="password"
              name="password"
              onChange={handleInputChange}
              label={currentTranslations.password}
              variant="outlined"
              fullWidth
              size="small"
              margin="normal"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "12px",
                backgroundColor: "#555CB3",
                "&:hover": {
                  backgroundColor: "#555CB3",
                },
              }}
              disabled={loading} // Desactivar el botón mientras se realiza la petición
            >
              {loading
                ? currentTranslations.loading
                : currentTranslations.submit}
            </Button>
            {auth.status === "failed" && (
              <Typography
                variant="body2"
                color="error"
                style={{ marginTop: "16px" }}
                sx={{ marginTop: "12px", fontWeight: "bold", color: "red" }}
              >
                {auth.error}
              </Typography>
            )}
            {error && (
              <Typography
                variant="body2"
                color="error"
                gutterBottom
                sx={{ marginTop: "12px", fontWeight: "bold" }}
              >
                {error}
              </Typography>
            )}
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginSubcompany;
