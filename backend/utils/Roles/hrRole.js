module.exports = {
  role: "Hr",
  sequence: 2,
  permissions: {
    dashboard: { view: true, add: false, update: false, delete: false },
    task: { view: true, add: true, update: false, delete: false },
    attendance: { view: true, add: false, update: false, delete: false },
    teamMembers: { view: true, add: true, update: false, delete: false },
    reports: { view: true, add: false, update: false, delete: false },
    salary: { view: true, add: true, update: true, delete: false },
    roles: { view: false, add: false, update: false, delete: false },
    resignation: { view: true, add: false, update: false, delete: false }
  }
};