const ipinfo = require("ipinfo");

async function checkIndiaIp(req, res, next) {
  const userIpAddress = req.ip;

  try {
    const response = await ipinfo(userIpAddress);
    const country = response.country;

    if (country === "IN") {
      req.isInIndia = true;
    } else {
      req.isInIndia = false;
    }

    next();
  } catch (error) {
    console.error("Error checking IP geolocation:", error);
    req.isInIndia = false;
    next();
  }
}

module.exports = checkIndiaIp;
