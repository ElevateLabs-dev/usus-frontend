"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import ThemeImage from "@/components/theme-image/themeimage";
import { DEFAULTS } from "@/config";
import { RadiobuttonSmallChecked, RadiobuttonSmallEmptyOutlined } from "@/icons/form/mui-radiobutton";
import logoDark from "@/images/usus-logo-dark.png";
import logoLight from "@/images/usus-logo-light.png";

export default function Page() {
  const router = useRouter();

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
                    Verification
                  </Typography>
                  <Typography variant="body1" className="text-text-primary">
                    Please select how do you want to get the verification code.
                  </Typography>
                </Box>

                <Box className="flex flex-col gap-5">
                  <Box component={"form"} onSubmit={handleSubmit} className="flex flex-col">
                    <RadioGroup name="row-radio-buttons-group">
                      <FormControl className="mb-2">
                        <FormControlLabel
                          value="phone"
                          control={
                            <Radio
                              size="small"
                              icon={<RadiobuttonSmallEmptyOutlined />}
                              checkedIcon={<RadiobuttonSmallChecked />}
                            />
                          }
                          label="Send to my phone number: ****8714"
                        />
                      </FormControl>
                      <FormControl className="mb-2">
                        <FormControlLabel
                          value="email"
                          control={
                            <Radio
                              size="small"
                              icon={<RadiobuttonSmallEmptyOutlined />}
                              checkedIcon={<RadiobuttonSmallChecked />}
                            />
                          }
                          label="Send to my email address: ne****@gmail.com"
                        />
                      </FormControl>
                    </RadioGroup>

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
                    Already have the code?
                  </Typography>
                  <Typography variant="body1" className="text-text-secondary">
                    If you have the code, please{" "}
                    <Link href="/auth/set-verification" className="link-primary link-underline-hover">
                      submit
                    </Link>{" "}
                    here.
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
