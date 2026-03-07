import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { VehicleList } from "./components/VehicleList";
import { VehicleDetail } from "./components/VehicleDetail";
import { VehicleForm } from "./components/VehicleForm";
import { ControlPanel } from "./components/ControlPanel";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/vehicles/:category", Component: VehicleList },
  { path: "/vehicles/:category/:id", Component: VehicleDetail },
  { path: "/vehicles/:category/:id/edit", Component: VehicleForm },
  { path: "/vehicles/:category/add", Component: VehicleForm },
  { path: "/kontrol-paneli", Component: ControlPanel },
]);
