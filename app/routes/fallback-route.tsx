import { redirect } from "react-router-dom";

export function clientLoader() {
  return redirect("/");
}

const FallbackRoute = () => {
  return null;
};

export default FallbackRoute;
