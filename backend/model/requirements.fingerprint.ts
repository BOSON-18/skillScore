import crypto from "crypto";
import { NormalizedRequirements } from "./jobRole.dto";

// canonicalize the object 
// sort keys recursively
// preserving vales as is 
// stable json for hashing



// Canonicalize
// Means: represent the same meaning in a consistent structure
// Example:
// sort object keys
// keep values exactly the same
// This does NOT change meaning
function canonicalize(value: unknown): unknown {

    // Why unknown?
    // unknown = “I don’t know what this is yet”
    // Safer than any
    // Forces us to check before using
    // prevent runtime bugs

    if (Array.isArray(value)) {
        return value.map(canonicalize);
    }

    if (value !== null && typeof value === "object") {
        const obj = value as Record<string, unknown>; // string keys only
        const sorted: Record<string, unknown> = {};

        Object.keys(obj)
            .sort()
            .forEach((key) => {
                sorted[key] = canonicalize(obj[key]);
            });

        return sorted;
    }



    return value;

}


export function fingerprintRequirements(
  requirements: NormalizedRequirements
): string {
  const canonical = canonicalize(requirements);
  const json = JSON.stringify(canonical); // hashing requires string input

  return crypto
    .createHash("sha256")
    .update(json)
    .digest("hex");// readable db friendly format
}