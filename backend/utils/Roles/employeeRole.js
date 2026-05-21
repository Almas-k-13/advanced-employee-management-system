module.exports = {
  role: "Employee",
  sequence: 4,
  permissions: {
    dashboard: { view: true, add: false, update: false, delete: false },
    task: { view: true, add: false, update: false, delete: false },
    attendance: { view: true, add: false, update: false, delete: false },
    teamMembers: { view: false, add: false, update: false, delete: false },
    reports: { view: false, add: false, update: false, delete: false },
    salary: { view: true, add: false, update: false, delete: false },
    roles: { view: false, add: false, update: false, delete: false },
    resignation: { view: true, add: false, update: false, delete: false }
  }
};