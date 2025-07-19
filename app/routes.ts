import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("child-route", "routes/child-route.tsx"),
] satisfies RouteConfig;
