const getUserTime = () => {
  const currentDate = Date.now();
  const date = new Date(currentDate);
  // this returns 420 which is the time difference in minutes
  // between UTC and your time zone
  const difference =(((date.getTimezoneOffset() * 60) * 1000));
  // it must be multiplied by 60 to get seconds followed by 1000
  // to get milliseconds
  const usertime = (currentDate - difference);
  return usertime;
};
module.exports = getUserTime;
