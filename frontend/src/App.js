import { useAuth0 } from "@auth0/auth0-react";
import Main from "./pages/main";
import { Spinner } from "flowbite-react";

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  if (!isAuthenticated && !isLoading) loginWithRedirect();
  console.log("isAuthenticated: ", isAuthenticated);
  console.log("isLoading: ", isLoading);
  return (
    <div className="App">
      {isAuthenticated ? (
        <Main />
      ) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Spinner size={"xl"} />
        </div>
      )}
    </div>
  );
}

export default App;
