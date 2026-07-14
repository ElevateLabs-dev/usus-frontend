"use client";
import { useFormik } from "formik";
import Image from "next/image";
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
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import { DEFAULTS } from "@/config";
import NiCheck from "@/icons/nexture/ni-check";
import NiCross from "@/icons/nexture/ni-cross";
import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import NiEyeClose from "@/icons/nexture/ni-eye-close";
import NiEyeOpen from "@/icons/nexture/ni-eye-open";
import logo from "@/images/usus-logo.png";
import { cn } from "@/lib/utils";

const validationSchema = yup.object({
  email: yup.string().required("The field is required").email("Enter a valid email"),
  password: yup
    .string()
    .required("The field is required")
    .min(8, "Should be at least 8 characters")
    .test("uppercase", "Should be an uppercase and a lowercase letter", (value) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      return hasUpperCase && hasLowerCase;
    })
    .test("symbol", "Should be a special character", (value) => {
      const hasSymbol = /[^A-Za-z 0-9]/g.test(value);
      return hasSymbol;
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
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
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
      router.push(DEFAULTS.appRoot);
    },
    validateOnBlur: false,
    validateOnMount: false,
  });

  const isPasswordLengthValid = () => {
    return formik.values.password.length >= 8;
  };

  const isPasswordCaseValid = () => {
    const hasUpperCase = /[A-Z]/.test(formik.values.password);
    const hasLowerCase = /[a-z]/.test(formik.values.password);
    return hasUpperCase && hasLowerCase;
  };

  const isPasswordSymbolValid = () => {
    const hasSymbol = /[^A-Za-z 0-9]/g.test(formik.values.password);
    return hasSymbol;
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const isConfirmPasswordValid = () => {
    return formik.values.confirmPassword.length && formik.values.password === formik.values.confirmPassword;
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
                    Setup New Password
                  </Typography>
                  <Typography variant="body1" className="text-text-primary">
                    Set a new password to regain secure access to your account.
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
                        Password{" "}
                        {formik.touched.password && formik.errors.password && (
                          <InputErrorTooltip title={formik.errors.password} />
                        )}
                      </FormLabel>
                      <Input
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        autoComplete="off"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseUpPassword}
                            >
                              {showPassword ? (
                                <NiEyeClose size="medium" className="text-text-secondary" />
                              ) : (
                                <NiEyeOpen size="medium" className="text-text-secondary" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <Typography variant="body2" className="text-text-secondary mt-2 inline-block align-middle">
                        <span className="inline">Must be</span>
                        <span
                          className={cn(
                            "mx-1 inline-block h-4 w-4 rounded-md align-text-bottom",
                            isPasswordLengthValid()
                              ? "bg-success text-text-contrast"
                              : "bg-grey-100 text-text-secondary",
                          )}
                        >
                          {isPasswordLengthValid() ? (
                            <NiCheck size={"tiny"}></NiCheck>
                          ) : (
                            <NiCross size={"tiny"}></NiCross>
                          )}
                        </span>
                        <span className={cn("inline font-semibold", isPasswordLengthValid() && "text-success")}>
                          at least 8 characters long,{" "}
                        </span>
                        <span className="inline">must contain</span>
                        <span
                          className={cn(
                            "mx-1 inline-block h-4 w-4 rounded-md align-text-bottom",
                            isPasswordCaseValid() ? "bg-success text-text-contrast" : "bg-grey-100 text-text-secondary",
                          )}
                        >
                          {isPasswordCaseValid() ? (
                            <NiCheck size={"tiny"}></NiCheck>
                          ) : (
                            <NiCross size={"tiny"}></NiCross>
                          )}
                        </span>
                        <span className={cn("inline font-semibold", isPasswordCaseValid() && "text-success")}>
                          lowercase and uppercase letters,{" "}
                        </span>
                        <span className="inline">must have at least</span>
                        <span
                          className={cn(
                            "mx-1 inline-block h-4 w-4 rounded-md align-text-bottom",
                            isPasswordSymbolValid()
                              ? "bg-success text-text-contrast"
                              : "bg-grey-100 text-text-secondary",
                          )}
                        >
                          {isPasswordSymbolValid() ? (
                            <NiCheck size={"tiny"}></NiCheck>
                          ) : (
                            <NiCross size={"tiny"}></NiCross>
                          )}
                        </span>
                        <span className={cn("inline font-semibold", isPasswordSymbolValid() && "text-success")}>
                          one special character.
                        </span>
                      </Typography>
                    </FormControl>

                    {/* .....................PASSWORD CONFIRMATION BOX..................... */}

                    <FormControl className="outlined" variant="standard" size="small">
                      <FormLabel component="label" className="flex flex-row">
                        Confirm Password{" "}
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                          <InputErrorTooltip title={formik.errors.confirmPassword} />
                        )}
                      </FormLabel>

                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        autoComplete="off"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        type={showConfirmPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseUpPassword}
                            >
                              {showConfirmPassword ? (
                                <NiEyeClose size="medium" className="text-text-secondary" />
                              ) : (
                                <NiEyeOpen size="medium" className="text-text-secondary" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />

                      {/* MATCH STATUS UI */}
                      <Typography variant="body2" className="text-text-secondary mt-2 inline-block">
                        <span>Passwords match</span>

                        <span
                          className={cn(
                            "mx-1 inline-block h-4 w-4 rounded-md align-text-bottom",
                            isConfirmPasswordValid()
                              ? "bg-success text-text-contrast"
                              : "bg-grey-100 text-text-secondary",
                          )}
                        >
                          {isConfirmPasswordValid() ? <NiCheck size="tiny" /> : <NiCross size="tiny" />}
                        </span>
                      </Typography>
                    </FormControl>

                    {submitted && !formik.isValid && (
                      <Alert severity="error" icon={<NiCrossSquare />} className="neutral bg-background-paper/60! mb-4">
                        <AlertTitle variant="subtitle2">Please fill all the required inputs!</AlertTitle>
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
                    <Box className="mb-2 flex flex-col gap-2">
                      <Button type="submit" variant="contained">
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
