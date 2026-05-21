const Company = require("../models/Company");
const PLAN_FEATURES = require("../config/planFeatures");

const checkPlanAccess = (feature) => {

  return async (req, res, next) => {

    const company = await Company.findById(req.user.company_id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    const plan = company.plan;

    const allowedFeatures = PLAN_FEATURES[plan];

    if (!allowedFeatures.includes(feature)) {

      return res.status(403).json({
        message: "Upgrade your plan to access this feature"
      });

    }

    next();
  };

};

module.exports = checkPlanAccess;