import { buttonVariants } from "./ui/button";
// import { useCookies } from "react-cookie";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCookies } from "react-cookie";


const Navbar = () => {
  const { pathname } = useLocation();
  const buttonText = pathname === "/signin" ? "Sign Up" : "Sign In";
  const [cookies, setCookies] = useCookies(["jwt"]);
  const cookie = cookies.jwt;

  const logout = () => {
    localStorage.removeItem("userId");
    setCookies("jwt", "", {
      expires: new Date(0)
    });
    window.location.pathname = "/signin"
  };
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* Title */}
        <Link to="/">
          <p className="font-bold text-2xl">Tiny Url</p>
        </Link>

        {/* Auth Button */}
        {cookie ? (
          <div className="space-x-2">
            <Link
              to="/dashboard"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "font-semibold text-base"
              )}
            >
              Dashboard
            </Link>
            <a href="/signin" className={cn(buttonVariants({ variant: "default" }))} onClick={logout}>
              Logout
            </a>
          </div>
        ) : (
          <Link
            to={buttonText === "Sign Up" ? "/signup" : "signin"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
