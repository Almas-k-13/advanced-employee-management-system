module.exports = {
  role: "Admin",
  sequence: 1,
  permissions: {
    dashboard: { view: true, add: true, update: true, delete: true },
    task: { view: true, add: true, update: true, delete: true },
    attendance: { view: true, add: true, update: true, delete: true },
    teamMembers: { view: true, add: true, update: true, delete: true },
    reports: { view: true, add: true, update: true, delete: true },
    salary: { view: true, add: true, update: true, delete: true },
    roles: { view: true, add: true, update: true, delete: true },
    resignation: { view: true, add: true, update: true, delete: true }
  }
};