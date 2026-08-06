import "@testing-library/jest-dom/vitest";

process.env.NEXT_PUBLIC_DEV_AUTH = "";

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
