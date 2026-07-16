import { Given, When, Then } from "quickpickle";
import { expect, vi } from "vitest";

vi.mock("$lib/services/themes/events/festive.svelte", () => ({
  makeItSnow: vi.fn(),
  makeItStopSnowing: vi.fn()
}));

import { themeService } from "$lib/services/themes";

When("the user sets the theme to {string}", (world: any, theme: string) => {
  themeService.setTheme(theme);
});

Then("localStorage shall contain theme {string}", (world: any, expected: string) => {
  expect(localStorage.getItem("theme") ?? localStorage.theme).toBe(expected);
});

Then("the document data-theme attribute shall be {string}", (world: any, expected: string) => {
  expect(document.documentElement.getAttribute("data-theme")).toBe(expected);
});

When("the user sets display mode to {string}", (world: any, mode: string) => {
  themeService.setDisplayMode(mode);
});

Then("the document shall have the {string} CSS class", (world: any, className: string) => {
  expect(document.documentElement.classList.contains(className)).toBe(true);
});

Then("localStorage modeCurrent shall be {string}", (world: any, expected: string) => {
  expect(localStorage.modeCurrent).toBe(expected);
});

Given("the display mode is {string}", (world: any, mode: string) => {
  themeService.setDisplayMode(mode);
});

When("the user toggles the display mode", (world: any) => {
  themeService.toggleDisplayMode();
});

Then("the display mode shall be {string}", (world: any, expected: string) => {
  expect(themeService.lightMode.value).toBe(expected);
});

Given("the layout is {string}", (world: any, layout: string) => {
  themeService.setLayout(layout);
});

When("the user toggles the layout", (world: any) => {
  themeService.toggleLayout();
});

Then("the layout shall be {string}", (world: any, expected: string) => {
  expect(themeService.layout.value).toBe(expected);
});

Then("the current theme shall be {string}", (world: any, expected: string) => {
  expect(themeService.currentTheme.value).toBe(expected);
});

Given("the current theme is {string}", (world: any, theme: string) => {
  themeService.setTheme(theme);
});

When("the user requests the icon for type {string}", (world: any, _type: string) => {
  // icon retrieval tested in Then
});

Then("an icon shall be returned with a type and color", (world: any) => {
  const icon = themeService.getIcon("tutors");
  expect(icon).toHaveProperty("type");
  expect(icon).toHaveProperty("color");
});
