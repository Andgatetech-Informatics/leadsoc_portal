export const convertPDFToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const convertMultipleFilesToBase64 = (files) => {
  if (!files || files.length === 0) return Promise.resolve([]);

  const promises = Array.from(files).map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // convert file to base64
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  });

  return Promise.all(promises);
};

export const toDatetimeLocalValue = (value) => {
  if (!value) return "";
  const date = typeof value === "object" && value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  // shift to local by removing timezone offset, then to ISO and slice to minutes
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffsetMs);
  return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}

export const localDatetimeToISOString = (localString) => {
  if (!localString) return null;
  // "2025-11-20T15:30" -> Date in local timezone
  const localDate = new Date(localString);
  return localDate.toISOString(); // includes Z (UTC)
}