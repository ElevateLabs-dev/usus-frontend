"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Alert, AlertTitle, Box, Button, Divider, Paper, Typography } from "@mui/material";

import NiCheckSquare from "@/icons/nexture/ni-check-square";
import logo from "@/images/usus-logo.png";

export default function Page() {
  const openGmail = () => {
    window.open("https://mail.google.com/", "_blank");
  };

  return (
    <>
      <Box className="bg-waves flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4">
        <Paper elevation={3} className="bg-background-paper shadow-darker-xs w-lg max-w-full rounded-4xl py-14">
          <Box className="flex flex-col gap-4 px-8 sm:px-14">
            <Box className="flex flex-col">
              <Box className="mb-14 flex justify-center">
                <Image src={logo} alt="USUS Logo" width={100} height={100} placeholder="blur" blurDataURL="..." />
              </Box>

              <Box className="flex flex-col gap-10">
                <Box className="flex flex-col">
                  <Typography variant="h1" component="h1" className="mb-2">
                    Check your inbox
                  </Typography>
                  <Typography variant="body1" className="text-text-primary">
                    We sent a verification link to james@gotechgh.com, Click the link to activate your workspace and
                    continue setup
                  </Typography>
                </Box>

                <Alert severity="success" icon={<NiCheckSquare />} className="neutral bg-background-paper/60!">
                  <AlertTitle variant="subtitle2">Didn't get it?</AlertTitle>
                  Check your spam folder, and make sure you used work email address.
                </Alert>

                <Box className="flex flex-col gap-2">
                  <Button type="button" variant="contained" onClick={openGmail}>
                    Open Email App
                  </Button>
                </Box>

                <Typography variant="body2" className="text-text-secondary text-center">
                  Didn't receive it?{" "}
                  <Link target="_blank" href="#" className="link-primary link-underline-hover">
                    Resend verification email
                  </Link>
                </Typography>

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

      <Box display="flex" justifyContent="center" gap={12} mt={3} mb={3}>
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
