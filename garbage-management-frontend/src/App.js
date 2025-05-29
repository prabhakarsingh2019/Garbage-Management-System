import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import AppNavbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import PrivateRoute from "./components/shared/PrivateRoute";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/users/Profile";
import BinList from "./components/bins/BinList";
import BinDetails from "./components/bins/BinDetails";
import BinForm from "./components/bins/BinForm";
import BinMap from "./components/bins/BinMap";
import RouteList from "./components/routes/RouteList";
import RouteDetails from "./components/routes/RouteDetails";
import RouteForm from "./components/routes/RouteForm";
import CollectionList from "./components/collections/CollectionList";
import CollectionForm from "./components/collections/CollectionForm";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import UserList from "./components/users/UserList";
import NotFound from "./pages/NotFound";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <AppNavbar />
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Authenticated routes (any logged-in user) */}
                <Route element={<PrivateRoute />}>
                  <Route path="/users/:id" element={<Profile />} />
                  <Route path="/bins" element={<BinList />} />
                  <Route path="/bins/map" element={<BinMap />} />
                  <Route path="/bins/:id" element={<BinDetails />} />
                </Route>

                {/* Admin routes */}
                <Route element={<PrivateRoute roles={["admin"]} />}>
                  {/* Admin dashboard */}
                  <Route path="/admin" element={<AdminDashboard />} />

                  {/* Bin management */}
                  <Route path="/admin/bins/new" element={<BinForm />} />
                  <Route path="/admin/bins/:id/edit" element={<BinForm />} />

                  {/* Route management */}
                  <Route
                    path="/admin/routes"
                    element={<RouteList isAdminView />}
                  />
                  <Route path="/admin/routes/new" element={<RouteForm />} />
                  <Route path="/admin/routes/:id" element={<RouteDetails />} />
                  <Route
                    path="/admin/routes/:id/edit"
                    element={<RouteForm />}
                  />

                  {/* User management */}
                  <Route path="/admin/users" element={<UserList />} />
                  <Route path="/users/:id" element={<Profile />} />
                </Route>

                {/* Driver routes */}
                <Route element={<PrivateRoute roles={["driver"]} />}>
                  <Route path="/driver" element={<DriverDashboard />} />
                  <Route path="/driver/routes" element={<RouteList />} />
                  <Route path="/routes/:id" element={<RouteDetails />} />
                  <Route
                    path="/driver/collections/new"
                    element={<CollectionForm />}
                  />
                </Route>

                {/* Shared admin/driver routes */}
                <Route element={<PrivateRoute roles={["admin", "driver"]} />}>
                  <Route path="/collections" element={<CollectionList />} />
                </Route>

                {/* Not found route - catches all undefined paths */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
