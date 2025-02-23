export const getTime = (date: string): string => {
    var d = new Date(Number(date) * 1000);
    return (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) + ":" +
        (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + " " +
        (d.getHours() >= 12 ? "PM" : "AM");
};

export const getDate = (date: string): string => {
    var d = new Date(Number(date) * 1000);
    return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
};
