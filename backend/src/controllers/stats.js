const Candidate = require("../models/candidate");
const Event = require("../models/event");
const moment = require("moment-timezone");
const IST = "Asia/Kolkata";


exports.getCandidateStats = async (req, res) => {
  const params = req.query;
  const user = req.user;

  const startDate = params["range[startDate]"];
  const endDate = params["range[endDate]"];
  const role = params.role;

  const query = {};

  if (startDate && endDate) {
    query.updatedAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (role && (role === "vendor")) {
    query.vendorReferred = true;
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
          role: "ta",
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
  const params = req.query;

  const startDate = params["range[startDate]"];
  const endDate = params["range[endDate]"];
  const role = params.role;

  const query = {};

  if (startDate && endDate) {
    query.updatedAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (role && role === "vendor") {
    query.vendorReferred = true;
  }

  try {
    const domainCounts = await Candidate.aggregate([
      // {
      //   $match: {
      //     createdAt: {
      //       $gte: new Date(startDate),
      //       $lte: new Date(endDate),
      //     },
      //   },
      // },

      { $match: query },
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
    const { role } = req.user;
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: "type parameter required" });
    }

    /**
     * ------------------------------------
     * 📌 Chart Configuration (IST)
     * ------------------------------------
     */
    const CHART_CONFIG = {
      today: {
        start: moment.tz(IST).startOf("day"),
        end: moment.tz(IST).endOf("day"),
        mongoFormat: "%H",
        range: 24,
        label: (h) => `${String(h).padStart(2, "0")}:00`,
      },

      week: {
        start: moment.tz(IST).startOf("week"),
        end: moment.tz(IST).endOf("week"),
        mongoFormat: "%Y-%m-%d",
        labelFormat: "dddd",
      },

      month: {
        start: moment.tz(IST).startOf("month"),
        end: moment.tz(IST).endOf("day"),
        mongoFormat: "%Y-%m-%d",
      },

      "6months": {
        start: moment.tz(IST).subtract(5, "months").startOf("month"),
        end: moment.tz(IST).endOf("month"),
        mongoFormat: "%Y-%m",
        months: 6,
      },

      year: {
        start: moment.tz(IST).subtract(11, "months").startOf("month"),
        end: moment.tz(IST).endOf("month"),
        mongoFormat: "%Y-%m",
        months: 12,
      },
    };

    const config = CHART_CONFIG[type];
    if (!config) {
      return res.status(400).json({ error: "Invalid type" });
    }

    /**
     * ------------------------------------
     * 📌 Mongo Filter
     * ------------------------------------
     */
    const filter = {
      updatedAt: {
        $gte: config.start.toDate(),
        $lte: config.end.toDate(),
      },
    };

    if (role === "vendor") {
      filter["candidate.candidateType"] = "vendor";
    }

    /**
     * ------------------------------------
     * 📌 Aggregation (IST Aware)
     * ------------------------------------
     */
    const events = await Event.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: config.mongoFormat,
              date: "$updatedAt",
              timezone: IST,
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /**
     * ------------------------------------
     * 📌 TODAY → Hour-wise (0–23)
     * ------------------------------------
     */
    if (type === "today") {
      const map = Object.fromEntries(
        events.map((e) => [Number(e._id), e.count])
      );

      const data = Array.from({ length: config.range }, (_, h) => ({
        label: config.label(h),
        count: map[h] || 0,
      }));

      return res.status(200).json({ type, data });
    }

    /**
     * ------------------------------------
     * 📌 MONTH → Day-wise
     * ------------------------------------
     */
    if (type === "month") {
      const map = {};
      events.forEach(({ _id, count }) => {
        const day = moment.tz(_id, "YYYY-MM-DD", IST).date();
        map[day] = count;
      });

      const today = moment.tz(IST).date();
      const data = Array.from({ length: today }, (_, i) => ({
        label: String(i + 1),
        count: map[i + 1] || 0,
      }));

      return res.status(200).json({ type, data });
    }

    /**
     * ------------------------------------
     * 📌 6 MONTHS / YEAR → Month-wise
     * ------------------------------------
     */
    if (config.months) {
      const map = Object.fromEntries(
        events.map((e) => [e._id, e.count])
      );

      const data = Array.from({ length: config.months }, (_, i) => {
        const m = moment
          .tz(IST)
          .subtract(config.months - 1 - i, "months");

        const key = m.format("YYYY-MM");

        return {
          label: m.format("MMMM"),
          count: map[key] || 0,
        };
      });

      return res.status(200).json({ type, data });
    }

    /**
     * ------------------------------------
     * 📌 WEEK → Day name mapping
     * ------------------------------------
     */
    const data = events.map(({ _id, count }) => ({
      label: moment.tz(_id, "YYYY-MM-DD", IST).format(config.labelFormat),
      count,
    }));

    return res.status(200).json({ type, data });
  } catch (error) {
    console.error("Error fetching event chart data:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

