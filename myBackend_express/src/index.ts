// src/index.ts
import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import * as crypto from 'crypto';
// import safeZones from "./routes/safezones";
import { PrismaClient, Device, Prisma } from "@prisma/client";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());
// app.use("/api/safe-zones", safeZones);
// app.use(cors({
//   origin: [
//     "https://ikoncloud-dev.keross.com",
//     "http://localhost:3000"
//   ],
//   methods: ["GET","POST","PUT","DELETE"],
//   allowedHeaders: ["Content-Type","Authorization"]
// }));

// Auth
const PARENT_SECRET = process.env.PARENT_SECRET || "abc123";

// ----------------------------- Helpers -------------------------------------

// Resolve (deviceUuid | deviceId | machineName) -> deviceId
async function resolveDeviceId(deviceUuid?: string, deviceId?: number, machineName?: string) {
  if (typeof deviceId === "number" && !Number.isNaN(deviceId) && deviceId > 0) return deviceId;
  
  if (deviceUuid) {
    const device = await prisma.device.findUnique({ where: { deviceUuid } });
    if (!device) throw new Error("Device not registered");
    return device.id;
  }
  
  if (machineName) {
    const device = await prisma.device.findFirst({ where: { machineName } });
    if (!device) throw new Error("Device not registered");
    return device.id;
  }
  
  throw new Error("Missing deviceUuid or deviceId");
}

// Date range helper (start/end of day)
function getDateRange(dateStr?: string) {
  if (dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format. Use YYYY-MM-DD.");
    }
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
  }
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 60) return `${seconds ?? 0}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}


// ----------------------------- Devices -------------------------------------

// POST /api/devices/register
// ----------------------------- Devices -------------------------------------

// POST /api/devices/register
app.post("/api/devices/register", async (req, res) => {
  console.log("🔥 REGISTER HIT:", req.body);

  try {
    const {
      deviceUuid,     // may be undefined from Python -> okay
      macAddress,     // primary matching key
      machineName,
      userName,
      os,
      childId,
    } = req.body;

    if (!macAddress) {
      return res.status(400).json({ error: "macAddress is required" });
    }

    // Normalize childId
    const safeChildId =
      childId && Number(childId) > 0 ? Number(childId) : null;

    // --- STEP 1: Try matching by MAC first ----------------------------
    let existing = await prisma.device.findFirst({
      where: { macAddress }
    });

    let device;

    if (existing) {
      console.log("🔄 Device found by MAC. Updating existing device...");

      device = await prisma.device.update({
        where: { id: existing.id },
        data: {
          // Keep existing deviceUuid OR update only if request provides one
          deviceUuid: deviceUuid || existing.deviceUuid,
          machineName,
          userName,
          os,
          lastSeen: new Date(),
          childId: safeChildId
        }
      });

    } else {
      console.log("🆕 No device with this MAC — creating new device.");

      // If no UUID provided → generate one
      const newUuid =
        deviceUuid || crypto.randomUUID();

      device = await prisma.device.create({
        data: {
          deviceUuid: newUuid,
          macAddress,
          machineName,
          userName,
          os,
          lastSeen: new Date(),
          childId: safeChildId
        }
      });
    }

    console.log("✅ Final registered device:", device);

    return res.json({
      success: true,
      deviceId: device.id,
      deviceUuid: device.deviceUuid,
      childId: device.childId
    });

  } catch (err: any) {
    console.error("❌ Device Register Error:", err);
    return res.status(500).json({ error: "Device registration failed" });
  }
});

app.post("/api/devices/update", async (req, res) => {
  console.log("🔥 MAC-FIRST REGISTER/UPDATE HIT:", req.body);

  try {
    const {
      deviceUuid,
      macAddress, // <-- Key for this endpoint
      machineName,
      userName,
      os,
    } = req.body;

    // --- Validation ---
    if (!macAddress) {
      return res.status(400).json({ error: "macAddress is required for this update endpoint." });
    }
    
    // --- STEP 1: Find Existing Device by MAC Address ---
    // Use findFirst because macAddress is nullable, avoiding DeviceWhereUniqueInput error (Fix #1)
    let existing: Device | null = await prisma.device.findFirst({
      where: { macAddress }
    });

    let device: Device;
    let action: "updated" | "created" | "Error";

    // --- STEP 2: Update or Create ---
    if (existing) {
      console.log("🔄 Device found by MAC. Updating existing device...");
      action = "updated";

      // If existing device has a deviceUuid, prefer it unless the request explicitly sends one.
      const uuidToSet = deviceUuid || existing.deviceUuid || crypto.randomUUID();

      device = await prisma.device.update({
        where: { id: existing.id },
        data: {
          deviceUuid: uuidToSet,
          macAddress, // Always set the MAC address
          machineName,
          userName,
          os,
          lastSeen: new Date(),
          
        }
      });
    } else {
      console.log("🆕 No device with this MAC found — creating new device.");
      action = "Error";

      
    }

    return res.json({
      success: true,
      action: action, 
    });

  } catch (err: any) {
    console.error("❌ Device Upsert Error:", err);
    // Handle Prisma unique constraint error for UUID/MAC
    if (err.code === 'P2002') {
         return res.status(409).json({ error: "A unique constraint violation occurred (e.g., duplicate deviceUuid) during creation." });
    }
    return res.status(500).json({ error: "Device registration/update failed" });
  }
});


app.get("/api/devices/uuid-by-mac", async (req, res) => {
  console.log("🔍 UUID LOOKUP HIT:", req.query);

  try {
    // Expect macAddress in the query parameters (e.g., ?macAddress=00:1A:2B:3C:4D:5E)
    const { macAddress } = req.query;

    // --- Validation ---
    if (!macAddress || typeof macAddress !== 'string' || macAddress.trim() === '') {
      return res.status(400).json({ error: "macAddress query parameter is required." });
    }

    const trimmedMacAddress = macAddress.trim();

    // --- Prisma Lookup ---
    // Use findFirst because macAddress is nullable (String?) in the schema, 
    // which prevents using the stricter findUnique.
    const device = await prisma.device.findFirst({
      where: { macAddress: trimmedMacAddress },
      select: {
        id: true,
        deviceUuid: true,
        childId: true, // Include childId for reference
      }
    });

    // --- Response Handling ---
    if (!device) {
      console.log(`⚠️ Device not found for MAC: ${trimmedMacAddress}`);
      return res.status(404).json({ error: "Device not found." });
    }

    console.log("✅ Device found:", { deviceId: device.id, deviceUuid: device.deviceUuid });

    return res.json({
      success: true,
      deviceId: device.id,
      deviceUuid: device.deviceUuid,
      childId: device.childId, 
    });

  } catch (err: any) {
    console.error("❌ UUID Lookup Error:", err);
    return res.status(500).json({ error: "Failed to retrieve device UUID." });
  }
});



// ----------------------------- Activity ------------------------------------

// POST /api/activity
app.post("/api/activity", async (req, res) => {
  console.log("ACTIVITY PAYLOAD:", req.body);

  // const authHeader = req.headers.authorization;
  
  // if (authHeader !== `Bearer ${PARENT_SECRET}`) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }
  //continue without authentication

  try {
    const {
      timestamp,
      localTimestamp,
      appName,
      windowTitle,
      durationSeconds,
      executablePath,
      screenTime = false,
      deviceUuid,
      deviceId,
    } = req.body;

    if (!appName) {
      return res.status(400).json({ error: "Missing required field: appName" });
    }

    if (!deviceUuid && !deviceId) {
      return res.status(400).json({ error: "deviceUuid or deviceId required" });
    }

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    const log = await prisma.activityLog.create({
      data: {
        deviceId: resolvedDeviceId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        localTimestamp: localTimestamp ? new Date(localTimestamp) : null,
        appName,
        windowTitle: windowTitle || "",
        durationSeconds: durationSeconds || 0,
        executablePath: executablePath || "",
        screenTime,
      },
    });

    const label = screenTime ? "[SCREEN TIME]" : "[FOCUSED]";
    console.log(
      `✅ ${label} device=${resolvedDeviceId} ${appName} - "${windowTitle || ""}" | Duration: ${
        durationSeconds || 0
      }s | Time: ${new Date(timestamp ?? Date.now()).toLocaleTimeString()}`
    );

    res.status(201).json({ id: log.id });
  } catch (err: any) {
    console.error("Activity error:", err);
    res.status(500).json({ error: "Failed to save activity" });
  }
});

// ----------------------------- Device List (required for UI) -----------------------------

// GET /api/devices
app.get("/api/devices", async (_req, res) => {
  try {
    const devices = await prisma.device.findMany({
      orderBy: { lastSeen: "desc" },
      select: {
        id: true,
        deviceUuid: true,
        macAddress: true,
        machineName: true,
        userName: true,
        os: true,
        childId: true,
        lastSeen: true
      }
    });

    return res.json(devices);

  } catch (err) {
    console.error("❌ Device list error:", err);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
});

// ----------------------------- Short Polling Alerts -------------------------
app.get("/api/alerts/latest", async (req, res) => {
  try {
    const deviceUuid = req.query.deviceUuid as string | undefined;
    const deviceId = req.query.deviceId ? Number(req.query.deviceId) : undefined;

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    // Fetch newest alert for that device
    const alert = await prisma.alert.findFirst({
      where: { deviceId: resolvedDeviceId },
      orderBy: { id: "desc" },
      select: { id: true, type: true, appName: true, details: true, timestamp: true }
    });

    res.json({ alert });
  } catch (err: any) {
    console.error("Latest alert error:", err);
    res.status(500).json({ error: "Failed to fetch latest alert" });
  }
});

app.get("/api/alerts/list", async (req, res) => {
  try {
    const deviceId = req.query.deviceId ? Number(req.query.deviceId) : undefined;
    const deviceUuid = req.query.deviceUuid as string | undefined;

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    const alerts = await prisma.alert.findMany({
      where: { deviceId: resolvedDeviceId },
      orderBy: { id: "desc" },
      take: 20
    });

    res.json({ alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load alerts" });
  }
});

app.get("/api/alerts/count-last-24h", async (req, res) => {
  try {
    // Calculate the time window
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Query Prisma for count
    const count = await prisma.alert.count({
      where: {
        timestamp: {
          gte: since,
        },
        // If you only want blocked content:
        // type: "blocked",
      },
    });

    res.json({ count });
  } catch (err) {
    console.error("Count alerts error:", err);
    res.status(500).json({ error: "Failed to fetch alert count" });
  }
});




// GET /api/activity (recent)
app.get("/api/activity", async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    res.json(logs);
  } catch (err: any) {
    console.error("Get activity error:", err);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// ----------------------------- Summary & Screen-time ------------------------

// GET /api/summary/daily-comparison?date=YYYY-MM-DD&deviceId=&deviceUuid=&childId=
app.get("/api/summary/daily-comparison", async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.date as string | undefined);

    // Optional filtering by device or child
    const deviceUuid = req.query.deviceUuid as string | undefined;
    const deviceId = req.query.deviceId ? Number(req.query.deviceId) : undefined;
    const childId = req.query.childId ? Number(req.query.childId) : undefined;

    let deviceWhere: any = {};
    if (deviceId) deviceWhere.deviceId = deviceId;
    else if (deviceUuid) {
      const device = await prisma.device.findUnique({ where: { deviceUuid } });
      if (!device) return res.status(404).json({ error: "Device not found" });
      deviceWhere.deviceId = device.id;
    } else if (childId) {
      // collect all deviceIds for child
      const devices = await prisma.device.findMany({ where: { childId }, select: { id: true } });
      const ids = devices.map((d: { id: number }) => d.id);
      if (ids.length === 0) return res.json({ date: start.toISOString().split("T")[0], apps: [], summary: {} });
      deviceWhere.deviceId = { in: ids };
    }

    const logs = await prisma.activityLog.findMany({
      where: {
        timestamp: { gte: start, lt: end },
        durationSeconds: { gt: 0 },
        ...(deviceWhere.deviceId ? { deviceId: deviceWhere.deviceId } : {}),
      },
      select: {
        appName: true,
        windowTitle: true,
        durationSeconds: true,
        screenTime: true,
      },
    });

    const appMap: Record<string, { focused: number; screen: number; latestWindowTitle: string }> = {};

    for (const log of logs) {
      let app = log.appName || "unknown";
      const title = (log.windowTitle || "").toLowerCase();

      if (app === "chrome") {
        if (title.includes("google chat") || title.includes("chat.google.com")) app = "google-chat";
        else if (title.includes("whatsapp")) app = "whatsapp";
        else if (title.includes("youtube")) app = "youtube";
        else if (title.includes("gmail")) app = "gmail";
        else if (title.includes("netflix")) app = "netflix";
        else app = "chrome";
      } else if (app === "msedge") {
        if (title.includes("youtube")) app = "youtube-edge";
        else if (title.includes("netflix")) app = "netflix-edge";
        else app = "msedge";
      }

      if (!appMap[app]) appMap[app] = { focused: 0, screen: 0, latestWindowTitle: log.windowTitle || app };

      const duration = log.durationSeconds ?? 0;
      if (log.screenTime) appMap[app].screen += duration;
      else appMap[app].focused += duration;

      if (!appMap[app].latestWindowTitle || appMap[app].latestWindowTitle === app) {
        appMap[app].latestWindowTitle = log.windowTitle || app;
      }
    }

    const result = Object.entries(appMap)
      .map(([app, times]) => ({
        app,
        windowTitle: times.latestWindowTitle,
        focusedTimeSeconds: times.focused,
        screenTimeSeconds: times.screen,
        focusedTimeFormatted: formatDuration(times.focused),
        screenTimeFormatted: formatDuration(times.screen),
        totalTimeSeconds: times.focused + times.screen,
      }))
      .sort((a, b) => b.totalTimeSeconds - a.totalTimeSeconds);

    res.json({
      date: start.toISOString().split("T")[0],
      apps: result,
      summary: {
        totalFocusedSeconds: result.reduce((sum, a) => sum + a.focusedTimeSeconds, 0),
        totalScreenSeconds: result.reduce((sum, a) => sum + a.screenTimeSeconds, 0),
      },
    });
  } catch (err: any) {
    console.error("Summary error:", err);
    if (err.message?.includes("Invalid date")) return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// GET /api/screen-time/total?date=YYYY-MM-DD&deviceId=&deviceUuid=&childId=
app.get("/api/screen-time/total", async (req, res) => {
  try {
    const { start, end } = getDateRange(req.query.date as string | undefined);

    const deviceUuid = req.query.deviceUuid as string | undefined;
    const deviceId = req.query.deviceId ? Number(req.query.deviceId) : undefined;
    const childId = req.query.childId ? Number(req.query.childId) : undefined;

    let whereCommon: any = { timestamp: { gte: start, lt: end } };
    if (deviceId) whereCommon.deviceId = deviceId;
    else if (deviceUuid) {
      const d = await prisma.device.findUnique({ where: { deviceUuid } });
      if (!d) return res.status(404).json({ error: "Device not found" });
      whereCommon.deviceId = d.id;
    } else if (childId) {
      const devices = await prisma.device.findMany({ where: { childId }, select: { id: true } });
      const ids = devices.map((d: { id: number }) => d.id);
      if (ids.length === 0) whereCommon.deviceId = { in: [] };
      else whereCommon.deviceId = { in: ids };
    }

    const screenTimeTotal = await prisma.activityLog.aggregate({
      _sum: { durationSeconds: true },
      where: { ...whereCommon, screenTime: true },
    });

    const focusedTimeTotal = await prisma.activityLog.aggregate({
      _sum: { durationSeconds: true },
      where: { ...whereCommon, screenTime: false },
    });

    const totalScreen = screenTimeTotal._sum?.durationSeconds ?? 0;
    const totalFocused = focusedTimeTotal._sum?.durationSeconds ?? 0;

    res.json({
      date: start.toISOString().split("T")[0],
      totalScreenTimeSeconds: totalScreen,
      totalScreenTimeFormatted: formatDuration(totalScreen),
      totalFocusedTimeSeconds: totalFocused,
      totalFocusedTimeFormatted: formatDuration(totalFocused),
      totalTimeSeconds: totalScreen + totalFocused,
    });
  } catch (err: any) {
    console.error("Total screen time error:", err);
    res.status(500).json({ error: "Failed to compute total screen time" });
  }
});

// ----------------------------- Commands ------------------------------------

// POST /api/commands/kill
app.post("/api/commands/kill", async (req, res) => {
  try {
    const { deviceUuid, deviceId, appName } = req.body;
    if (!appName) return res.status(400).json({ error: "appName required" });

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    await prisma.controlCommand.upsert({
      where: {
        deviceId_appName_action: {
          deviceId: resolvedDeviceId,
          appName: appName.toLowerCase(),
          action: "kill",
        },
      },
      update: { isActive: true, createdAt: new Date() },
      create: {
        deviceId: resolvedDeviceId,
        appName: appName.toLowerCase(),
        action: "kill",
        isActive: true,
      },
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Kill command error:", err);
    res.status(500).json({ error: "Failed to create kill command" });
  }
});

// POST /api/commands/relaunch
app.post("/api/commands/relaunch", async (req, res) => {
  try {
    const { deviceUuid, deviceId, appName } = req.body;
    if (!appName) return res.status(400).json({ error: "appName required" });

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    // Deactivate kill commands for this app on this device
    await prisma.controlCommand.updateMany({
      where: {
        deviceId: resolvedDeviceId,
        appName: appName.toLowerCase(),
        action: "kill",
      },
      data: { isActive: false },
    });

    // Upsert relaunch (one-time)
    await prisma.controlCommand.upsert({
      where: {
        deviceId_appName_action: {
          deviceId: resolvedDeviceId,
          appName: appName.toLowerCase(),
          action: "relaunch",
        },
      },
      update: { isActive: true, createdAt: new Date() },
      create: {
        deviceId: resolvedDeviceId,
        appName: appName.toLowerCase(),
        action: "relaunch",
        isActive: true,
      },
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Relaunch command error:", err);
    res.status(500).json({ error: "Failed to create relaunch command" });
  }
});

// POST /api/commands/schedule
app.post("/api/commands/schedule", async (req, res) => {
  try {
    const { deviceUuid, deviceId, appName, schedule } = req.body;
    if (!appName || !schedule) return res.status(400).json({ error: "appName and schedule required" });

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    await prisma.controlCommand.create({
      data: {
        deviceId: resolvedDeviceId,
        appName: appName.toLowerCase(),
        action: "schedule",
        schedule,
        isActive: true,
      },
    });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Schedule command error:", err);
    res.status(500).json({ error: "Failed to create schedule command" });
  }
});

// GET /api/commands/pending?deviceUuid=&deviceId=
app.get("/api/commands/pending", async (req, res) => {
  try {
    const deviceUuid = req.query.deviceUuid as string | undefined;
    const deviceId = req.query.deviceId ? Number(req.query.deviceId) : undefined;
    const machineName = req.query.machineName as string | undefined;
    if (!deviceUuid && !deviceId && !machineName) return res.status(400).json({ error: "deviceUuid or deviceId required" });

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId, machineName);

    const commands = await prisma.controlCommand.findMany({
      where: { deviceId: resolvedDeviceId, isActive: true },
      select: { id: true, appName: true, action: true, schedule: true },
    });

    // Deactivate one-time commands (relaunch / schedule)
    const oneTimeIds = commands.filter((c: { action: string }) => c.action !== "kill").map((c: { id: number }) => c.id);
    if (oneTimeIds.length > 0) {
      await prisma.controlCommand.updateMany({
        where: { id: { in: oneTimeIds } },
        data: { isActive: false },
      });
    }

    res.json(commands);
  } catch (err: any) {
    console.error("Commands pending error:", err);
    res.status(500).json({ error: "Failed to fetch pending commands" });
  }
});

// POST /api/commands/ack/:id
app.post("/api/commands/ack/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid command ID" });

    const result = await prisma.controlCommand.updateMany({
      where: { id, isActive: true },
      data: { isActive: false },
    });

    if (result.count > 0) console.log(`✅ Acknowledged command ${id}`);
    else console.log(`ℹ️ Command ${id} not found or already inactive`);

    res.json({ success: true });
  } catch (err: any) {
    console.error("Ack command error:", err);
    res.status(500).json({ error: "Failed to acknowledge command" });
  }
});

// ----------------------------- Live Status ---------------------------------

// POST /api/live-status
app.post("/api/live-status", async (req, res) => {
  try {
    const { deviceUuid, deviceId, machineName, apps } = req.body;
    if (!Array.isArray(apps)) return res.status(400).json({ error: "apps array required" });

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId, machineName);

    // Mark existing apps as not running for this device
    await prisma.liveAppStatus.updateMany({
      where: { deviceId: resolvedDeviceId },
      data: { isRunning: false },
    });

    // Upsert each visible app — schema has @@unique([deviceId, appName])
    for (const a of apps) {
      const appName = a.appName ?? (a.windowTitle ?? "").slice(0, 128) ?? "unknown";
      const windowTitle = a.windowTitle ?? "";
      await prisma.liveAppStatus.upsert({
        where: {
          deviceId_appName: {
            deviceId: resolvedDeviceId,
            appName,
          },
        },
        update: {
          windowTitle,
          isRunning: true,
          lastSeen: new Date(),
        },
        create: {
          deviceId: resolvedDeviceId,
          appName,
          windowTitle,
          isRunning: true,
          lastSeen: new Date(),
        },
      });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Live status error:", err);
    res.status(500).json({ error: "Failed to update live status" });
  }
});

// GET /api/live-status?deviceUuid=&deviceId=&machineName=
// GET /api/live-status?deviceUuid=&deviceId=&staleSeconds=90
app.get("/api/live-status", async (req, res) => {
  try {
    const deviceUuid = req.query.deviceUuid as string | undefined;
    const deviceId = req.query.deviceId ? Number(req.query.deviceId) : undefined;
    const staleSeconds = req.query.staleSeconds ? Number(req.query.staleSeconds) : 90;

    if (!deviceUuid && !deviceId) return res.status(400).json({ error: "deviceUuid or deviceId required" });

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    const cutoff = new Date(Date.now() - staleSeconds * 1000);

    const liveApps = await prisma.liveAppStatus.findMany({
      where: { deviceId: resolvedDeviceId, isRunning: true, lastSeen: { gte: cutoff } },
      select: { appName: true, windowTitle: true, lastSeen: true },
    });

    res.json(liveApps);
  } catch (err: any) {
    console.error("Get live status error:", err);
    res.status(500).json({ error: "Failed to get live status" });
  }
});


// ----------------------------- Location ------------------------------------

// POST /api/location
app.post("/api/location", async (req, res) => {
  try {
    console.log("\n==============================");
    console.log("📍 NEW LOCATION PAYLOAD:", req.body);
    console.log("==============================");

   const {
    deviceId,
    // Capture the field as sent by the C++ agent
    deviceMac, 
    latitude,
    longitude,
    accuracy,
    altitude,
    timestamp,
} = req.body;
let macAddress = deviceMac;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    let resolvedDeviceId: number | null = null;

    /* ------------------- TRY MATCHING BY deviceId ------------------- */
    if (!resolvedDeviceId && macAddress) { // macAddress is now set from deviceMac
    console.log("🔍 Trying match by macAddress =", macAddress);
    const d = await prisma.device.findFirst({ where: { macAddress } });
    console.log("➡ macAddress lookup result:", d);
    if (d) resolvedDeviceId = d.id;
}
    // /* ---------------- TRY MATCHING BY deviceUuid ------------------- */
    // if (!resolvedDeviceId && deviceUuid) {
    //   console.log("🔍 Trying match by deviceUuid =", deviceUuid);
    //   const d = await prisma.device.findUnique({ where: { deviceUuid } });
    //   console.log("➡ deviceUuid lookup result:", d);
    //   if (d) resolvedDeviceId = d.id;
    // }

    /* ---------------- TRY MATCHING BY macAddress ------------------- */
    if (!resolvedDeviceId && macAddress) {
      console.log("🔍 Trying match by macAddress =", macAddress);
      const d = await prisma.device.findFirst({ where: { macAddress } });
      console.log("➡ macAddress lookup result:", d);
      if (d) resolvedDeviceId = d.id;
    }

    /* ---------------- NO MATCH FOUND ---------------- */
    if (!resolvedDeviceId) {
      console.log("❌ FINAL RESULT: No matching device found in DB");
      return res.status(404).json({
        error: "Device not registered",
        debug: {
          sent_deviceId: deviceId,
          sent_mac: macAddress,
        }
      });
    }

    /* ---------------- SAVE LOCATION ---------------- */
    const location = await prisma.location.create({
      data: {
        deviceId: resolvedDeviceId,
        latitude,
        longitude,
        accuracy: accuracy ?? null,
        altitude: altitude ?? null,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    await prisma.device.update({
      where: { id: resolvedDeviceId },
      data: { lastSeen: new Date() },
    });

    console.log(`📍 LOCATION SAVED for device ${resolvedDeviceId}`);
    res.json({ success: true, locationId: location.id });

  } catch (err: unknown) {
  const error = err instanceof Error ? err : new Error(String(err));

  console.error("❌ FULL LOCATION ERROR:", error);
  res.status(500).json({ error: error.message });
}

});


// GET /api/location/latest?deviceUuid=&deviceId=
app.get("/api/location/latest", async (req, res) => {
  try {
    const deviceUuid = req.query.deviceUuid as string | undefined;
    const deviceId = req.query.deviceId ? Number(req.query.deviceId) : undefined;

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    const location = await prisma.location.findFirst({
      where: { deviceId: resolvedDeviceId },
      orderBy: { timestamp: "desc" },
    });

    if (!location) {
      return res.status(404).json({ error: "No location data found" });
    }

    res.json(location);
  } catch (err: any) {
    console.error("Get location error:", err);
    res.status(500).json({ error: "Failed to get location" });
  }
});

// GET /api/devices/:deviceUuid/location
app.get("/api/devices/:deviceUuid/location", async (req, res) => {
  try {
    const { deviceUuid } = req.params;

    if (!deviceUuid) {
      return res.status(400).json({ error: "deviceUuid is required" });
    }

    // Use 'deviceUuid' (model field name), not 'uuid'
    const device = await prisma.device.findUnique({
      where: { deviceUuid }, // shorthand for { deviceUuid: deviceUuid }
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    const location = await prisma.location.findFirst({
      where: { deviceId: device.id },
      orderBy: { timestamp: "desc" },
    });

    if (!location) {
      return res.status(404).json({ error: "No location recorded yet" });
    }

    res.json({
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      altitude: location.altitude,
      timestamp: location.timestamp.toISOString(),
    });
  } catch (err: any) {
    console.error("Failed to fetch device location:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/location/history?deviceUuid=&deviceId=&date=YYYY-MM-DD&limit=100
app.get("/api/location/history", async (req, res) => {
  try {
    const deviceUuid = req.query.deviceUuid as string | undefined;
    const deviceId = req.query.deviceId ? Number(req.query.deviceId) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 100;

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    let where: any = { deviceId: resolvedDeviceId };

    // Optional date filter
    if (req.query.date) {
      const { start, end } = getDateRange(req.query.date as string);
      where.timestamp = { gte: start, lt: end };
    }

    const locations = await prisma.location.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    res.json(locations);
  } catch (err: any) {
    console.error("Location history error:", err);
    res.status(500).json({ error: "Failed to get location history" });
  }
});

// ----------------------------- Alerts --------------------------------------

// POST /api/alerts
app.post("/api/alerts", async (req, res) => {
  try {
    const {
      deviceUuid,
      deviceId,
      appName,
      type,
      timestamp,
      details,
      url,
      badWords,
      windowTitle,
    } = req.body;

    if (!type) return res.status(400).json({ error: "Missing required field: type" });

    const resolvedDeviceId = await resolveDeviceId(deviceUuid, deviceId);

    // Build consolidated details object
    let finalDetails: any = {};
    if (details) {
      try {
        finalDetails = typeof details === "string" ? JSON.parse(details) : details;
      } catch {
        finalDetails = { raw: details };
      }
    }

    if (appName) finalDetails.appName = appName;
    if (windowTitle) finalDetails.windowTitle = windowTitle;
    if (url) finalDetails.url = url;
    if (badWords) finalDetails.badWords = badWords;

    const alert = await prisma.alert.create({
      data: {
        deviceId: resolvedDeviceId,
        appName: appName ?? "unknown",
        type,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        details: JSON.stringify(finalDetails),
      },
    });

    res.status(201).json({ success: true, id: alert.id });
  } catch (err: any) {
    console.error("Alert error:", err);
    res.status(500).json({ error: "Failed to save alert" });
  }
});


// --- ASSUMED IMPORTS & SETUP ---
// const express = require('express');
// const app = express();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const httpServer = require('http').createServer(app); 
// const PARENT_SECRET = 'your-secret-key';
// app.use(express.json()); // Essential for parsing POST body
// -------------------------------


// =========================================================================
// 1. DEVICE ROUTES
// =========================================================================

// GET /api/devices/unassigned
// Fetches devices that are not currently linked to any child (childId: null).
app.get("/api/devices/unassigned", async (req, res) => {
    try {
        const devices = await prisma.device.findMany({
            where: { childId: null },
            select: {
                id: true,
                deviceUuid: true,
                machineName: true,
                userName: true,
                macAddress: true,
            }
        });

        res.json({ devices });
    } catch (err) {
        // Safe TypeScript error handling for 'unknown' type
        const errorMessage = (err instanceof Error) ? err.message : "Failed to fetch unassigned devices.";
        console.error("Unassigned device fetch error:", err);
        res.status(500).json({ error: errorMessage });
    }
});


// =========================================================================
// 2. CHILD ROUTES
// =========================================================================

// POST /api/children
// Creates a new Child record and optionally assigns an existing Device.
app.post("/api/children", async (req, res) => {
    try {
        const { name, age, gender, dob, phone, deviceId } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Child name is required." });
        }

        // --- STEP 1: Create child record (Must succeed) ---
        const child = await prisma.child.create({
            data: {
                name,
                age: age ? Number(age) : null,
                gender: gender || null,
                dob: dob ? new Date(dob) : null,
                phone: phone || null,
            }
        });

        // --- STEP 2: Assign selected device (Safely Wrapped) ---
        if (deviceId) {
            const deviceIdNum = Number(deviceId);
            if (isNaN(deviceIdNum)) {
                // If the deviceId is malformed, we still create the child, but log the error
                console.error(`Warning: Device ID ${deviceId} is invalid format. Skipping assignment.`);
            } else {
                try {
                    // This operation is the source of the "Device not found" error
                    await prisma.device.update({
                        where: { id: deviceIdNum },
                        data: { childId: child.id },
                    });
                    console.log(`Successfully assigned device ID ${deviceIdNum} to child ${child.id}.`);
                } catch (assignmentError) {
                    // Check specifically for the Prisma record not found error (P2025)
                    if (assignmentError instanceof Error && 'code' in assignmentError && assignmentError.code === 'P2025') {
                        // LOG THE WARNING but continue to allow the child creation to complete (BYPASS)
                        console.warn(`Device ID ${deviceIdNum} not found or assigned elsewhere. Skipping device assignment for child ${child.id}.`);
                        // The user will still receive status 201, but the device won't be linked.
                    } else {
                        // Re-throw any other unexpected database error
                        throw assignmentError;
                    }
                }
            }
        }

        // --- STEP 3: Fetch the final linked object ---
        const created = await prisma.child.findUnique({
            where: { id: child.id },
            include: { devices: true },
        });

        // Respond with the successful creation status, even if the device wasn't linked.
        res.status(201).json({ success: true, child: created });

    } catch (err) {
        // This catch block now only handles errors from Step 1 (Child creation) or unexpected errors from Step 2.
        let errorMessage = "Failed to create child due to a server error.";

        if (err instanceof Error) {
            console.error("Critical Child Creation Error:", err.message);
        } else {
            console.error("Critical Child Creation Error (Non-Error object):", err);
        }
        
        res.status(500).json({ error: errorMessage });
    }
});

// GET /api/children
// Fetches a list of all child records with their associated devices.
app.get("/api/children", async (req, res) => {
    try {
        const children = await prisma.child.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                devices: true // Includes the Device[] relation
            }
        });

        res.json({ children });
    } catch (err) {
        console.error("Get children error:", err);
        res.status(500).json({ error: "Failed to fetch children" });
    }
});

// GET /api/children/:id
// Fetches a single child record by ID.
app.get("/api/children/:id", async (req, res) => {
    try {
        const childId = parseInt(req.params.id);

        if (isNaN(childId) || childId <= 0) {
            return res.status(400).json({ error: "Invalid child ID format." });
        }

        const child = await prisma.child.findUnique({
            where: { id: childId },
            include: { devices: true },
        });

        if (child) {
            res.json({ child });
        } else {
            res.status(404).json({ error: `Child with ID ${childId} not found` });
        }

    } catch (err) {
        console.error(`Get child by ID error for ID ${req.params.id}:`, err);
        res.status(500).json({ error: "Failed to fetch child data" });
    }
});


// =========================================================================
// 3. SERVER SETUP
// =========================================================================

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT) || 3001;
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`🔐 Parent secret token: ${PARENT_SECRET}`);
});