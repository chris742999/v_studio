
const BASE_URL =
  process.env.MPESA_ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// Safely parse API responses.
async function parseResponse(response) {
  const responseText = await response.text();

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(
      `Safaricom returned an unexpected response format. HTTP ${response.status}.`
    );
  }
}

// Generate a Safaricom access token.
async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;

  if (!key || !secret) {
    throw new Error("M-Pesa API credentials are missing.");
  }

  const credentials = Buffer.from(
    `${key}:${secret}`
  ).toString("base64");

  const response = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      signal: AbortSignal.timeout(15000),
    }
  );

  const data = await parseResponse(response);
  console.log("OAuth HTTP status:", response.status);
console.log("OAuth token received:", Boolean(data.access_token));
console.log("OAuth token length:", data.access_token?.length);
console.log("OAuth error:", data.errorMessage || data.error || "None");

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.errorMessage ||
      data.error ||
      "M-Pesa authentication failed."
    );
  }
console.log("OAuth token expiry:", data.expires_in);
  return data.access_token;
}

// Generate timestamp using Kenya time.
function getTimestamp() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return (
    values.year +
    values.month +
    values.day +
    values.hour +
    values.minute +
    values.second
  );
}

// Generate the M-Pesa API password.
function generatePassword(shortcode, passkey, timestamp) {
  return Buffer.from(
    `${shortcode}${passkey}${timestamp}`
  ).toString("base64");
}

// Initiate an M-Pesa STK Push.
export async function initiateSTKPush({
  phone,
  amount,
  bookingId,
}) {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!shortcode || !passkey || !callbackUrl) {
    throw new Error(
      "M-Pesa shortcode, passkey or callback URL is missing."
    );
  }

  if (!Number.isSafeInteger(amount) || amount < 1) {
    throw new Error("Invalid M-Pesa payment amount.");
  }

  const timestamp = getTimestamp();

  const password = generatePassword(
    shortcode,
    passkey,
    timestamp
  );

  const accessToken = await getAccessToken();
  console.log("M-Pesa environment:", process.env.MPESA_ENVIRONMENT);
console.log("Sandbox endpoint:", BASE_URL);
console.log("Access token received:", Boolean(accessToken));
console.log("Access token length:", accessToken.length);

  const response = await fetch(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: `VS${bookingId}`,
        TransactionDesc: "Visionary Studios Booking",
      }),
      signal: AbortSignal.timeout(30000),
    }
  );

  const data = await parseResponse(response);

  // Diagnostic information: never log credentials or access tokens.
  console.log("M-Pesa STK HTTP status:", response.status);
  console.log("M-Pesa STK response:", data);

  if (!response.ok || data.ResponseCode !== "0") {
    throw new Error(
      data.errorMessage ||
      data.errorDescription ||
      data.ResponseDescription ||
      "Unable to initiate M-Pesa payment."
    );
  }

  return data;
}

// Verify an STK Push transaction directly with Safaricom.
export async function querySTKPush(checkoutRequestId) {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  if (!shortcode || !passkey || !checkoutRequestId) {
    throw new Error(
      "Missing M-Pesa verification details."
    );
  }

  const timestamp = getTimestamp();

  const password = generatePassword(
    shortcode,
    passkey,
    timestamp
  );

  const accessToken = await getAccessToken();

  const response = await fetch(
    `${BASE_URL}/mpesa/stkpushquery/v1/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
      signal: AbortSignal.timeout(30000),
    }
  );

  const data = await parseResponse(response);

  console.log("M-Pesa query HTTP status:", response.status);
  console.log("M-Pesa query response:", data);

  if (!response.ok) {
    throw new Error(
      data.errorMessage ||
      data.errorDescription ||
      data.ResponseDescription ||
      "Unable to verify M-Pesa transaction."
    );
  }

  return data;
}
