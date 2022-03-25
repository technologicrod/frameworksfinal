import weather from 'weather-js';

weather.find({search: 'Davao, PH', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
   
    const weatherdavao = JSON.stringify(result, null, 2);
  });
weather.find({search: 'Tokyo, JP', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
   
    const weathertokyo = JSON.stringify(result, null, 2);
  });
weather.find({search: 'Toronto, CA', degreeType: 'C'}, function(err, result) {
    if(err) console.log(err);
   
    const weathertoronto = JSON.stringify(result, null, 2);
  });

module.exports = {weatherdavao, weathertokyo, weathertoronto};