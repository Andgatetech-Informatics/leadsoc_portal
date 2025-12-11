export const getDateRange = (filter) => {
    const now = new Date();
    let startDate, endDate;

    endDate = new Date();

    switch (filter) {
        case "today":
            startDate = new Date();
            break;
            break;
        case "week":
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;

        case "month":
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            break;

        case "6months":
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6);
            break;

        case "year":
            startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;

        default:
            startDate = null;
    }

    return { startDate, endDate };
};
