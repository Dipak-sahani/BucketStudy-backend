import mongoose,{ Schema } from "mongoose";
const payrollSchema = new Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
  },
  overtimeHours: {
    type: Number,
    default: 0,
  },
  overtimeRate: {
    type: Number,
    default: 1.5,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  deductions: [{
    type: {
      type: String,
      enum: ['tax', 'insurance', 'loan', 'other'],
      required: true,
    },
    description: String,
    amount: {
      type: Number,
      required: true,
    },
  }],
  totalDeductions: {
    type: Number,
    default: 0,
  },
  netSalary: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'paid'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'check', 'cash'],
    default: 'bank_transfer',
  },
}, { timestamps: true });

// Calculate total deductions and net salary before saving
payrollSchema.pre('save', function(next) {
  this.totalDeductions = this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  const overtimePay = this.overtimeHours * (this.baseSalary / 160) * this.overtimeRate;
  this.netSalary = this.baseSalary + overtimePay + this.bonus - this.totalDeductions;
  
});

export const Payroll = mongoose.model('Payroll', payrollSchema);