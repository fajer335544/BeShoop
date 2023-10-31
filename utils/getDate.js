exports.getDate = (date)=>{

  const months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  const days = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];

  const delDateString = days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear();
  return delDateString;
}
