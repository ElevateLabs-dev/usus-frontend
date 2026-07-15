"use client";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as yup from "yup";

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  capitalize,
  FormControl,
  FormLabel,
  Input,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import ThemeImage from "@/components/theme-image/themeimage";
import { DEFAULTS } from "@/config";
import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import logoDark from "@/images/usus-logo-dark.png";
import logoLight from "@/images/usus-logo-light.png";

const validationSchema = yup.object({
  email: yup.string().required("The field is required").email("Enter a valid email"),
});

type InputErrorProps = {
  title: string;
};

const InputErrorTooltip = ({ title }: InputErrorProps) => {
  return (
    <Box className="relative">
      <Tooltip title={title} arrow className="absolute -top-1.5">
        <Button
          startIcon={<NiCrossSquare size="small" />}
          color="error"
          size="small"
          className="group icon-only bg-transparent! outline-0!"
        ></Button>
      </Tooltip>
    </Box>
  );
};

export default function Page() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
      router.push(DEFAULTS.appRoot);
    },
    validateOnBlur: false,
    validateOnMount: false,
  });

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
                    Single Sign-On
                  </Typography>
                  <Typography variant="body1" className="text-text-primary">
                    Enter your company email address
                  </Typography>
                </Box>

                <Box className="flex flex-col gap-5">
                  <Box
                    component={"form"}
                    onSubmit={(event) => {
                      setSubmitted(true);
                      formik.handleSubmit(event);
                    }}
                    className="flex flex-col"
                  >
                    <FormControl className="outlined" variant="standard" size="small">
                      <FormLabel component="label" className="flex flex-row">
                        Work Email{" "}
                        {formik.touched.email && formik.errors.email && (
                          <InputErrorTooltip title={formik.errors.email} />
                        )}
                      </FormLabel>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Enter company email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </FormControl>

                    {submitted && !formik.isValid && (
                      <Alert severity="error" icon={<NiCrossSquare />} className="neutral bg-background-paper/60! mb-4">
                        <AlertTitle variant="subtitle2">Please input your email!</AlertTitle>
                        {Object.entries(formik.errors).map(([key, value]) => {
                          return (
                            <Box className="flex flex-row gap-0.5" key={crypto.randomUUID()}>
                              <Typography variant="body2" className="text-error">
                                {capitalize(key)}:
                              </Typography>
                              <Typography variant="body2" className="text-text-primary">
                                {value}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Alert>
                    )}
                    <Box className="flex flex-col gap-2">
                      <Button type="submit" variant="contained">
                        Single Sign-on
                      </Button>
                    </Box>
                  </Box>
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
