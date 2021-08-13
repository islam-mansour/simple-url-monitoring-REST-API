const User = require("../models/user");
const Check = require("../models/check");
const Report = require("../models/report");
const check = require("../models/check");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const self = module.exports;


module.exports = {
    getAll: async (req, res) => {
        const user = await User.findOne({_id: req.query.user});
        Check.find({user: user})
        .then(function(checks){
            res.status(200).json(checks);
        }).on('error', function(err){
            console.log(err);
        });
    },

    getOne: async (req, res) => {
        const user = await User.findOne({_id: req.query.user});
        Check.findOne({user: user, _id: req.params.id})
        .then(function(check){
            res.status(200).json(check);
        }).on('error', function(err){
            res.status(400).json(err);
        });
    },

    register: async (req, res) => {

            const { name, url, protocal, path, port, webhock, timeout, interval, threshold, ignoreSSL, auth, httpHeaders } = req.body;
            const oldCheck = await Check.findOne({ url }); // you can create only one check for a url
    
            if (oldCheck) {
                return res.status(409).send("Check Already Exist.");
            }
    
            const check = new Check(req.body);
            check.report = new Report();
            check.save();
            module.exports.attachTask(check);
    
            res.status(201).json(check);

    },

    attachTask: (check) => {
        const cron = require('node-cron');
        var http = require('http');
        const headers = [];
        check.httpHeaders.forEach(element => {
            const obj = new Object();
            obj[element.key] = element.value;
            headers.push(obj);    
        });
        var task = cron.schedule('*/' + check.interval + ' * * * * *', function() {
            if (check.status == Check.Status.WORKING){
                console.log('scheduler begin');
                var options = {
                    host: check.url,
                    path: check.path,
                    port: check.port,
                    method: 'GET',
                    timeout: check.timeout,
                    authorization: check.auth,
                    headers: headers,
                };
                http.request(options).then(function(res){
                    if (check.failedRequests == check.threshold){
                        notify(check, "up");
                    }
                    module.exports.updateReport(check, 1, res);
                    check.failedRequests = 0;
                    check.save();
                }).on('error', function(err){
                    console.log("down");
                    check.failedRequests = check.failedRequests + 1;
                    module.exports.updateReport(check, 1, err);
                    check.save();
                    if (check.failedRequests == check.threshold){
                        notify(check, "down");
                    }
                });
            }
        });
        task.start();
    
    },

    notify: (check, status) => {
        module.exports.sendMail(check, status);
        module.exports.notifyWebhock(check, status);
    },
    sendMail: (check, status) => {
        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        
        const user_email = check.user.email;

        mailOptions={
            to : user_email,
            subject : check.url + "update",
            html : "Hello, " + check.url + " is currently " + status 
        }
        
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
                res.send("error");
            }else{
                console.log("Message sent: " + response.message);
                res.send("sent");
            }
        });
    },
    notifyWebhock: (check, status) => {
        const url = check.webhock;
        if (!url){
            req.end();
        }
        var http = require('http');
        var options = {
            host: url,
            method: 'POST',
        };

        const postData = JSON.stringify({
            "message": url + " is currently " + status
        });
        const req = http.request(options, (res) => {
                        console.log("sent");
                    }).on('error', (err)=>{
                        console.log(err);
                    });
        req.write(postData);
        req.end();

    },

    updateReport: (check, status, message) => {
        check.status = status;
        var Log = require('../models/log');
        var log = new Log({text: message});
        log.save();
        check.report.history.push(log);
        if (status == 0){
            check.report.outages += 1;
            check.report.downtime += check.interval;
        } else {
            check.report.uptime += check.interval; 
        }
        check.report.save();
    },

    update: (req, res) => {
        try{
        
            const newCheck = new Check({
                name: req.query.name,
                url: req.query.url,
                protocal: req.query.protocal,
                path: req.query.path,
                port: req.query.port,
                webhock: req.query.webhock,
                timeout: req.query.timeout,
                interval: req.query.interval,
                threshold: req.query.threshold,
                ignoreSSL: req.query.ignoreSSL,
                auth: req.query.auth,
                httpHeaders: req.query.httpHeaders
            });
    
    
            Check.updateOne({_id: req.params.id}, newCheck).then(
                () => {
                  res.status(201).json({
                    message: 'Check updated successfully!'
                  });
                }
              ).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
    
            res.status(202).json(check);
    
        }catch(err){
            res.status(400).json(err);
        }
    },

    delete: (req, res) => {
        Check.deleteOne({_id: req.params.id}).then(() => {
            res.status(200).json({
                message: "Check deleted Successfully!"
            });
        }).catch(function(err){
            res.status(400).json(err);
        });
    }
}