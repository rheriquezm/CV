import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { getRouter } from "./router";
import "./index.css";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Root element not found");

const router = await getRouter();

// Server metadata describes the initial URL. The SPA router owns these tags after
// startup, including navigation into root mode from another marketing/public page.
const serverSeoSelectors = [
	"[data-root-resume-shell]",
	'head link[rel="canonical"]',
	'head script[type="application/ld+json"]',
	'head meta[property^="og:"]',
	'head meta[name^="twitter:"]',
];
document.querySelectorAll(serverSeoSelectors.join(",")).forEach((element) => {
	element.remove();
});

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	// Wrapping the router (not just the route tree) keeps TanStack Router's default
	// error/not-found/pending components inside the i18n context. They render above the
	// root route's provider, so without this a `Trans` in those screens throws
	// "Cannot read properties of null (reading 'i18n')" and hides the real error.
	root.render(
		<I18nProvider i18n={i18n}>
			<RouterProvider router={router} />
		</I18nProvider>,
	);
}
