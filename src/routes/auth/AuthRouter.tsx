import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";

import { Logo } from "../../components/Logo";

import Login from "./Login";
import Verify from "./Verify";
import Register from "./Register";

export default function AuthRouter() {
  return (
    <React.Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={`verify`} element={<Verify />} />;
          <Route path={`login`} element={<Login />} />;
          <Route path={`register`} element={<Register />} />;
        </Route>
      </Routes>
    </React.Suspense>
  );
}

function Layout() {
  return (
    <main className="w-full h-full flex items-start p-2 sm:p-0 sm:items-center justify-center">
      <section className="w-full max-w-4xl bg-swirl bg-no-repeat bg-[length:442px_260px] bg-dark-background-200 flex flex-col sm:flex-row rounded-xl overflow-hidden">
        <div className="flex flex-col justify-between w-full sm:w-80 sm:h-96">
          <div className="p-6">
            <Logo />
          </div>
          <div className="justify-end">
            <div className="p-6">
              <h3>
                Welcome to Clouty!
                <br />
                Great time{" "}
                <span className="dark:text-dark-gray-600">
                  to create a profile
                </span>
              </h3>
            </div>
            <div role="status" className="h-16 bg-brand-500 w-full">
              Progress Bar Placeholder
            </div>
          </div>
        </div>
        <div className="bg-dark-background-100 sm:h-96 flex-1 border-t sm:border-t-0 sm:border-l dark:border-dark-gray-150 w-full">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
