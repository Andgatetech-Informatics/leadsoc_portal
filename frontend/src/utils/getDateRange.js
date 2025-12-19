export const getDateRange = (filter) => {
    const now = new Date();

    let startDate = null;
    let endDate = new Date();

    // Normalize end date → end of today
    endDate.setHours(23, 59, 59, 999);

    switch (filter) {
        case "today": {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            break;
        }

        case "week": {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
            break;
        }

        case "month": {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            startDate.setHours(0, 0, 0, 0);
            break;
        }

        case "6months": {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6);
            startDate.setHours(0, 0, 0, 0);
            break;
        }

        case "year": {
            startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
            startDate.setHours(0, 0, 0, 0);
            break;
        }

        default:
            startDate = null;
    }

    return { startDate, endDate };
};
