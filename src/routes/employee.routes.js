import { Router } from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeId
} from "../controllers/employee.controller.js"


import { verifyJWT, admin } from '../middlewares/auth.middleware.js';

const router=Router();
router.route('/')
  .get(verifyJWT, admin, getEmployees)
  .post(verifyJWT, admin, createEmployee);

router.route('/:id')
  .get(verifyJWT, getEmployeeById)
  .put(verifyJWT, updateEmployee)
  .delete(verifyJWT, admin, deleteEmployee);

router.route('/updateEmId').post(verifyJWT,updateEmployeeId)

export default router;