import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";
import ParkingArea from "../models/ParkingArea.js";
import mongoose from 'mongoose';

export const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Static Counts (Quick look)
    const totalParkingAreas = await ParkingArea.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: "ACTIVE" });

    // 2. Complex Time-Series & Revenue Analysis
    const analytics = await Booking.aggregate([
      {
        $facet: {
          // A. Revenue & Booking counts grouped by Date (Last 7 Days)
          dailyStats: [
            { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$totalAmount" },
                bookings: { $sum: 1 }
              }
            },
            { $sort: { "_id": 1 } }
          ],
          
          // B. Global Totals (Cumulative)
          totals: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                completedBookings: { 
                  $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } 
                }
              }
            }
          ],

          // C. Occupancy by Parking Area (Top Performers)
          areaPerformance: [
            {
              $group: {
                _id: "$parkingAreaName",
                totalRevenue: { $sum: "$totalAmount" },
                usageCount: { $sum: 1 }
              }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
          ],

          // D. Hourly occupancy data for live chart
          hourlyOccupancy: [
            { $match: { status: "ACTIVE" } },
            {
              $group: {
                _id: { $hour: "$startTime" },
                count: { $sum: 1 }
              }
            },
            { $sort: { "_id": 1 } }
          ]
        }
      }
    ]);

    const result = analytics[0];

    // Calculate total slots for occupancy percentage
    const totalSlots = await Slot.countDocuments();
    
    // Format hourly occupancy data for the chart
    const occupancyChart = [];
    for (let hour = 0; hour < 24; hour += 4) {
      const hourData = result.hourlyOccupancy.find(h => h._id === hour);
      const occupancyCount = hourData?.count || 0;
      const occupancyPercent = totalSlots > 0 ? Math.round((occupancyCount / totalSlots) * 100) : 0;
      
      occupancyChart.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        occupancy: occupancyPercent
      });
    }

    res.json({
      summary: {
        totalParkingAreas,
        activeBookings,
        totalRevenue: result.totals[0]?.totalRevenue || 0,
        completedBookings: result.totals[0]?.completedBookings || 0
      },
      timeSeries: result.dailyStats,
      topAreas: result.areaPerformance,
      occupancyChart
    });

  } catch (error) {
    res.status(500).json({ message: "Admin analytics failed", error: error.message });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Booking.aggregate([
      // 1. Filter bookings for this specific user
      { $match: { user: userId } },

      // 2. Group data to calculate complex metrics
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          avgAmount: { $avg: "$totalAmount" },
          // Calculates average duration (assuming you store duration in minutes/hours)
          avgDuration: { $avg: "$duration" },
          // Collect all parking area names to find the favorite
          parkingAreas: { $push: "$parkingAreaName" },
          // Group spending by month for your charts
          monthlyData: {
            $push: {
              date: "$createdAt",
              amount: "$totalAmount"
            }
          }
        }
      },

      // 3. Clean up the output
      {
        $project: {
          _id: 0,
          totalBookings: 1,
          totalSpent: { $round: ["$totalSpent", 2] },
          avgAmount: { $round: ["$avgAmount", 2] },
          avgDuration: { $round: ["$avgDuration", 1] },
          monthlyData: 1,
          // Simple logic to find favorite area: picks the first one in this example
          favoriteArea: { $arrayElemAt: ["$parkingAreas", 0] }
        }
      }
    ]);

    // If no bookings found, return default zeros
    res.json(stats[0] || { 
      totalBookings: 0, 
      totalSpent: 0, 
      avgAmount: 0, 
      avgDuration: 0, 
      monthlyData: [],
      favoriteArea: "N/A" 
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
};

// Advanced User Analytics
export const getAdvancedUserAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const analytics = await Booking.aggregate([
      { $match: { user: userId, status: "COMPLETED" } },
      {
        $facet: {
          // Spending by day of week
          dayOfWeekSpending: [
            {
              $group: {
                _id: { $dayOfWeek: "$createdAt" },
                totalSpent: { $sum: "$totalAmount" },
                count: { $sum: 1 }
              }
            },
            { $sort: { "_id": 1 } }
          ],
          // Monthly spending trends
          monthlyTrends: [
            {
              $group: {
                _id: { 
                  month: { $month: "$createdAt" },
                  year: { $year: "$createdAt" }
                },
                totalSpent: { $sum: "$totalAmount" },
                sessions: { $sum: 1 }
              }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 }
          ],
          // Top parking locations
          topLocations: [
            {
              $group: {
                _id: "$parkingAreaName",
                visits: { $sum: 1 },
                totalSpent: { $sum: "$totalAmount" }
              }
            },
            { $sort: { visits: -1 } },
            { $limit: 5 }
          ],
          // Time spent analysis
          timeAnalysis: [
            {
              $group: {
                _id: null,
                avgDuration: { $avg: "$duration" },
                totalDuration: { $sum: "$duration" },
                avgTicket: { $avg: "$totalAmount" }
              }
            }
          ]
        }
      }
    ]);

    const result = analytics[0];

    res.json({
      dayOfWeekSpending: result.dayOfWeekSpending,
      monthlyTrends: result.monthlyTrends,
      topLocations: result.topLocations,
      timeAnalysis: result.timeAnalysis[0] || { avgDuration: 0, totalDuration: 0, avgTicket: 0 }
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching advanced analytics", error: error.message });
  }
};

// Advanced Admin Analytics
export const getAdvancedAdminAnalytics = async (req, res) => {
  try {
    const analytics = await Booking.aggregate([
      {
        $facet: {
          // Revenue growth (daily for last 30 days)
          revenueGrowth: [
            { 
              $match: { 
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                status: "COMPLETED"
              } 
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$totalAmount" },
                sessions: { $sum: 1 }
              }
            },
            { $sort: { "_id": 1 } }
          ],
          // Peak hours analysis
          peakHours: [
            { $match: { status: "COMPLETED" } },
            {
              $group: {
                _id: { $hour: "$startTime" },
                sessions: { $sum: 1 },
                revenue: { $sum: "$totalAmount" }
              }
            },
            { $sort: { "_id": 1 } }
          ],
          // User retention (repeat vs one-time)
          userRetention: [
            { $match: { status: "COMPLETED" } },
            {
              $group: {
                _id: "$user",
                totalBookings: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
              }
            },
            {
              $group: {
                _id: null,
                repeatUsers: {
                  $sum: { $cond: [{ $gt: ["$totalBookings", 1] }, 1, 0] }
                },
                oneTimeUsers: {
                  $sum: { $cond: [{ $eq: ["$totalBookings", 1] }, 1, 0] }
                },
                repeatRevenue: {
                  $sum: { $cond: [{ $gt: ["$totalBookings", 1] }, "$totalRevenue", 0] }
                },
                oneTimeRevenue: {
                  $sum: { $cond: [{ $eq: ["$totalBookings", 1] }, "$totalRevenue", 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    const result = analytics[0];

    // Get slot performance from Slot model
    const slotStats = await Slot.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const slotPerformance = {
      available: slotStats.find(s => s._id === "AVAILABLE")?.count || 0,
      booked: slotStats.find(s => s._id === "BOOKED")?.count || 0,
      outOfService: slotStats.find(s => s._id === "OUT_OF_SERVICE")?.count || 0
    };

    res.json({
      revenueGrowth: result.revenueGrowth,
      peakHours: result.peakHours,
      userRetention: result.userRetention[0] || { repeatUsers: 0, oneTimeUsers: 0, repeatRevenue: 0, oneTimeRevenue: 0 },
      slotPerformance
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching advanced analytics", error: error.message });
  }
};