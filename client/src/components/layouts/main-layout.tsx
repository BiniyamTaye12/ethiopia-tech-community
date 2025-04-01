import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isLoading, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-microchip text-primary text-xl mr-2"></i>
                <span className="font-bold text-xl text-primary">ETHTech</span>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link href="/">
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === "/" 
                      ? "border-primary text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}>
                    Home
                  </a>
                </Link>
                <Link href="/blog">
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === "/blog" 
                      ? "border-primary text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}>
                    Blog
                  </a>
                </Link>
                {user && (
                  <Link href="/my-blog">
                    <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location === "/my-blog" 
                        ? "border-primary text-gray-900" 
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}>
                      My Blog
                    </a>
                  </Link>
                )}
              </nav>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {isLoading ? (
                <Loader2 className="ml-3 h-5 w-5 animate-spin" />
              ) : user ? (
                <div className="ml-3 relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full p-0 h-8 w-8">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + user.username}
                          alt={user.username}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <a className="w-full cursor-pointer">Your Profile</a>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link href="/auth">
                  <Button className="ml-3" variant="default">Sign In</Button>
                </Link>
              )}
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link href="/">
                <a
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location === "/"
                      ? "bg-primary bg-opacity-10 border-primary text-primary"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
              </Link>
              <Link href="/blog">
                <a
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location === "/blog"
                      ? "bg-primary bg-opacity-10 border-primary text-primary"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </a>
              </Link>
              {user && (
                <Link href="/my-blog">
                  <a
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      location === "/my-blog"
                        ? "bg-primary bg-opacity-10 border-primary text-primary"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Blog
                  </a>
                </Link>
              )}
              {user && (
                <Link href="/profile">
                  <a
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      location === "/profile"
                        ? "bg-primary bg-opacity-10 border-primary text-primary"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </a>
                </Link>
              )}
            </div>
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + user.username}
                      alt={user.username}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Button
                    variant="ghost"
                    className="block px-4 py-2 w-full text-left text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex justify-center">
                  <Link href="/auth">
                    <Button
                      className="w-full mx-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <i className="fas fa-microchip text-primary text-xl mr-2"></i>
                <span className="font-bold text-xl text-primary">ETHTech</span>
              </div>
              <p className="text-gray-600 mb-4">
                Connecting Ethiopia's tech community through knowledge sharing, collaboration, and innovation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary">
                  <i className="fab fa-twitter text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <i className="fab fa-facebook text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <i className="fab fa-linkedin text-lg"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <i className="fab fa-github text-lg"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog">
                    <a className="text-gray-600 hover:text-primary">Blog</a>
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary">Events</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary">Tutorials</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary">Job Board</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Community
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary">Team</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary">Contribute</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Ethiopia's Tech Community. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
