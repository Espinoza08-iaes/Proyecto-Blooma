import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

// Bidirectional Sync Endpoint
router.post('/', authMiddleware, async (req, res) => {
  const { cycles = [], dailyLogs = [], triageRecords = [] } = req.body;
  const userId = req.userId;

  try {
    const serverCycles = await db.getCycles();
    const serverDailyLogs = await db.getDailyLogs();
    const serverTriageRecords = await db.getTriageRecords();

    // --- SYNC CYCLES ---
    const userServerCycles = serverCycles.filter(c => c.userId === userId);
    const updatedCycles = [];

    // Process client cycles
    for (const clientCycle of cycles) {
      const serverMatchIndex = serverCycles.findIndex(
        c => c.userId === userId && c.startDate === clientCycle.startDate
      );

      if (serverMatchIndex !== -1) {
        const serverCycle = serverCycles[serverMatchIndex];
        const clientTime = new Date(clientCycle.updatedAt || 0).getTime();
        const serverTime = new Date(serverCycle.updatedAt || 0).getTime();

        if (clientCycle.deleted) {
          // Client deleted it
          if (clientTime > serverTime) {
            serverCycles.splice(serverMatchIndex, 1);
          }
        } else if (clientTime > serverTime) {
          // Client has newer version
          serverCycles[serverMatchIndex] = {
            ...serverCycle,
            endDate: clientCycle.endDate,
            duration: clientCycle.duration,
            updatedAt: clientCycle.updatedAt || new Date().toISOString()
          };
        }
      } else if (!clientCycle.deleted) {
        // New client cycle, add to server
        serverCycles.push({
          userId,
          startDate: clientCycle.startDate,
          endDate: clientCycle.endDate,
          duration: clientCycle.duration,
          updatedAt: clientCycle.updatedAt || new Date().toISOString()
        });
      }
    }

    // --- SYNC DAILY LOGS ---
    for (const clientLog of dailyLogs) {
      const serverMatchIndex = serverDailyLogs.findIndex(
        l => l.userId === userId && l.date === clientLog.date
      );

      if (serverMatchIndex !== -1) {
        const serverLog = serverDailyLogs[serverMatchIndex];
        const clientTime = new Date(clientLog.updatedAt || 0).getTime();
        const serverTime = new Date(serverLog.updatedAt || 0).getTime();

        if (clientLog.deleted) {
          if (clientTime > serverTime) {
            serverDailyLogs.splice(serverMatchIndex, 1);
          }
        } else if (clientTime > serverTime) {
          serverDailyLogs[serverMatchIndex] = {
            ...serverLog,
            mood: clientLog.mood,
            notes: clientLog.notes,
            flow: clientLog.flow,
            pain: clientLog.pain,
            temperature: clientLog.temperature,
            hotFlashes: clientLog.hotFlashes,
            sleepQuality: clientLog.sleepQuality,
            anxietyLevel: clientLog.anxietyLevel,
            updatedAt: clientLog.updatedAt || new Date().toISOString()
          };
        }
      } else if (!clientLog.deleted) {
        serverDailyLogs.push({
          userId,
          date: clientLog.date,
          mood: clientLog.mood,
          notes: clientLog.notes,
          flow: clientLog.flow,
          pain: clientLog.pain,
          temperature: clientLog.temperature,
          hotFlashes: clientLog.hotFlashes,
          sleepQuality: clientLog.sleepQuality,
          anxietyLevel: clientLog.anxietyLevel,
          updatedAt: clientLog.updatedAt || new Date().toISOString()
        });
      }
    }

    // --- SYNC TRIAGE RECORDS ---
    for (const clientTriage of triageRecords) {
      const serverMatchIndex = serverTriageRecords.findIndex(
        t => t.userId === userId && t.date === clientTriage.date
      );

      if (serverMatchIndex !== -1) {
        const serverTriage = serverTriageRecords[serverMatchIndex];
        const clientTime = new Date(clientTriage.updatedAt || 0).getTime();
        const serverTime = new Date(serverTriage.updatedAt || 0).getTime();

        if (clientTriage.deleted) {
          if (clientTime > serverTime) {
            serverTriageRecords.splice(serverMatchIndex, 1);
          }
        } else if (clientTime > serverTime) {
          serverTriageRecords[serverMatchIndex] = {
            ...serverTriage,
            gestationWeek: clientTriage.gestationWeek,
            symptoms: clientTriage.symptoms,
            classification: clientTriage.classification,
            notes: clientTriage.notes,
            updatedAt: clientTriage.updatedAt || new Date().toISOString()
          };
        }
      } else if (!clientTriage.deleted) {
        serverTriageRecords.push({
          userId,
          date: clientTriage.date,
          gestationWeek: clientTriage.gestationWeek,
          symptoms: clientTriage.symptoms,
          classification: clientTriage.classification,
          notes: clientTriage.notes,
          updatedAt: clientTriage.updatedAt || new Date().toISOString()
        });
      }
    }

    // Save changes to disk
    await db.commit();

    // Retrieve fresh lists to send back to client
    const freshCycles = serverCycles.filter(c => c.userId === userId);
    const freshDailyLogs = serverDailyLogs.filter(l => l.userId === userId);
    const freshTriageRecords = serverTriageRecords.filter(t => t.userId === userId);

    res.json({
      cycles: freshCycles,
      dailyLogs: freshDailyLogs,
      triageRecords: freshTriageRecords,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Error durante la sincronización de datos.' });
  }
});

export default router;
