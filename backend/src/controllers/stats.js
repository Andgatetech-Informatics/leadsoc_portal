const Candidate = require("../models/candidate");
const Event = require("../models/event");
const moment = require("moment");

exports.getCandidateStats = async (req, res) => {
  const params = req.query;

  const startDate = params["range[startDate]"];
  const endDate = params["range[endDate]"];
  const role = params.role;

  const query = {};

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (role && role === "freelancer") {
    query.isFreelancer = true;
  }
  try {
    const stats = await Candidate.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      pending: 0,
      assigned: 0,
      onhold: 0,
      shortlisted: 0,
      approved: 0,
      employee: 0,
      hired: 0,
      trainee: 0,
      deployed: 0,
      rejected: 0,
    };

    stats.forEach((item) => {
      if (formattedStats.hasOwnProperty(item._id)) {
        formattedStats[item._id] = item.count;
      }
    });

    // ✅ Return the complete formatted stats
    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Error fetching candidate stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getTeamLoad = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const result = await Candidate.aggregate([
      {
        $match: {
          assignedTo: { $ne: null },
          updatedAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          candidateCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          hrId: "$userDetails._id",
          name: {
            $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"],
          },
          email: "$userDetails.email",
          role: "$userDetails.role",
          candidateCount: 1,
        },
      },
      {
        $match: {
          role: "hr",
        },
      },
      {
        $sort: { candidateCount: -1 },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching team load stats",
      error: error.message,
    });
  }
};

exports.getDomainStats = async (req, res) => {
  const range = req.query;

  const startDate = range["range[startDate]"];
  const endDate = range["range[endDate]"];
  try {
    const domainCounts = await Candidate.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      { $unwind: "$domain" },
      {
        $group: {
          _id: "$domain",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          domain: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(domainCounts);
  } catch (error) {
    console.error("Error fetching domain counts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getEventChart = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type)
      return res.status(400).json({ error: "type parameter required" });

    let startDate, endDate, groupFormat, momentFormat, labelFormat;

    switch (type) {
      case "today":
        startDate = moment().startOf("day");
        endDate = moment().endOf("day");
        groupFormat = "%H"; // hour 00–23
        momentFormat = "H"; // 0–23
        labelFormat = "HH:mm"; // label format
        break;

      case "week":
        startDate = moment().startOf("week");
        endDate = moment().endOf("week");
        groupFormat = "%Y-%m-%d";
        momentFormat = "YYYY-MM-DD";
        labelFormat = "dddd";
        break;

      case "month":
        startDate = moment().startOf("month");
        endDate = moment().endOf("day");
        groupFormat = "%Y-%m-%d";
        momentFormat = "YYYY-MM-DD";
        labelFormat = "D";
        break;

      case "6months":
        startDate = moment().subtract(5, "months").startOf("month");
        endDate = moment().endOf("month");
        groupFormat = "%Y-%m";
        momentFormat = "YYYY-MM";
        labelFormat = "MMMM";
        break;

      case "year":
        startDate = moment().subtract(11, "months").startOf("month");
        endDate = moment().endOf("month");
        groupFormat = "%Y-%m";
        momentFormat = "YYYY-MM";
        labelFormat = "MMMM";
        break;

      default:
        return res.status(400).json({ error: "Invalid type" });
    }

    // Fetch aggregated events
    const events = await Event.aggregate([
      {
        $match: {
          updatedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$updatedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ------------------------------------------
    // 📌 TYPE = TODAY → Hour-wise (0–23)
    // ------------------------------------------
    if (type === "today") {
      const hourMap = {};
      events.forEach((item) => {
        const hr = moment(item._id, momentFormat).hour(); // 0–23
        hourMap[hr] = item.count;
      });

      const fullData = [];
      for (let h = 0; h <= 23; h++) {
        fullData.push({
          label: `${String(h).padStart(2, "0")}:00`, // 00:00 → 23:00
          count: hourMap[h] || 0,
        });
      }

      return res.status(200).json({ type, data: fullData });
    }

    // ------------------------------------------
    // 📌 MONTH → Day-wise (1 → today)
    // ------------------------------------------
    if (type === "month") {
      const eventMap = {};
      events.forEach((item) => {
        const day = moment(item._id, momentFormat).format("D");
        eventMap[day] = item.count;
      });

      const today = moment().date();
      const fullData = [];

      for (let d = 1; d <= today; d++) {
        fullData.push({
          label: `${d}`,
          count: eventMap[d] || 0,
        });
      }

      return res.status(200).json({ type, data: fullData });
    }

    // ------------------------------------------
    // 📌 6months & YEAR → Month-wise
    // ------------------------------------------
    if (type === "6months" || type === "year") {
      const monthCountMap = {};
      events.forEach((item) => {
        const key = moment(item._id, momentFormat).format("YYYY-MM");
        monthCountMap[key] = item.count;
      });

      const totalMonths = type === "6months" ? 6 : 12;
      const fullData = [];

      for (let i = totalMonths - 1; i >= 0; i--) {
        const m = moment().subtract(i, "months");
        const key = m.format("YYYY-MM");

        fullData.push({
          label: m.format("MMMM"),
          count: monthCountMap[key] || 0,
        });
      }

      return res.status(200).json({ type, data: fullData });
    }

    // ------------------------------------------
    // 📌 WEEK → Just map labels
    // ------------------------------------------
    const formatted = events.map((item) => ({
      label: moment(item._id, momentFormat).format(labelFormat),
      count: item.count,
    }));

    return res.status(200).json({ type, data: formatted });
  } catch (error) {
    console.error("Error fetching event chart data:", error);
    res.status(500).json({ error: "Server error" });
  }
};
