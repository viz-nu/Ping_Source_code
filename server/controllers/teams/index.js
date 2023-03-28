import express from "express";
import config from "config"
import mongoose from "mongoose";
import User from "../../models/users.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../../middlewares/auth.js"
import { firePool } from "../../utils/worker.js";
import { taskValidations, errorMiddleware, taskEditValidations } from "../../middlewares/validations.js";
import { scheduledJobs, cancelJob } from "node-schedule";
let { JWT } = config.get("SECRET_KEYS")

const teamRouter = express.Router();

/*
    API : /api/team/
    Desc : GET all the tasks of this user
    Method : GET
    Body : TeamTasks(all details)
    Access : Private
*/

teamRouter.get("/", authMiddleware, errorMiddleware, async (req, res, next) => {
    try {
        const userData = await User.findById(req.user.user_id);

        res.status(200).json({ tasks: userData.TeamTasks });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }


});

/*
    API : /api/task/add
    Desc : Task addition
    Method : POST
    Body : taskname,deadline,notificationtype
    Access : Private
    Validations : valid token
*/

teamRouter.post("/add", authMiddleware,
    taskValidations(),
    errorMiddleware,
    async (req, res) => {
        try {

            const userData = await User.findById(req.user.user_id);
            let notificationType = req.body.notificationType;
            let email_pool = req.body.email_pool
            let phone_pool = req.body.phone_pool
            let taskName = req.body.taskname
            if (new Date(req.body.deadline) == "Invalid Date") {
                return res.status(400).json({ error: 'Deadline is an invalid' });
            }
            let deadline = new Date(req.body.deadline);
            let current = new Date(); //current UTC0
            let remainder_number = req.body.reminder_number;

            let mins = ((deadline - current)) / (1000 * 60); //diff in mins
            let days = ((deadline - current)) / (1000 * 60 * 60 * 24); //diff in days
            if (mins < 5 || days > 30) {
                return res.status(400).json({ error: 'Deadline should not be less than 5mins & more than 30 days or backdated' });
            }
            // getting the reminders array

            //creating reminders array 1/4,1/2,3/4
            let reminders = [];
            reminders.push(new Date((+current) + 10000))
            for (let i = 1; i <= remainder_number; i++) {
                reminders.push(new Date((+current) + ((mins * i / remainder_number) * 60 * 1000)));
            }
            let TeamTasks = {
                taskname: taskName,
                teamMemberEmails: email_pool,
                teamMemberPhones: phone_pool,
                deadline: deadline,
                notificationType: req.body.notificationType,
                reminders: reminders,
            }
            // //save into db and schedule jobs
            userData.TeamTasks.push(TeamTasks);
            let taskid = userData.TeamTasks[userData.TeamTasks.length - 1]._id.toString()
            await userData.save();

            let data = {
                taskid: taskid,
                reminders,
                email_pool,
                phone_pool,
                notificationType,
                taskName,
            }
            firePool(data);

            res.status(200).json({ success: "New Task has been scheduled" });

        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });

        }
    });


teamRouter.put("/edit/:toDoId", authMiddleware, taskEditValidations(), errorMiddleware, async (req, res, next) => {
    try {
        const userData = await User.findById(req.user.user_id);
        let taskId = req.params.toDoId;
        let notificationType = req.body.notificationType;
        let taskName = req.body.taskname;
        let taskData = userData.tasks.find((task) => TeamTasks._id == taskId);

        if (!taskData) return res.status(404).json({ error: 'Invalid task id' });
        let index = userData.tasks.findIndex((task) => TeamTasks._id == taskId);
        if (req.body.isCompleted == true) {
            taskData.reminders.forEach((element, i) => {
                cancelJob(`${taskId}-${i}`);
            });
            userData.tasks[index].isCompleted = true;
            //update the db
            await userData.save();
            res.status(200).json({ success: 'Task status has been updated' });

        }
        else {
            taskData.reminders.forEach((element, i) => {
                cancelJob(`${taskId}-${i}`)
            });
            if (new Date(req.body.deadline) == "Invalid Date") {
                return res.status(400).json({ error: 'Deadline is an invalid' });
            }
            let deadline = new Date(req.body.deadline);
            let current = new Date(); //current UTC0

            let mins = ((deadline - current)) / (1000 * 60); //diff in mins
            let days = ((deadline - current)) / (1000 * 60 * 60 * 24); //diff in days
            if (mins < 30 || days > 30) {
                return res.status(400).json({ error: 'Deadline should not be less than 30mins & more than 30 days or backdated' });
            }
            // getting the reminders array
            let reminders = [];
            reminders.push(new Date((+current) + 10000))
            for (let i = 1; i <= remainder_number; i++) {
                reminders.push(new Date((+current) + ((mins * i / remainder_number) * 60 * 1000)));
            }
            let TeamTasks = {
                taskname: taskName,
                teamMemberEmails: email_pool,
                teamMemberPhones: phone_pool,
                deadline: deadline,
                notificationType: req.body.notificationType,
                reminders: reminders,
            }
            // //save into db and schedule jobs
            userData.TeamTasks.push(TeamTasks);
            let taskid = userData.TeamTasks[userData.TeamTasks.length - 1]._id.toString()
            await userData.save();

            let data = {
                taskid: taskid,
                reminders,
                email_pool,
                phone_pool,
                notificationType,
                taskName,
            }
            firePool(data);
            res.status(200).json({ success: 'Task  has been updated' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });

    }
});






/*
    API : /api/task/:taskid
    Desc : GET a particular task
    Method : GET
    Body : taskname, deadline, notificationType
    Access : Private
*/


// teamRouter.get("/:taskid", authMiddleware, errorMiddleware, async (req, res, next) => {
//     try {
//         const userData = await User.findById(req.user.user_id);
//         let taskId = req.params.taskid;
//         let taskData = userData.tasks.find((task) => task._id == taskId);

//         if (!taskData) {
//             return res.status(404).json({ error: 'Task Id is invalid' });
//         }
//         return res.status(200).json({ taskData });

//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }

// });


teamRouter.delete("/delete/:taskId", authMiddleware, errorMiddleware, async (req, res, next) => {
    try {
        const userData = await User.findById(req.user.user_id);
        let taskId = req.params.taskId;
        let taskData = userData.TeamTasks.find((task) => task._id == taskId);

        if (!taskData) return res.status(404).json({ error: 'Invalid task id' });
        userData.TeamTasks = userData.TeamTasks.filter((ele) => ele._id != taskId);
        await userData.save();
        taskData.reminders.forEach((element, i) => {
            cancelJob(`${taskId}-${i}`)
        });
        // console.log(scheduledJobs);
        res.status(200).json({ success: 'Deleted successfully' });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


export default teamRouter