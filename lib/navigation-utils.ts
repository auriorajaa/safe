"use client";

/**
 * Utility function to navigate with loading
 * @param url The URL to navigate to
 */
export function navigateWithLoading(url: string): void {
  // Dispatch a custom event
  const event = new CustomEvent("navigate-with-loading", {
    detail: { url },
  });

  window.dispatchEvent(event);
}

/**
 * Alternative decorator for anchor elements to add loading functionality
 * @param e Click event
 * @param href Target URL
 */
export function handleNavigationWithLoading(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
): void {
  e.preventDefault();
  navigateWithLoading(href);
}
