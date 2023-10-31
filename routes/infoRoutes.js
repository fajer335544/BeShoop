const router = require('express').Router();
const infoController = require('./../controllers/infoController');

router.get('/' , infoController.getInfo);
router.get('/JP' , infoController.NOJP);
router.get('/JR' , infoController.NOJR);
router.get('/moneyPerMonth' , infoController.moneyPerMonth);
router.get('/ordersPerMonth' , infoController.ordersPerMonth);
router.get('/moneyPerMonthR/:id' , infoController.moneyPerMonthR);

module.exports = router;


/* 
  Admin :
    1- http://localhost:5000/info/JP?year=2023&month=7  عدد الصيدليات المنضمة للنظام خلال شهر معين
    2- http://localhost:5000/info/JR?year=2023&month=6  عدد المستودعات المنضمة للنظام خلال شهر معين
    3- http://localhost:5000/info/moneyPerMonth?year=2023&month=6  التبادل المالي في النظام كاملا خلال شهر معين
    4- http://localhost:5000/info/ordersPerMonth?year=2023&month=6  عدد الطلبات خلال النظام كاملا خلال شهر معين
*/

/*
  Repository : 
    1- http://localhost:5000/info/moneyPerMonthR/:id?year=2023 التبادل المالي في مستودع معين خلال سنة معينة مقسمة كل شهر على حدا 

*/