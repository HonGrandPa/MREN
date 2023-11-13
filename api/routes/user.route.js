import express from "express";
import { deleteUser, test, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();


// router.get('/test', (req, res) => {

//     res.json({
//         message: "Hello World",
//     });
// })

router.get('/test', test);
router.post('/update/:id', verifyUser, updateUser)
router.delete('/delete/:id', verifyUser, deleteUser)

export default router;