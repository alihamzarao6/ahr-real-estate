export const convertToUsername = (name) => {
  // Remove spaces and convert to lowercase
  const username = name.replace(/\s/g, "").toLowerCase();

  // Add some random numbers to make it unique ranging from (0, 9999)
 const randomNumber = Math.floor(Math.random() * (9999 - 10 + 1) + 10);

  const finalUsername = `${username}${randomNumber}`;

  return finalUsername;
};
