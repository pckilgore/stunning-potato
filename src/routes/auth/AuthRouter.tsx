import React from "react";
import cn from "clsx";
import { Route, Routes } from "react-router-dom";
import { Dialog } from "@headlessui/react";

import { noop } from "../../utils/function";

import { ForgotPassword } from "./ForgotPassword";
import { Login } from "./Login";
import { Logo } from "../../components/Logo";
import { Register } from "./Register";
import { RegisterVerify } from "./RegisterVerify";
import { RegisterSuccess } from "./RegisterSuccess";
import { RegisterProfile } from "./RegisterProfile";
import { ResetPassword } from "./ResetPassword";
import { OAuthLanding } from "./OAuthLanding";
import { Logout } from "./Logout";
import { Text } from "../../design/Text";
import { TwoToneHeading } from "../../components/TwoToneHeading";

export default function AuthRouter() {
  /* Auth Routing is controlled by the state machine not the url. */

  return (
    <Routes>
      <Route
        path={`/oauth`}
        element={
          <AuthModal
            Heading={
              <TwoToneHeading
                primary="Welcome back! Logging in"
                secondary="with social"
              />
            }
            Right={<OAuthLanding />}
          />
        }
      />
      <Route path="/logout" element={<Logout />} />
      <Route
        path="/forgot-password"
        element={
          <AuthContainer>
            <ForgotPassword />
          </AuthContainer>
        }
      />
      <Route
        path="/reset-password"
        element={
          <AuthContainer>
            <ResetPassword />
          </AuthContainer>
        }
      />
      <Route
        path={`/login`}
        element={
          <AuthModal
            Heading={
              <TwoToneHeading
                primary="Welcome back! Login to"
                secondary="your profile"
              />
            }
            Right={<Login />}
          />
        }
      />
      <Route
        path={`/register`}
        element={
          <AuthModal
            Right={<Register />}
            Heading={
              <TwoToneHeading
                primary="Welcome to app! Great time"
                secondary="to create a profile"
              />
            }
          />
        }
      />
      <Route
        path="/register/verify"
        element={
          <AuthModal
            Right={<RegisterVerify />}
            Heading={
              <TwoToneHeading primary="Please confirm" secondary="your email" />
            }
          />
        }
      />
      <Route
        path="/register/success"
        element={
          <AuthModal
            Right={<RegisterSuccess />}
            Heading={
              <TwoToneHeading
                primary="Welcome to app! Great time"
                secondary="to be confirmed"
              />
            }
          />
        }
      />
      <Route
        path="/register/profile"
        element={
          <AuthModal
            Right={<RegisterProfile />}
            Heading={
              <TwoToneHeading primary="Set up" secondary="your profile" />
            }
          />
        }
      />
    </Routes>
  );
}

type LayoutProps = {
  Heading: React.ReactNode;
  Right: React.ReactNode;
};

export function AuthModal({ Heading, Right }: LayoutProps) {
  return (
    <AuthContainer className="w-full max-w-4xl">
      <div className="bg-swirl bg-no-repeat bg-[length:442px_260px] flex flex-col sm:flex-row rounded-xl ">
        <div className="flex flex-col justify-between w-full sm:w-80">
          <div className="p-6">
            <Logo />
          </div>
          <div className="justify-end">
            <div className="p-6">
              <Text as="h3" variant="h3">
                {Heading}
              </Text>
            </div>
            <div
              role="status"
              className="h-16 bg-gradient-to-r from-brand-start to-brand-end w-full flex items-center justify-center"
            >
              Progress Bar Placeholder
            </div>
          </div>
        </div>
        <div className="bg-dark-background-100 flex-1 border-t sm:border-t-0 sm:border-l dark:border-dark-gray-150 w-full h-full">
          {Right}
        </div>
      </div>
    </AuthContainer>
  );
}

function AuthContainer(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open onClose={noop} className="relative z-10 h-full w-full">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 sm:p-0">
          <Dialog.Panel
            className={cn(
              "overflow-hidden bg-dark-background-200 rounded-xl",
              props.className
            )}
          >
            {props.children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
