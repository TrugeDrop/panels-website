const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    customerid: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true,
        unique: true
    },
    del_time: {
        type: Number,
        required: true,
        default: 10080
    }
}, { timestamps: true });

const CusSess = mongoose.model('customer-session', schema);
module.exports = CusSess;

setInterval(() => {
CusSess.find({}, function(err,cs){
    cs.forEach(data => {
        CusSess.findById(data._id, function(err,cs){
        cs.del_time-=1;
            cs.save(function(err){
            if(err) return console.log('Customer Sessions Time Error!');
                if(cs.del_time == 0){
                    CusSess.findById(cs._id, function(err){
                        if(err) return console.log('Customer Sessions Time Delete Error!');
                    });
                };
            });
        });
    });
});
}, 60000);