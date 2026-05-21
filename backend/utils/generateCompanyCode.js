const Company = require("../models/Company");

const generateCompanyCode = async () => {

  let code;
  let exists = true;

  while (exists) {

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    code = `EMS-${randomNumber}`;

    const company = await Company.findOne({ code });

    if (!company) {
      exists = false;
    }

  }

  return code;

};

module.exports = generateCompanyCode;