import express from 'express';
import { createCourse,updateCourse,deleteCourse,getCourses,courseDetails,buyCourses} from '../controller/course.controller.js';
import userMiddleware from '../middleware/user.mid.js';
import adminMiddleware from '../middleware/admin.mid.js';

const router=express.Router()

router.post("/create",adminMiddleware,createCourse) //in postman: post :http://localhost:5001/api/v1/course/create: as a form data   : ab yaha hum header me key: authorisation and value me : bearer and then after admin login se jo token mila wo likh denge
router.put("/update/:courseId",adminMiddleware,updateCourse)    //in postman set as put :http://localhost:5001/api/v1/course/update/68f3d949f7025c80eb6c832b: as a raw yaha id jo isne generate kiya mongo ne ya postman ne :ab yaha hum header me key: authorisation and value me : bearer and then after admin login se jo token mila wo likh denge
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)   //http://localhost:5001/api/v1/course/delete/68f3f7681ec003a9663a89ea yaha just send pe click automatic delete :ab yaha hum header me key: authorisation and value me : bearer and then after admin login se jo token mila wo likh denge

router.get("/courses",getCourses)    //http://localhost:5001/api/v1/course/courses
router.get("/:courseId",courseDetails);

router.post("/buy/:courseId",userMiddleware,buyCourses)   //http://localhost:5001/api/v1/course/buy/68f3f4ac308c0e25ec98d6f0    yaha hum header ke key me : authorisation likhenege and value me bearer and then after login se jo token mila wo likh denge 

export default router;