import Company from "../models/Company.js";
import User from "../models/User.js";

// ADMIN: Register a new company
export const registerCompany = async (req, res) => {
  try {
    const { name, registrationNumber, email, phone, address, adminId, createNewAdmin, adminName, adminEmail, adminPhone, adminPassword } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ 
      $or: [{ registrationNumber }, { name }] 
    });

    if (existingCompany) {
      return res.status(400).json({ 
        message: "Company with this name or registration number already exists" 
      });
    }

    let companyAdmin;

    // Option 1: Use logged-in admin as company admin (if no adminId provided and not creating new)
    if (!adminId && !createNewAdmin) {
      companyAdmin = await User.findById(req.user.id);
      if (!companyAdmin) {
        return res.status(404).json({ message: "Current user not found" });
      }
    }
    // Option 2: Create a new admin user for this company
    else if (createNewAdmin) {
      // Check if admin email already exists
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin email already exists" });
      }

      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      companyAdmin = await User.create({
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: hashedPassword,
        role: "company_admin"
      });
    }
    // Option 3: Use provided adminId
    else {
      companyAdmin = await User.findById(adminId);
      if (!companyAdmin) {
        return res.status(404).json({ message: "Admin user not found" });
      }
    }

    const company = await Company.create({
      name,
      registrationNumber,
      email,
      phone,
      address,
      admin: companyAdmin._id
    });

    // Update user to be company admin
    companyAdmin.role = "company_admin";
    companyAdmin.company = company._id;
    await companyAdmin.save();

    res.status(201).json({
      message: "Company registered successfully",
      company,
      adminCredentials: createNewAdmin ? {
        email: adminEmail,
        password: "Please share this with the admin"
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company details
export const getCompanyDetails = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate("admin", "name email phone");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { name, email, phone, address, status, logo } = req.body;

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update fields
    if (name) company.name = name;
    if (email) company.email = email;
    if (phone) company.phone = phone;
    if (address) company.address = address;
    if (status) company.status = status;
    if (logo) company.logo = logo;

    await company.save();

    res.json({
      message: "Company updated successfully",
      company
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};