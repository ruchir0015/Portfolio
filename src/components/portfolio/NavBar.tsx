"use client";

import BubbleMenu from "./BubbleMenu";

const navItems = [
  {
    label: "home",
    href: "#hero",
    ariaLabel: "Home",
    rotation: -8,
    hoverStyles: { bgColor: "#10B981", textColor: "#FFFFFF" } /* Emerald green */
  },
  {
    label: "about",
    href: "#about",
    ariaLabel: "About Me",
    rotation: 8,
    hoverStyles: { bgColor: "#F59E0B", textColor: "#FFFFFF" } /* Amber orange */
  },
  {
    label: "experience",
    href: "#experience",
    ariaLabel: "Experience",
    rotation: -8,
    hoverStyles: { bgColor: "#8B5CF6", textColor: "#FFFFFF" } /* Violet purple */
  },
  {
    label: "projects",
    href: "#projects",
    ariaLabel: "Projects",
    rotation: 8,
    hoverStyles: { bgColor: "#0EA5E9", textColor: "#FFFFFF" } /* Sky blue */
  },
  {
    label: "connect",
    href: "#connect",
    ariaLabel: "Connect",
    rotation: -8,
    hoverStyles: { bgColor: "#F43F5E", textColor: "#FFFFFF" } /* Rose pink */
  }
];

export function NavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[1001] pointer-events-none">
      <BubbleMenu
        items={navItems}
        menuAriaLabel="Toggle navigation"
        menuBg="#F5E6C8" /* Parchment lightest */
        menuContentColor="#2C1A0E" /* Ink dark brown */
        useFixedPosition={true}
        className="pointer-events-auto"
      />
    </div>
  );
}
