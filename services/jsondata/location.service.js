const Joi = require("@hapi/joi");
const countries=require('./countries.json');
const states=require('./states.json');
const cities=require('./cities.json');


module.exports={  
    get
}


async function get(data) {   
try {    
  const schema = Joi.object().keys({
    countryId: Joi.string(),
    stateId:Joi.string() 
  });
  const params = data;
  const { error, value } = schema.validate(params);
  if (error) {
    throw error;
  } 

  if(params.countryId)
  {   
    const country=countries.countries.find(country=>{return country.id==params.countryId})
    const statelist=states.states.filter(state=>{return state.country_id==country.id})
    return {success:true,country,states:statelist } 
  }
  else if(params.stateId)
  {   
    const state=states.states.find(state=>{return state.id==params.stateId})
         const citieslist=cities.cities.filter(city=>{return city.state_id===state.id})
    return {success:true,state,cities:citieslist } 
  }
  else {
        return {success:true,countries:countries.countries } 
    }
     
    
} 
catch (err) {
  throw err;
}
}