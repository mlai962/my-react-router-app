import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/bet-log-route.tsx"),
  route("*", "routes/fallback-route.tsx"),
] satisfies RouteConfig;
