const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Customer = require("../models/Customer");
const {
  sendCustomerWelcomeEmail,
} = require("../config/emailService");

// Generate Customer JWT
const generateCustomerToken = (customer) => {
  return jwt.sign(
    {
      id: customer._id,
      email: customer.email,
      role: "customer",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Customer Registration
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");

      return res.status(500).json({
        success: false,
        message: "JWT configuration is missing.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingCustomer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "A customer with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : "",
      address: address ? address.trim() : "",
    });

    const token = generateCustomerToken(customer);

    // Send welcome email without blocking customer registration.
    sendCustomerWelcomeEmail(customer).catch((error) => {
      console.error(
        "Customer welcome email error:",
        error.message
      );
    });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully!",
      data: {
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        },
      },
    });
  } catch (error) {
    console.error("Customer registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register customer.",
    });
  }
};

// Customer Login
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");

      return res.status(500).json({
        success: false,
        message: "JWT configuration is missing.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const customer = await Customer.findOne({
      email: normalizedEmail,
    });

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!customer.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your customer account is inactive.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      customer.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateCustomerToken(customer);

    return res.status(200).json({
      success: true,
      message: "Customer login successful!",
      data: {
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        },
      },
    });
  } catch (error) {
    console.error("Customer login error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login customer.",
    });
  }
};

// Get Current Customer
const getCurrentCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer.id).select(
      "-password"
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Get current customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer details.",
    });
  }
};

// Update Customer Profile
const updateCustomerProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const customer = await Customer.findById(req.customer.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      customer.name = name.trim();
    }

    if (phone !== undefined) {
      customer.phone = phone.trim();
    }

    if (address !== undefined) {
      customer.address = address.trim();
    }

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Customer profile updated successfully!",
      data: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error("Update customer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer profile.",
    });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCurrentCustomer,
  updateCustomerProfile,
};
