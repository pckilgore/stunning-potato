/**
 * Check a password against the Open Sourced HaveIBeenPwned database, via
 * https://haveibeenpwned.com/API/v3#PwnedPasswords
 *
 * Returns false if a password appears in more than ten breaches, which is
 * a sign that it is extremely weak or guessable.
 *
 * The third-party API used to do this is extremely fast, but this is
 * a decently-async operation, so try to only do it on blur.
 *
 * NOTE: IF THE THIRD PARTY USED TO CHECK THIS IS DOWN AND/OR NOT ACCESSIBLE, THIS
 * FUNCTION FAILS "functional" AND RETURNS "true".
 *
 * See: https://pages.nist.gov/800-63-3/sp800-63b.html for an entirely too long
 * explaination why this + 8 character limit is actually far more secure than
 * arbitrary "entropy" requirements.
 *
 * More Reading:
 *  - https://www.troyhunt.com/ive-just-launched-pwned-passwords-version-2/
 *  - https://www.troyhunt.com/enhancing-pwned-passwords-privacy-with-padding
 *  - https://www.troyhunt.com/pwned-passwords-open-source-in-the-dot-net-foundation-and-working-with-the-fbi/
 *
 */
export async function meetsPasswordBreachRequirements(password: string) {
  const buf = await window.crypto.subtle.digest(
    "sha-1",
    new TextEncoder().encode(password)
  );

  const sha = Array.prototype.map
    .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");

  const key = sha.slice(0, 5);
  const confirm = sha.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${key}`, {
    headers: [["Add-Padding", "true"]],
  });

  if (response.status >= 400) {
    // This stuff is hosted on Cloudflare and is open source, so it should
    // *never* go down, but on the off chance that it does, don't break
    // anything.
    return true;
  }

  const possibleMatches = await response.text();
  const search = new RegExp(`${confirm}:([0-9]+)`, "i");
  const potentialUnsafePasswordHashMatch = possibleMatches.match(search);

  if (potentialUnsafePasswordHashMatch) {
    const [, breachCount = "0"] = potentialUnsafePasswordHashMatch;
    const parsedBreachCount = parseInt(breachCount);

    if (parsedBreachCount > 10) {
      // Assume anything this frequently-appearing in a breach is
      // compromised.
      return false;
    }
  }

  return true;
}

/**
 * Describes how Amplify reports errors from Cognito.
 */
export interface CognitoError extends Error {
  code: string;
}
