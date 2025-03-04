export const elapsedTime = async function (ourfirstdate, ourlastdate) {
    
    let difference_with_words = "";


    //get the difference in an array
    const theresult = await DateDifference(ourfirstdate, ourlastdate);

    //build a text string with some fancy words
    difference_with_words = await getZeroRebuildDifference(theresult);
    
    return (difference_with_words);

  }


async function DateDifference(Date1, Date2) {
  //---------------------------
  const dateDifferenceInSeconds = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / 1_000;

  const dateDifferenceInMinutes = (dateInitial, dateFinal) =>
    Math.floor((dateFinal - dateInitial) / 60_000);

  const dateDifferenceInHours = (dateInitial, dateFinal) =>
    Math.floor((dateFinal - dateInitial) / 3_600_000);

  const dateDifferenceInDays = (dateInitial, dateFinal) =>
    Math.floor((dateFinal - dateInitial) / 86_400_000);

  const dateDifferenceInMonths = (dateInitial, dateFinal) =>
    Math.floor(
      (dateFinal.getFullYear() - dateInitial.getFullYear()) * 12 +
        dateFinal.getMonth() -
        dateInitial.getMonth(),
    );

  const dateDifferenceInYears = (dateInitial, dateFinal) =>
    dateDifferenceInMonths(dateInitial, dateFinal) / 12;

  /*
  console.log(
    "Seconds: " + dateDifferenceInSeconds(
      new Date(Date1),
      new Date(Date2),
    ),
  );

  console.log(
    "Minutes: " + dateDifferenceInMinutes(
      new Date(Date1),
      new Date(Date2),
    ),
  );

  console.log(
    "Hours: " + dateDifferenceInHours(
      new Date(Date1),
      new Date(Date2),
    ),
  );

  console.log(
    "Days: " + dateDifferenceInDays(
      new Date(Date1),
      new Date(Date2),
    ),
  );

  console.log(
    "Months: " + dateDifferenceInMonths(
      new Date(Date1),
      new Date(Date2),
    ),
  );

  console.log(
    "Years: " + dateDifferenceInYears(
      new Date(Date1),
      new Date(Date2),
    ),
  );

  console.log("-------------------------");
  */
  var d = await timeDiff(
    new Date(Date1),
    new Date(Date2),
  );
  // Log that
  // console.log(d.years + d.months +  d.days  + d.hours + d.minutes + d.seconds);
  // console.log("Logging that...");
  // console.log("D: " + d);

  return d;
}

//https://gist.github.com/spoeken/4705863

// Time difference function
async function timeDiff(start, end) {
  //today, now!
  //Get the diff
  var diff = end - start;
  //Create numbers for dividing to get hour, minute and second diff
  var units = [
    1000 * 60 * 60 * 24,
    1000 * 60 * 60,
    1000 * 60,
    1000,
  ];

  var rv = []; // h, m, s array
  //loop through d, h, m, s. we are not gonna use days, its just there to subtract it from the time
  for (var i = 0; i < units.length; ++i) {
    rv.push(Math.floor(diff / units[i]));
    diff = diff % units[i];
  }

  //Get the year of this year
  var thisFullYear = end.getFullYear();
  //Check how many days there where in last month
  var daysInLastMonth = new Date(thisFullYear, end.getMonth(), 0).getDate();
  //Get this month
  var thisMonth = end.getMonth();
  //Subtract to get differense between years
  thisFullYear = thisFullYear - start.getFullYear();
  //Subtract to get differense between months
  thisMonth = thisMonth - start.getMonth();
  //If month is less than 0 it means that we are some moths before the start date in the year.
  // So we subtract one year, and add the negative number (month) to 12. (12 + -1 = 11)
  let subAddDays = daysInLastMonth - start.getDate();
  let thisDay = end.getDate();
  thisMonth = thisMonth - 1;
  if (thisMonth < 0) {
    thisFullYear = thisFullYear - 1;
    thisMonth = 12 + thisMonth;
    //Get ends day of the month
  }
  //Subtract the start date from the number of days in the last month, add add the result to todays day of the month
  subAddDays = daysInLastMonth - start.getDate();
  subAddDays = thisDay + subAddDays;

  if (subAddDays >= daysInLastMonth) {
    subAddDays = subAddDays - daysInLastMonth;
    thisMonth++;
    if (thisMonth > 11) {
      thisFullYear++;
      thisMonth = 0;
    }
  }

  const returnarray = [];
  returnarray.push(thisFullYear, thisMonth, subAddDays, rv[1], rv[2], rv[3]);
  return returnarray;
  
}

async function getZeroRebuildDifference(diffarray) {
  const words = [];

  //ternary operators
  diffarray[0] == 1 ? words.push(" year, ") : words.push(" years, ");
  diffarray[1] == 1 ? words.push(" month, ") : words.push(" months, ");
  diffarray[2] == 1 ? words.push(" day, ") : words.push(" days, ");
  diffarray[3] == 1 ? words.push(" hour, ") : words.push(" hours, ");
  diffarray[4] == 1 ? words.push(" minute, ") : words.push(" minutes, ");
  diffarray[5] == 1 ? words.push(" second") : words.push(" seconds");

  //console.log (words)

  //const firstNonZero = (element: number) => element > 0;
  const firstNonZero = (element) => ((element !== 0) && (!isNaN(element)));

  const fNZ = diffarray.findIndex(firstNonZero);

  //console.log (fNZ)
  //console.log (diffarray[fNZ] + words[fNZ])

  let difftext = "";

  for (let i = fNZ; i < diffarray.length; i++) {
    difftext = difftext + diffarray[i] + words[i];
  }

  //console.log (difftext)
  return difftext;
}