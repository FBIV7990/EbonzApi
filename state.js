const request=require('request');
const db = require("_helpers/db");
const states=require('./state.json');
var options = {
    headers: {'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"}
}


const State = db.State;
const City=db.City;
module.exports={
    addStates,countDown
}


 
 function addStates()
{  
    var counter=1;
    states.data.map((st)=>{
        var state=new State();
        if(counter>=0&&counter<10)
            state._id="ST00"+counter;
        else if(counter>=10&&counter<100)
            state._id="ST0"+counter; 
        else if(counter>=100&&counter<1000)
            state._id="ST"+counter;   
    // state.oldId=st.id;
    // state.name=st.name;
    // state.longitude=st.longitude;
    // state.latitude=st.latitude;
    // state.parentId=1001;
    // state.save(); 
    counter++;
});

   // request("https://www.olx.in/api/locations?parent=2001171&hideAddressComponents=true",options,(err,response,body)=>{
//     if(err)
//     {
//      console.log(err);
//      return;
//     }
//      console.log(response.body);
// })
    // if(counter===5)
    // clearInterval(countDown);
    
}

function addCities()
{
    var counter=1;
        var stateId;
      
        if(counter>=0&&counter<10)
        stateId="ST00"+counter;
        else if(counter>=10&&counter<100)
        stateId="ST0"+counter; 
        var state=State.findById(stateId);
        console.log(counter);

    // state.oldId=st.id;
    // state.name=st.name;
    // state.longitude=st.longitude;
    // state.latitude=st.latitude;
    // state.parentId=1001;
    // state.save(); 
    if(counter===5)
    clearInterval(countDown);
    counter++;

}

//const countDown= setInterval(addCities,100);
var counter=1;
var cityCounter=1;
function countDown() {
    var self = this;  
    this.updateCountdown = function() {      
      
        var stateId;      
        if(counter>=0&&counter<10)
        stateId="ST00"+counter;
        else if(counter>=10&&counter<100)
        stateId="ST0"+counter; 
        State.findOne({_id:stateId}).then(st=>{ 
            console.log("Logging state :",st.name)   ;                 
            request("https://www.olx.in/api/locations?parent="+st.oldId+"&hideAddressComponents=true",options,(err,response,body)=>{
    if(err)
    {
     console.log(err);
     return;
    }
    if(response)
    {     
     var cities=JSON.parse(response.body);
    
    cities.data.map((element)=>{
    var city=new City();
    if(cityCounter>=0&&cityCounter<10)
         city._id="CT000000"+cityCounter;
    else if(cityCounter>=10&&cityCounter<100)
         city._id="CT00000"+cityCounter; 
    else if(cityCounter>=100&&cityCounter<1000)
         city._id="CT0000"+cityCounter; 
    else if(cityCounter>=1000&&cityCounter<10000)
         city._id="CT000"+cityCounter;  
    else if(cityCounter>=10000&&cityCounter<100000)
         city._id="CT00"+cityCounter;  
    else if(cityCounter>=100000&&cityCounter<1000000)
         city._id="CT0"+cityCounter;  
    else if(cityCounter>=1000000&&cityCounter<10000000)
         city._id="CT"+cityCounter;  

city.oldId=element.id;
city.name=element.name;
city.longitude=element.longitude;
city.latitude=element.latitude;
city.parentId=stateId;
city.oldParentId=element.parentId;
city.save(); 
cityCounter++;
});

    }
})
             
               }).catch(err=>{console.log(err)});
                  if(counter===36)    
                      clearInterval(self.interval); 
   counter++;
  }  
    this.interval = setInterval(this.updateCountdown, 10000);
  }