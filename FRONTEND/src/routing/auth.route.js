import { createRoute, redirect } from "@tanstack/react-router"
import { rootRoute } from "./routeTree"
import AuthPage from "../pages/AuthPage"

export const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth',
    component: AuthPage,
    beforeLoad: ({ context }) => {
        const { store } = context;
        const { isAuthenticated } = store.getState().auth;
        if (isAuthenticated) {
            throw redirect({ to: "/dashboard" });
        }
    }
})