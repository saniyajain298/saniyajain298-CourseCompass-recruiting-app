const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Company = require("../models/Company");
const { generateOtp } = require("../utils/generateOtp");
const { sendEmail } = require("../services/emailService");


module.exports = {
  validateEmail: async (req, res) => {
    const { email } = req.body;

    // Check for company email (example domain)
    if (email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Invalid email domain" });
    }

    // Generate OTP
    const otp = generateOtp();

    // Save or update company in the database
    let company = await Company.findOne({ email });
    if (company) {
      company.otp = otp;
      company.verified = false; // Reset verification status if re-sending OTP
    } else {
      company = new Company({ email, otp });
    }
    await company.save();

    // Send OTP email
    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  },

  verifyOtp: async (req, res) => {
    const { email, otp } = req.body;

    const company = await Company.findOne({ email, otp });
    if (!company) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    company.verified = true;
    // company.otp = null; // Delete OTP after successful verification
    await company.save();

    res.status(200).json({ message: "OTP verified" });
  },

  getCompany: async (req, res) => {
    const email = req.params.email;

    const company = await Company.findOne({email});
    if (!company) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "fetched successfully", company });
  },

  //credit remove

  // creditReduce :async (req, res) => {
  //   const { email } = req.body;

  //   try {
  //     const company = await Company.findOne({ email });

  //     if (!company) {
  //       return res.status(404).json({ message: 'Company not found' });
  //     }

  //     if (company.credits > 0) {
  //       company.credits -= 1;
  //       await company.save();
  //       return res.status(200).json({ message: 'Credit reduced by 1', credits: company.credits });
  //     } else {
  //       return res.status(200).json({ message: 'No credits left' });
  //     }
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Server error', error });
  //   }
  // }

  creditReduce: async (req, res) => {
    const { email, candidateId } = req.body;

    try {
      const company = await Company.findOne({ email });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Check if credits are already spent on this candidate
      if (company.spentCredits.includes(candidateId)) {
        return res
          .status(200)
          .json({ message: "Credits already spent on this candidate" });
      }

      if (company.credits > 0) {
        company.credits -= 1;
        company.spentCredits.push(candidateId); // Add candidate ID to spentCredits array
        await company.save();
        return res
          .status(200)
          .json({ message: "Credit reduced by 1", credits: company.credits });
      } else {
        return res.status(200).json({ message: "No credits left" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  },

  signup: async (req, res) => {
    const { email, companyName, companyWebsite, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await Company.findOne({ email });
    if (!company || !company.verified) {
      return res.status(400).json({ message: "company not verified" });
    }

    company.companyName = companyName;
    company.companyWebsite = companyWebsite;
    company.password = hashedPassword; // Will be hashed by pre-save hook

    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    await company.save();

    res
      .status(200)
      .json({
        message: "Registration successful",
        company: company,
        accessToken: token,
      });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: "Email does not exist!" });
    }

    //  const isMatch = await company.comparePassword(password);
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Registration successful",
      company: company,
      accessToken: token,
    });
  },
};