"use client";

import BubbleMenu from "./BubbleMenu";

const navItems = [
  {
    label: "home",
    href: "#hero",
    ariaLabel: "Home",
    rotation: -8,
    hoverStyles: { bgColor: "#D4B896", textColor: "#2C1A0E" }
  },
  {
    label: "about",
    href: "#about",
    ariaLabel: "About Me",
    rotation: 8,
    hoverStyles: { bgColor: "#D4B896", textColor: "#2C1A0E" }
  },
  {
    label: "experience",
    href: "#experience",
    ariaLabel: "Experience",
    rotation: -8,
    hoverStyles: { bgColor: "#D4B896", textColor: "#2C1A0E" }
  },
  {
    label: "projects",
    href: "#projects",
    ariaLabel: "Projects",
    rotation: 8,
    hoverStyles: { bgColor: "#D4B896", textColor: "#2C1A0E" }
  },
  {
    label: "connect",
    href: "#connect",
    ariaLabel: "Connect",
    rotation: -8,
    hoverStyles: { bgColor: "#D4B896", textColor: "#2C1A0E" }
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
