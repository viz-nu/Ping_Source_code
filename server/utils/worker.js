import { scheduleJob } from "node-schedule";
import sendMail from "./sendmail.js";
import sendSMS from "./sendSMS.js";

function fire(data) {

    data.reminders.forEach((reminder, i) => {
        scheduleJob(`${data.taskid}-${i}`, reminder, () => {
            if (data.notificationType == "email") {
                sendMail({
                    to: data.email,
                    subject: "Task Reminder",
                    body: `This email reminds you about completion of ${i * 25}% of time for your task : ${data.taskName} 
                       <br/>
                       <br/> 
                        Thank you <br /><br />
                        Regards <br />
                        <b> Team Viz</b>`
                });

            }
            else if (data.notificationType == "sms") {
                sendSMS({
                    to: data.phone,
                    body: `This message reminds you about completion of ${i * 25}% of time for your task : ${data.taskName}`
                });
            }
            else {
                sendMail({
                    to: data.email,
                    subject: "Task Reminder",
                    body: `This email reminds you about completion of ${i * 25}% of time for your task :  ${data.taskName}
                       <br/><br/> 
                        Thank you <br /><br />
                        Regards <br />
                        <b> Team Viz </b>`
                });

                sendSMS({
                    to: data.phone,
                    body: `Hello ${data.fname} This message reminds you about completion of ${i * 25}% of time for your task :  ${data.taskName}`
                });
            }
        })
    })
}
function firePool(data) {
console.log(data)
    // data.reminders.forEach((reminder, i) => {

    //     // scheduleJob(`${data.taskid}-${i}`, reminder, () => {

    //     //     if (data.notificationType == "email") {
    //     //         for (let j = 0; j < data.email_pool.length; j++) {
    //     //             sendMail({
    //     //                 to: data.email_pool[i],
    //     //                 subject: "Task Reminder",
    //     //                 body: `This email reminds you about completion of ${i * 100 / (data.remainders.length - 1)}% of time for your task :  ${data.taskName} 
    //     //                    <br/>
    //     //                    <br/> 
    //     //                     Thank you <br /><br />
    //     //                     Regards <br />
    //     //                     <b> Team Viz</b>`
    //     //             });
    //     //         }
    //     //     }
    //     //     else if (data.notificationType == "sms") {
    //     //         for (let j = 0; j < data.email_pool.length; j++) {
    //     //             sendSMS({
    //     //                 to: data.phone_pool[j],
    //     //                 body: `This message reminds you about completion of ${i * 100 / (data.remainders.length - 1)}% of time for your task :  ${data.taskName} `
    //     //             });
    //     //         }
    //     //     }

    //     //     else {
    //     //         for (let j = 0; j < data.email_pool.length; j++) {
    //     //             sendMail({
    //     //                 to: data.email,
    //     //                 subject: "Task Reminder",
    //     //                 body: `This email reminds you about completion of ${i * 100 / (data.remainders.length - 1)}% of time for your task :  ${data.taskName}
    //     //                    <br/><br/> 
    //     //                     Thank you <br /><br />
    //     //                     Regards <br />
    //     //                     <b> Team Viz </b>`
    //     //             });

    //     //             sendSMS({
    //     //                 to: data.phone,
    //     //                 body: `This message reminds you about completion of ${i * 100 / (data.remainders.length - 1)}% of time for your task :  ${data.taskName}`
    //     //             });
    //     //         }

    //     //     }
    //     // })
    // })
}
export { fire, firePool };


