var currentDate = new Date();
var year = currentDate.getFullYear();
var month = currentDate.getMonth() + 1;
var day = currentDate.getDate();
const monthNames = [
    "جانفي",
    "فيفري",
    "مارس",
    "افريل",
    "ماي",
    "جوان",
    "جويليا",
    "اوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر"
];
let timefinal=[0,0];
/**********************حساب الوقت المتبقي */
function calctime(timeAPI,timeuser){
    time=timeAPI-timeuser;
        timefinal[0]=Math.floor(time/60);///
        timefinal[1]=time%60;
        return (timefinal);
}
function closertime(data){
    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let  seconds = currentTime.getSeconds();
    //
    let timeuser= (hours*60)+minutes;
    const match =data.data[day-1].timings.Fajr.match(/(\d{1,2}):(\d{1,2})/);
    let timeAPI=(parseInt(match[1])*60)+parseInt(match[2]);
    seconds=59-seconds;
    
    if(timeuser<timeAPI){
        document.querySelector(".closersalat spam").innerHTML='الفجر';
        timefinal=calctime(timeAPI,timeuser);
        document.querySelector(".remainingtime").innerHTML=`${timefinal[0]}:${timefinal[1]}:${seconds}`;
        console.log(timefinal[0],timefinal[1]);
    }
    else{
        const match = data.data[day-1].timings.Dhuhr.match(/(\d{1,2}):(\d{1,2})/);
        let timeAPI=(parseInt(match[1])*60)+parseInt(match[2]);
    if(timeuser<timeAPI){
        document.querySelector(".closersalat spam").innerHTML=document.querySelector(".Dhuhr h4 b").innerHTML;// الظهر لانه ممكن يكون جمعه
        calctime(timeAPI,timeuser);
        document.querySelector(".remainingtime").innerHTML=`${timefinal[0]}:${timefinal[1]}:${seconds}`;
    }
        else{
        const match = data.data[day-1].timings.Asr.match(/(\d{1,2}):(\d{1,2})/);
        let timeAPI=(parseInt(match[1])*60)+parseInt(match[2]);
        if(timeuser<timeAPI){
            document.querySelector(".closersalat spam").innerHTML='العصر';
            calctime(timeAPI,timeuser);
            document.querySelector(".remainingtime").innerHTML=`${timefinal[0]}:${timefinal[1]}:${seconds}`;
        }
        else{
            const match = data.data[day-1].timings.Maghrib.match(/(\d{1,2}):(\d{1,2})/);
            let timeAPI=(parseInt(match[1])*60)+parseInt(match[2]);
            if(timeuser<timeAPI){
                document.querySelector(".closersalat spam").innerHTML='المغرب';
                calctime(timeAPI,timeuser);
                document.querySelector(".remainingtime").innerHTML=`${timefinal[0]}:${timefinal[1]}:${seconds}`;
            }
            else{ 
                const match = data.data[day-1].timings.Isha.match(/(\d{1,2}):(\d{1,2})/);
                let timeAPI=(parseInt(match[1])*60)+parseInt(match[2]);
                if(timeuser<timeAPI){
                    document.querySelector(".closersalat spam").innerHTML='العشاء';
                    calctime(timeAPI,timeuser);
                    document.querySelector(".remainingtime").innerHTML=`${timefinal[0]}:${timefinal[1]}:${seconds}`;
                }
                //*******الفجر اذا كان الوقت بعد العشاء */
                else{
                    
                    document.querySelector(".closersalat spam").innerHTML='الفجر';
                    const match =data.data[day-1].timings.Fajr.match(/(\d{1,2}):(\d{1,2})/);
                    let timeAPI=(parseInt(match[1])*60)+parseInt(match[2]);
                    hours=(24-hours)+parseInt(match[1]);
                    let timeuser= ((hours*60)+minutes)-parseInt(match[2]);
                    console.log("time user:",timeuser);
                    console.log("time api:",timeAPI);
                    calctime(timeAPI,timeuser);
                    document.querySelector(".remainingtime").innerHTML=`${Math.floor(timeuser/60)}:${timeuser%60}:${seconds}`;
                }
            }
        }
    } 
    }
}
// get time update the clock*****************************
function updateClock() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    document.querySelector(".timeanddat h4:nth-child(3)").textContent =`${hours}:${minutes}:${seconds}`;
}
//****************وضع وقت الصلاة*** و تاريخ اليوم و السنة***************** */
function pastAPI(data){
    document.querySelector(".Fajr h1").innerHTML=data.data[day-1].timings.Fajr.replace(/\([^)]*\)/, '');
    document.querySelector(".Dhuhr h1").innerHTML=data.data[day-1].timings.Dhuhr.replace(/\([^)]*\)/, '');
    document.querySelector(".Asr h1").innerHTML=data.data[day-1].timings.Asr.replace(/\([^)]*\)/, '');
    document.querySelector(".Maghrib h1").innerHTML=data.data[day-1].timings.Maghrib.replace(/\([^)]*\)/, '');
    document.querySelector(".Isha h1").innerHTML=data.data[day-1].timings.Isha.replace(/\([^)]*\)/, '');
    document.querySelector(".timeanddat h4:nth-child(1)").innerHTML= `
    ${data.data[day-1].date.hijri.weekday.ar} ${day} ${monthNames[month-1]} ${year}`;
    setInterval(updateClock, 1000);
}
 /***********اذا كانت الجمعة او الظهر */
function if_its_juma(data){
    if(data.data[day-1].date.hijri.weekday.ar=="الجمعة"){
        document.querySelector(".Dhuhr h4 b").innerHTML="الجمعة";}
    else{
        document.querySelector(".Dhuhr h4 b").innerHTML="الظهر";  }
}
/***************api التوقيت الصلاة************* */
async function getAPI(city_name,countrry_name){
    const response= await fetch(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}?
    city=${city_name}&country=${countrry_name}&method=2`);
    const data= await response.json();
    if_its_juma(data);
    console.log(data);
    pastAPI(data);
    intervalID =setInterval(() => {
            closertime(data);
    }, 1000);
}
/***************************api الموقع */
async  function locatoinAPI(latitude,longitude){
    const response= await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=
    ${latitude}&longitude=${longitude}&localityLanguage=en`)
    const data= await response.json();
    console.log(data.locality);
    getAPI(data.locality,data.countryName);
}
    // arabic ciyt name/******************** */
async function locatoinAPIarabic(latitude,longitude){
    const response= await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=
    ${latitude}&longitude=${longitude}&localityLanguage=ar`)
    const data= await response.json();
    document.querySelector(".place").innerHTML=data.locality;
}
function locatoin(){
    const success =(position)=>{
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        locatoinAPI(latitude,longitude);
        locatoinAPIarabic(latitude,longitude);
    }
    const error = ()=>{
        console.log("غير مصرح");
    }
    navigator.geolocation.getCurrentPosition(success,error);

}
/*************************clickkkkkk */
document.querySelector(".location").addEventListener('click',()=>{
    /*///********لايقاف تكرار الدلة الولى  */
    clearInterval(intervalID);
    /****************************** */
    locatoin();
    document.querySelector(".location").style.backgroundColor = '#686868';
})

document.querySelector(".searching").addEventListener('click',()=>{
   let countrry_name=document.querySelector("#countryInput").value;
   let city_name=document.querySelector("#cityInput").value;
    /*///********لايقاف تكرار الدلة الولى  */
    clearInterval(intervalID);
    /****************************** */
    getAPI(city_name,countrry_name);
    document.querySelector(".location")
    .style.backgroundColor = 'transparent';
    document.querySelector(".place").innerHTML=city_name;
});
document.addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        let countrry_name =document.querySelector("#countryInput").value;
   let city_name=document.querySelector("#cityInput").value;
    /*///********لايقاف تكرار الدلة الولى  */
    clearInterval(intervalID);
    /****************************** */
    getAPI(city_name,countrry_name);
    document.querySelector(".location")
    .style.backgroundColor = 'transparent';
    document.querySelector(".place").innerHTML=city_name;
    }
})

getAPI("ferdjioua","Algeria");