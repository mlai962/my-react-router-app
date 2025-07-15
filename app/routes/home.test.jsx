import { createMemoryRouter, RouterProvider } from "react-router";
import Home from "./home";
import { render, screen } from "@testing-library/react";

describe("Home Route Tests", () => {
  it("should render the home page with a welcome message", async () => {
    const routeObjects = [
      {
        path: "/",
        Component: Home,
        loader: () => {
          return { message: "Hello from Vercel" };
        },
        HydrateFallback: () => <div>Loading...</div>,
      },
    ];

    const router = createMemoryRouter(routeObjects, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    screen.debug();

    expect(await screen.findByText("Hello from Vercel")).toBeInTheDocument();
  });
});
