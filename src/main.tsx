import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App } from "./routes/App.tsx"
import { PostPage } from "./routes/PostPage.tsx"
import { Login } from "./routes/Login.tsx"
import { Register } from "./routes/Register.tsx"
import { Profile } from "./routes/Profile.tsx"
import { About } from "./routes/About.tsx"
import { SearchProvider } from "./context/SearchContext.tsx"
import { AnswerProvider } from "./context/AnswerContext.tsx"
import "./index.css"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/:username/:postID",
    element: <PostPage />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <AnswerProvider>
          <RouterProvider router={router} />
        </AnswerProvider>
      </SearchProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
