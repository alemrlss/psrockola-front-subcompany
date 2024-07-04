import { Card, CardContent, Typography, Grid } from "@mui/material";

function ReproductionsForScreen({ data }) {
  const { screen, screenReproductions } = data;

  return (
    <Card className="max-w-md mx-auto border border-gray-300 shadow-md rounded-lg">
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          className="text-xl font-semibold mb-2"
        >
          {screen.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" className="mb-4">
          Code: {screen.code}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" className="font-semibold">
              Reproductions:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" className="font-semibold" sx={{
                fontWeight: "bold",
            }}>
              {screenReproductions}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ReproductionsForScreen;
