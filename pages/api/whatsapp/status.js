export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  const workerUrl = process.env.WHATSAPP_WORKER_URL;

  if (!workerUrl) {
    return res.status(500).json({
      success: false,
      connected: false,
      error: "WHATSAPP_WORKER_URL is missing",
    });
  }

  const baseUrl = workerUrl.replace(/\/+$/, "");

  try {
    const response = await fetch(`${baseUrl}/status`, {
      headers: {
        "x-api-key": process.env.WHATSAPP_WORKER_API_KEY || "",
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.ok === false) {
      return res.status(502).json({
        success: false,
        connected: false,
        qrUrl: `${baseUrl}/qr`,
        error: data?.error || "WhatsApp worker status failed",
      });
    }

    return res.status(200).json({
      success: true,
      connected: Boolean(data?.whatsapp?.connected),
      connecting: Boolean(data?.whatsapp?.connecting),
      state: data?.whatsapp?.state || "unknown",
      user: data?.whatsapp?.user || null,
      qrAvailable: Boolean(data?.whatsapp?.qrAvailable),
      queue: data?.queue || {},
      limits: data?.limits || {},
      qrUrl: `${baseUrl}/qr`,
      lastConnectionUpdate: data?.whatsapp?.lastConnectionUpdate || null,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      connected: false,
      qrUrl: `${baseUrl}/qr`,
      error: error.message || "Unable to reach WhatsApp worker",
    });
  }
}
