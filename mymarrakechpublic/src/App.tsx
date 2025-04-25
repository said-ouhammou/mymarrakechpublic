import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from "react";
import { routes } from "@/routes";
import { FBLoading } from "@/components/custom/Loading";
import ErrorBoundary from "@/components/custom/ErrorBoundary";

export default function App() {
    return (
        <Router>
            <Suspense fallback={<FBLoading />}>
                <ErrorBoundary>
                    <Routes>
                        {routes.map(({ path, layout: Layout, routes }) => (
                            <Route key={path} path={path} element={<Layout />}>
                                {routes.map(({ path, component: Component }) => (
                                    <Route key={path} path={path} element={<Component />} />
                                ))}
                            </Route>
                        ))}
                    </Routes>
                </ErrorBoundary>
            </Suspense>
        </Router>
    );
}
