const Counter = require("../models/counter");

const generateJobId = async () => {
    const year = new Date().getFullYear();
    const counterName = `job-${year}`;

    const counter = await Counter.findOneAndUpdate(
        { name: counterName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    return `JOB-${year}-${String(counter.seq).padStart(4, "0")}`;
};

module.exports = generateJobId;