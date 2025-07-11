import { VenetianMask, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import PlanBadge from "./plan-badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Header() {
  return (
    <nav className="container flex items-center justify-between py-4 px-4 lg:px-8 mx-auto bg-white max-w-7xl">
      {/* Logo */}
      <div className="flex lg:flex-1">
        <NavLink href="/" className="flex items-center gap-2 shrink-0">
          <VenetianMask className="w-8 h-8 text-blue-600 hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="font-bold text-xl text-gray-900">SAFE</span>
        </NavLink>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-8 items-center me-4">
        <NavLink href="/#pricing">Pricing</NavLink>
        <SignedIn>
          <NavLink href="/dashboard">Home</NavLink>
          <NavLink href="/cc-fraud-detector">Credit Card Fraud</NavLink>
          <NavLink href="/transaction-fraud-detector">
            Transaction Fraud
          </NavLink>
          <NavLink href="/financial-news">Financial News</NavLink>
        </SignedIn>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <SignedIn>
          <Button
            asChild
            className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white hidden lg:inline-flex"
          >
            <NavLink href="/cc-fraud-detector">Detect Fraud</NavLink>
          </Button>
        </SignedIn>

        <SignedOut>
          <Button
            asChild
            className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white hidden lg:inline-flex"
          >
            <NavLink href="/sign-in">Sign In</NavLink>
          </Button>
        </SignedOut>

        <SignedIn>
          <PlanBadge />
          <UserButton />
        </SignedIn>

        {/* Mobile Navigation (Hamburger) */}
        <div className="lg:hidden flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6 text-blue-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-48 flex flex-col space-y-2"
            >
              {/* Pricing */}
              <form action="/#pricing">
                <button
                  type="submit"
                  className="text-left w-full px-2 py-1 hover:bg-blue-100 rounded"
                >
                  Pricing
                </button>
              </form>

              <SignedIn>
                <form action="/dashboard">
                  <button
                    type="submit"
                    className="text-left w-full px-2 py-1 hover:bg-blue-100 rounded"
                  >
                    Home
                  </button>
                </form>
                <form action="/cc-fraud-detector">
                  <button
                    type="submit"
                    className="text-left w-full px-2 py-1 hover:bg-blue-100 rounded"
                  >
                    Credit Card Fraud
                  </button>
                </form>
                <form action="/transaction-fraud-detector">
                  <button
                    type="submit"
                    className="text-left w-full px-2 py-1 hover:bg-blue-100 rounded"
                  >
                    Transaction Fraud
                  </button>
                </form>
                <form action="/financial-news">
                  <button
                    type="submit"
                    className="text-left w-full px-2 py-1 hover:bg-blue-100 rounded"
                  >
                    Financial News
                  </button>
                </form>
                <form action="/cc-fraud-detector">
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 w-full"
                  >
                    Detect Fraud
                  </Button>
                </form>
              </SignedIn>

              <SignedOut>
                <form action="/sign-in">
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 w-full"
                  >
                    Sign In
                  </Button>
                </form>
              </SignedOut>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
}
