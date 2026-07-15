import Link from "next/link";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import NiArrowHistory from "@/icons/nexture/ni-arrow-history";
import NiBrushArt from "@/icons/nexture/ni-brush-art";
import NiDrop from "@/icons/nexture/ni-drop";
import NiGraduation from "@/icons/nexture/ni-graduation";
import NiPath from "@/icons/nexture/ni-path";
import NiPine from "@/icons/nexture/ni-pine";

export default function DashboardLearningLevels() {
  return (
    <>
      <Grid container className="w-full" spacing={2.5}>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Card component={Link} href="#" className="flex flex-col p-1 transition-transform hover:scale-[1.02]">
            <Box className="bg-primary-light/10 flex h-[5.65rem] w-full flex-none items-center justify-center rounded-2xl">
              <NiPine className="text-primary" size={"large"} />
            </Box>
            <CardContent>
              <Typography variant="body1" className="text-text-secondary text-center leading-5 transition-colors">
                Tree Guardian
              </Typography>
              <Typography variant="h5" className="text-leading-5 text-center">
                6/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Card component={Link} href="#" className="flex flex-col p-1 transition-transform hover:scale-[1.02]">
            <Box className="bg-primary-light/10 flex h-[5.65rem] w-full flex-none items-center justify-center rounded-2xl">
              <NiDrop className="text-primary" size={"large"} />
            </Box>
            <CardContent>
              <Typography variant="body1" className="text-text-secondary text-center leading-5 transition-colors">
                Eco Toy Designer
              </Typography>
              <Typography variant="h5" className="text-leading-5 text-center">
                3/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Card component={Link} href="#" className="flex flex-col p-1 transition-transform hover:scale-[1.02]">
            <Box className="bg-primary-light/10 flex h-[5.65rem] w-full flex-none items-center justify-center rounded-2xl">
              <NiArrowHistory className="text-primary" size={"large"} />
            </Box>
            <CardContent>
              <Typography variant="body1" className="text-text-secondary text-center leading-5 transition-colors">
                Legacy Builder
              </Typography>
              <Typography variant="h5" className="text-leading-5 text-center">
                7/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Card component={Link} href="#" className="flex flex-col p-1 transition-transform hover:scale-[1.02]">
            <Box className="bg-secondary-light/10 flex h-[5.65rem] w-full flex-none items-center justify-center rounded-2xl">
              <NiPath className="text-secondary" size={"large"} />
            </Box>
            <CardContent>
              <Typography variant="body1" className="text-text-secondary text-center leading-5 transition-colors">
                Blueprint Builder
              </Typography>
              <Typography variant="h5" className="text-leading-5 text-center">
                3/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Card component={Link} href="#" className="flex flex-col p-1 transition-transform hover:scale-[1.02]">
            <Box className="bg-secondary-light/10 flex h-[5.65rem] w-full flex-none items-center justify-center rounded-2xl">
              <NiGraduation className="text-secondary" size={"large"} />
            </Box>
            <CardContent>
              <Typography variant="body1" className="text-text-secondary text-center leading-5 transition-colors">
                Eco Educator
              </Typography>
              <Typography variant="h5" className="text-leading-5 text-center">
                2/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Card component={Link} href="#" className="flex flex-col p-1 transition-transform hover:scale-[1.02]">
            <Box className="bg-secondary-light/10 flex h-[5.65rem] w-full flex-none items-center justify-center rounded-2xl">
              <NiBrushArt className="text-secondary" size={"large"} />
            </Box>
            <CardContent>
              <Typography variant="body1" className="text-text-secondary text-center leading-5 transition-colors">
                Sustainable Artisan
              </Typography>
              <Typography variant="h5" className="text-leading-5 text-center">
                4/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
