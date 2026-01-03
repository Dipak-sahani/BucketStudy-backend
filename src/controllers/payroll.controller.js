import mongoose from "mongoose";
import { Payroll } from "../models/payroll.model.js";
import {Employee} from "../models/employee.model.js";

/**
 * ✅ Create Payroll
 * POST /api/payroll
 */
export const createPayroll = async (req, res) => {
  try {
    const {
      employee,
      month,
      year,
      baseSalary,
      overtimeHours = 0,
      overtimeRate = 1.5,
      bonus = 0,
      deductions = [],
      paymentMethod,
      paymentDate,
      netSalary
    } = req.body;

    console.log(req.body);
    

    // 1️⃣ Required fields
    if (!employee || !month || !year || !baseSalary) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 2️⃣ Validate employee ObjectId
    if (!mongoose.Types.ObjectId.isValid(employee)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    // 3️⃣ Check employee exists
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // 4️⃣ Prevent duplicate payroll (same month & year)
    const existingPayroll = await Payroll.findOne({ employee, month, year });
    if (existingPayroll) {
      return res.status(409).json({
        success: false,
        message: "Payroll already exists for this employee and period",
      });
    }

    // 5️⃣ Create payroll
    const payroll = await Payroll.create({
      employee,
      month,
      year,
      baseSalary,
      overtimeHours,
      overtimeRate,
      bonus,
      deductions,
      paymentMethod,
      paymentDate,
      netSalary
    });

    return res.status(201).json({
      success: true,
      message: "Payroll created successfully",
      data: payroll,
    });

  } catch (error) {
    console.error("Create Payroll Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ✅ Get All Payrolls
 * GET /api/payroll
 */
export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee", "name employeeId")
      .sort({ year: -1, month: -1 });

    return res.status(200).json({
      success: true,
      data: payrolls,
    });
  } catch (error) {
    console.error("Get Payrolls Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ✅ Get Payroll by ID
 * GET /api/payroll/:id
 */
export const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payroll ID",
      });
    }

    const payroll = await Payroll.findById(id).populate("employee");

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    console.error("Get Payroll Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ✅ Update Payroll Status
 * PATCH /api/payroll/:id/status
 */
export const updatePayrollStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "processed", "paid"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payroll status updated",
      data: payroll,
    });

  } catch (error) {
    console.error("Update Payroll Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * ✅ Delete Payroll
 * DELETE /api/payroll/:id
 */
export const deletePayroll = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findByIdAndDelete(id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payroll deleted successfully",
    });
  } catch (error) {
    console.error("Delete Payroll Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const findPayrollByEmId= async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
}