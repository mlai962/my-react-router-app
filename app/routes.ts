import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("bet-log", "routes/bet-log-route.tsx"),
] satisfies RouteConfig;
