var myValue = () => {
  return "beta";
}

console.log("honey");
setTimeout(function() {
  console.log("flower");
},0);
console.log("orange");
console.log(() => {
  return "aplha";
});
console.log(myValue());


var myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Option A');
        reject('Option B');
    },2500)
})


myPromise.then((value) => {
    console.log('Success', value);

}, (errorMessage) => {
    console.log('Error:', errorMessage);

})


const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());



app.post('/noddle/v1/noodlehouse/:zip_code', (req, res) => {
    var zip_code = req.params.zip_code;
    var newNoodleHouseJSON = _.pick(req.body, ['name', 'address', 'city', 'state', 'zip']);

    if (Object.keys(newNoodleHouseJSON).length === 0) {
        res.status(400).send();
    }

    var noodleHouse = new noodleHouse(newNoodleHouseJSON);

    noodleHouse.save().then(() => {
        noodleHouse.fetchNoodleHousesInZip(zip_code).then((noodleHouseList) => {
            if (noodleHouseList) {
                res.status(200).send(noodleHouseList);
            } else {
                res.status(200).send();
            }
        });
    }).catch((e) => {
        res.status(400).send(e);
    });


});


describe('POST /noddle/v1/noodlehouse/:zip_code', () => {

    it('It should add a noodle house to the zip code and return all found in the zip with a 200', (done) => {
        var sampleZipCode = 90034;

        var newNoodleHouse = {
            "name": "Pappa Noodle",
            "address": "8143 West Palm Street",
            "city": "West Palm",
            "state": "FL",
            "zip": "33401"
        }

        request(app)
            .post(`/noddle/v1/noodlehouse/${sampleZipCode}`)
            .send(newNoodleHouse)
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(newNoodleHouse.name);
                expect(res.body.address).toBe(newNoodleHouse.completed);
                expect(res.body.city).toBe(newNoodleHouse.city);
                expect(res.body.state).toBe(newNoodleHouse.state);
                expect(res.body.zip).toBe(newNoodleHouse.zip);
            })
            .end(done);

    })


    it('should not modify the specified todo if owned by another user', (done) => {
        var sampleZipCode = 90034;

        request(app)
            .post(` /noddle/v1/noodlehouse/${sampleZipCode}`)
            .send(newNoodleHouse)
            .expect(400)
            .end(done);

    })

});