import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import ForgetPassword from "./components/Auth/ForgetPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Home from "./components/Home/Home";
import Car from "./components/Car/Car";
import AddCar from "./components/Admin/AddCar";
import User from "./components/User/User";
import Admin from "./components/Admin/Admin";
import Select from "./components/User/Select";
import CarDetail from "./components/Car/CarDetail";
import Booked from "./components/User/Booked";
import Activate from "./components/Auth/Activate";
import Driver from "./components/Driver/Driver";
import AddDriver from "./components/Admin/AddDriver";
import MyBookings from "./components/User/MyBookings";
import Confirm from "./components/User/Confirm";
import CarDetail_A from "./components/Admin/CarDetail_A";
import CarDetail_U from "./components/User/CarDetail_U";
import EditCar from "./components/Admin/EditCar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/Auth/PrivateRoute";
import About from "./components/common/About";
import ContactUs from "./components/common/ContactUs";
import FAQ from "./components/common/FAQ";
import Blogs from "./components/common/Blogs";
import DriverManage from "./components/Admin/DriveraManage";
import AllBookings from "./components/Admin/AllBookings";
import EditDriver from "./components/Admin/EditDriver";
import DriverTracker from "./components/Driver/DriverTracker";
import AdminTracker from "./components/Admin/AdminTracker";
import GoogleRedirect from "./components/Auth/GoogleRedirect";



function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Car />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="/forget" element={<ForgetPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/detail/:id" element={<CarDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/activate/google-redirect" element={<GoogleRedirect />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/mybookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Select />
              </PrivateRoute>
            }
          />
          <Route
            path="/detailU/:id"
            element={
              <PrivateRoute>
                <CarDetail_U />
              </PrivateRoute>
            }
          />
          <Route
            path="/book"
            element={
              <PrivateRoute>
                <Booked />
              </PrivateRoute>
            }
          />
          <Route
            path="/confirm"
            element={
              <PrivateRoute>
                <Confirm />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/addcar"
            element={
              <PrivateRoute>
                <AddCar />
              </PrivateRoute>
            }
          />
          <Route
            path="/drivermanage"
            element={
              <PrivateRoute>
                <DriverManage />
              </PrivateRoute>
            }
          />
          <Route
            path="/addDriver"
            element={
              <PrivateRoute>
                <AddDriver />
              </PrivateRoute>
            }
          />
          <Route
            path="/allbookings"
            element={
              <PrivateRoute>
                <AllBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/detailA/:id"
            element={
              <PrivateRoute>
                <CarDetail_A />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/edit/:id"
            element={
              <PrivateRoute>
                <EditCar />
              </PrivateRoute>
            }
          />
          <Route
            path="/drivers/edit/:id"
            element={
              <PrivateRoute>
                <EditDriver />
              </PrivateRoute>
            }
          />
          <Route
            path="/cardetail/:id"
            element={
              <PrivateRoute>
                <CarDetail_A />
              </PrivateRoute>
            }
          />
          <Route
            path="/admintrack/:id"
            element={
              <PrivateRoute>
                <AdminTracker />
              </PrivateRoute>
            }
          />

          {/* Driver Routes */}
          <Route
            path="/driver"
            element={
              <PrivateRoute>
                <Driver />
              </PrivateRoute>
            }
          />
          <Route
            path="/driverlocation"
            element={
              <PrivateRoute>
                <DriverTracker />
              </PrivateRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;