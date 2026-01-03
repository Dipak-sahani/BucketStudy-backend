import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
  try {
    const { department, isActive, page = 1, limit = 10 } = req.query;

    const query = {};

    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const employees = await Employee.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalEmployees: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({employeeId:req.user.employeeId})

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if user is admin or the employee themselves
    if (
      req.user.role !== "admin" &&
      req.user.employeeId.toString() !== req.params.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this employee" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 const updateEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const userId = req.user?.id; // from auth middleware

    // 1️⃣ Validate input
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "employeeId is required",
      });
    }


    // 3️⃣ Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { employeeId},
    ).populate("employeeId");

    // 4️⃣ User not found
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 5️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Employee ID updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Update Employee ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
  try {
    // Generate unique employee ID
    const latestEmployee = await Employee.findOne().sort({ employeeId: -1 });
    let newEmployeeId = "EMP001";

    if (latestEmployee && latestEmployee.employeeId) {
      const lastNumber = parseInt(latestEmployee.employeeId.replace("EMP", ""));
      newEmployeeId = "EMP" + (lastNumber + 1).toString().padStart(3, "0");
    }

    const employeeData = {
      ...req.body,
      employeeId: newEmployeeId,
    };

    const employee = await Employee.create(employeeData);

    // Create user account for the employee
    const user = await User.create({
      email: employee.email,
      password: "password123", // Default password
      role: "employee",
      employeeId: employee._id,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      req.user.employeeId.toString() !== req.params.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this employee" });
    }

    // If employee is updating, restrict fields they can update
    if (req.user.role === "employee") {
      const allowedFields = ["phone", "address", "emergencyContact", "skills"];
      Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
          employee[key] = req.body[key];
        }
      });
    } else {
      // Admin can update all fields
      Object.keys(req.body).forEach((key) => {
        employee[key] = req.body[key];
      });
    }

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete associated user account
    await User.findOneAndDelete({ employeeId: employee._id });

    await employee.deleteOne();

    res.json({ message: "Employee removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeId
};
