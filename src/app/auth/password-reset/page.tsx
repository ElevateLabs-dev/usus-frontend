"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Box, Button, Divider, FormControl, FormLabel, Input, Paper, Typography } from "@mui/material";

import ThemeImage from "@/components/theme-image/themeimage";
import { DEFAULTS } from "@/config";
import logoDark from "@/images/usus-logo-dark.png";
import logoLight from "@/images/usus-logo-light.png";

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(DEFAULTS.appRoot);
  };

  return (
    <>
      <Box className="bg-waves flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4">
        <Paper elevation={3} className="bg-background-paper shadow-darker-xs w-lg max-w-full rounded-4xl py-14">
          <Box className="flex flex-col gap-4 px-8 sm:px-14">
            <Box className="flex flex-col">
              <Box className="mb-14 flex justify-center">
                <ThemeImage lightSrc={logoDark} darkSrc={logoLight} alt="Usus-Logo" width={150} height={50} />{" "}
              </Box>

              <Box className="flex flex-col gap-10">
                <Box className="flex flex-col">
                  <Typography variant="h1" component="h1" className="mb-2">
                    Reset Password
                  </Typography>
                  <Typography variant="body1" className="text-text-primary">
                    Get an email about how to reset your password securely.
                  </Typography>
                </Box>

                <Box className="flex flex-col gap-5">
                  <Box component={"form"} onSubmit={handleSubmit} className="flex flex-col">
                    <FormControl className="outlined" variant="standard" size="small">
                      <FormLabel component="label">Email</FormLabel>
                      <Input
                        placeholder=""
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                      />
                    </FormControl>

                    <Box className="flex flex-col gap-2">
                      <Button type="submit" variant="contained" className="mb-4">
                        Continue
                      </Button>
                    </Box>

                    <Typography variant="body2" className="text-text-secondary">
                      By clicking Continue, you agree to the{" "}
                      <Link
                        target="_blank"
                        href="/auth/terms-and-conditions"
                        className="link-primary link-underline-hover"
                      >
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link target="_blank" href="/auth/privacy-policy" className="link-primary link-underline-hover">
                        Privacy Policy
                      </Link>
                      .
                    </Typography>
                  </Box>
                </Box>
                <Divider className="text-text-secondary my-0 text-sm"></Divider>
                <Box className="flex flex-col">
                  <Typography variant="h6" component="h6">
                    Sign in
                  </Typography>
                  <Typography variant="body1" className="text-text-secondary">
                    If you already have an account, please{" "}
                    <Link href="/auth/sign-in" className="link-primary link-underline-hover">
                      sign in
                    </Link>
                    .
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box display="flex" justifyContent="center" gap={12} mt={4} mb={4}>
        <Link href="/about" className="link-text-secondary link-underline-hover">
          About
        </Link>
        <Link href="/faq" className="link-text-secondary link-underline-hover">
          FAQ
        </Link>
        <Link href="/support" className="link-text-secondary link-underline-hover">
          Support
        </Link>
      </Box>
    </>
  );
}
