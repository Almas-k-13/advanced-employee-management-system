module.exports = {
  role: "Manager",
  sequence: 3,
  permissions: {
    dashboard: { view: true, add: false, update: false, delete: false },
    task: { view: true, add: true, update: true, delete: true },
    attendance: { view: true, add: false, update: false, delete: false },
    teamMembers: { view: true, add: true, update: true, delete: true },
    reports: { view: true, add: false, update: false, delete: false },
    salary: { view: true, add: false, update: false, delete: false },
    roles: { view: false, add: false, update: false, delete: false },
    resignation: { view: true, add: false, update: false, delete: false }
  }
};