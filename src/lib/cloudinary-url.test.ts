import { describe, expect, it } from "vitest";
import { extractPublicId } from "@/lib/cloudinary-url";

describe("extractPublicId", () => {
  it("extracts a flat public id", () => {
    expect(
      extractPublicId("https://res.cloudinary.com/demo/image/upload/v1712345678/exotica/abc.jpg"),
    ).toBe("exotica/abc");
  });

  it("strips version segments and query strings", () => {
    expect(
      extractPublicId("https://res.cloudinary.com/demo/image/upload/v123/folder/a.png?x=1"),
    ).toBe("folder/a");
  });

  it("handles URLs without a version or extension", () => {
    expect(extractPublicId("https://res.cloudinary.com/demo/image/upload/folder/watch")).toBe(
      "folder/watch",
    );
  });

  it("returns null for empty input", () => {
    expect(extractPublicId("")).toBeNull();
    expect(extractPublicId("   ")).toBeNull();
  });
});
