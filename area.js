const request=require('request');
const db = require("_helpers/db");
var options = {
    headers: {'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"}
}
const State = db.State;
const City=db.City;
const Area=db.Area;
module.exports={
    getAreas
}

//const countDown= setInterval(addCities,100);

var cityCounter=1;
var areaCounter=1;
function getAreas() {
    var self = this;  
    this.updateCountdown = function() {           
        var cityId;      
        if(cityCounter>=0&&cityCounter<10)
        cityId="CT000000"+cityCounter;
        else if(cityCounter>=10&&cityCounter<100)
        cityId="CT00000"+cityCounter; 
        else if(cityCounter>=100&&cityCounter<1000)
        cityId="CT0000"+cityCounter; 
        else if(cityCounter>=1000&&cityCounter<10000)
        cityId="CT000"+cityCounter;  
        else if(cityCounter>=10000&&cityCounter<100000)
        cityId="CT00"+cityCounter;      

        City.findOne({_id:cityId}).then(ct=>{ 
            console.log("Logging Area  :",ct.name);                 
            request("https://www.olx.in/api/locations?parent="+ct.oldId+"&hideAddressComponents=true",options,(err,response,body)=>{
             if(err)
             {
              console.log(err);
              return;
             }
             if(response)
              {     
              var areas=JSON.parse(response.body);
              if(areas.data.length>0)
              {
                areas.data.map( (element)=>{
               var area=new Area();
               if(areaCounter>=0&&areaCounter<10)
               area._id="AR00000"+areaCounter;
                else if(areaCounter>=10&&areaCounter<100)
                area._id="AR0000"+areaCounter; 
                else if(areaCounter>=100&&areaCounter<1000)
                area._id="AR000"+areaCounter; 
                else if(areaCounter>=1000&&areaCounter<10000)
                area._id="AR00"+areaCounter;  
                else if(areaCounter>=10000&&areaCounter<100000)
                area._id="AR0"+areaCounter;  
                else area._id="AR"+areaCounter;             

                area.oldId=element.id;
                area.name=element.name;
                area.longitude=element.longitude;
                area.latitude=element.latitude;
                area.parentId=cityId;
                area.oldParentId=ct.oldId;
                area.grandParentId=ct.parentId;
                area.save(); 
                areaCounter++;
              });
             }}
          })             
       }).catch(err=>{console.log(err)});

          if(cityCounter===7467)    
            clearInterval(self.interval); 
      cityCounter++;
  }  
    this.interval = setInterval(this.updateCountdown, 15000);
  }