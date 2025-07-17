import "./bootstrap";
import "../css/app.css";
import axios from "axios";
import AppProvider from "./Context/AppContext";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        const page = pages[`./Pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Page not found: ./Pages/${name}.jsx`);
        }
        // When using eager:true, the module's default export is directly accessible as page.default
        return page.default;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<AppProvider><App {...props} /></AppProvider>);
    },
});

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["Accept"] = "application/json";
}
