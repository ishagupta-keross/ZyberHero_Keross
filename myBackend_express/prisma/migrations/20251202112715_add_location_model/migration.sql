-- CreateTable
CREATE TABLE "children" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT,
    "name" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "devices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deviceUuid" TEXT NOT NULL,
    "macAddress" TEXT,
    "machineName" TEXT,
    "userName" TEXT,
    "os" TEXT,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "childId" INTEGER,
    CONSTRAINT "devices_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "localTimestamp" DATETIME,
    "appName" TEXT NOT NULL,
    "windowTitle" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "executablePath" TEXT,
    "screenTime" BOOLEAN NOT NULL DEFAULT false,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "activity_logs_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "control_commands" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "schedule" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "control_commands_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "live_app_status" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appName" TEXT NOT NULL,
    "windowTitle" TEXT NOT NULL,
    "isRunning" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "live_app_status_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "alerts_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "locations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "accuracy" REAL,
    "altitude" REAL,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "locations_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_deviceUuid_key" ON "devices"("deviceUuid");

-- CreateIndex
CREATE INDEX "devices_macAddress_idx" ON "devices"("macAddress");

-- CreateIndex
CREATE INDEX "devices_deviceUuid_idx" ON "devices"("deviceUuid");

-- CreateIndex
CREATE INDEX "activity_logs_deviceId_idx" ON "activity_logs"("deviceId");

-- CreateIndex
CREATE INDEX "activity_logs_timestamp_idx" ON "activity_logs"("timestamp");

-- CreateIndex
CREATE INDEX "control_commands_deviceId_idx" ON "control_commands"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "control_commands_deviceId_appName_action_key" ON "control_commands"("deviceId", "appName", "action");

-- CreateIndex
CREATE INDEX "live_app_status_deviceId_idx" ON "live_app_status"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "live_app_status_deviceId_appName_key" ON "live_app_status"("deviceId", "appName");

-- CreateIndex
CREATE INDEX "alerts_deviceId_idx" ON "alerts"("deviceId");

-- CreateIndex
CREATE INDEX "locations_deviceId_idx" ON "locations"("deviceId");

-- CreateIndex
CREATE INDEX "locations_timestamp_idx" ON "locations"("timestamp");
