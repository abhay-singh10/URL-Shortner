import { createRoute, redirect } from "@tanstack/react-router"
import { rootRoute } from "./routeTree"
import DashboardPage from "../pages/DashboardPage"

export const dasboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: DashboardPage,
    beforeLoad: ({ context }) => {
        const { store } = context;
        const { isAuthenticated } = store.getState().auth;
        if (!isAuthenticated) {
            throw redirect({ to: "/auth" });
        }
    }
})