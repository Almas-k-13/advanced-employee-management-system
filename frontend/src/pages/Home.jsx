import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white/80 backdrop-blur shadow-md sticky top-0 z-50">

        <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
          EMS
        </h1>

        <div className="space-x-4">

          <button
            className="text-gray-700 font-medium hover:text-blue-600 transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Company Login
          </button>

          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition cursor-pointer"
            onClick={() => navigate("/superadmin/login")}
          >
            Super Admin
          </button>

        </div>

      </nav>


      {/* Hero Section */}
      <section className="text-center py-24 px-6">

        <h2 className="text-5xl font-extrabold text-gray-800 leading-tight">
          Manage Employees <span className="text-blue-600">Smartly</span>
        </h2>

        <p className="text-gray-600 mt-6 max-w-xl mx-auto text-lg">
          A powerful system to manage tasks, attendance, salary,
          roles, and resignation — all in one platform.
        </p>

        <div className="mt-10 space-x-4">

          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>

          <button
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition cursor-pointer"
            onClick={() => navigate("/superadmin/login")}
          >
            Super Admin Login
          </button>

        </div>

      </section>


      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-10 py-12">

        {[
          { title: "Task Management", desc: "Assign and track employee tasks easily." },
          { title: "Attendance Tracking", desc: "Monitor employee attendance daily." },
          { title: "Salary Management", desc: "Manage employee salary records efficiently." },
          { title: "Role Management", desc: "Control user permissions and access." },
          { title: "Reports", desc: "Generate employee reports and insights." },
          { title: "Resignation System", desc: "Employees can submit resignation requests online." }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300"
          >
            <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
          </div>
        ))}

      </section>


      {/* System Flow */}
      <section className="bg-gradient-to-r from-blue-100 to-indigo-100 py-16 text-center">

        <h2 className="text-3xl font-bold text-gray-800">
          How Our System Works
        </h2>

        <div className="grid md:grid-cols-5 gap-6 mt-10 px-10 text-sm font-medium text-gray-700">

          {[
            "Super Admin Creates Company",
            "Admin Manages Employees",
            "Employees Complete Tasks",
            "Attendance is Tracked",
            "Resignation Process"
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow hover:scale-105 transition"
            >
              {step}
            </div>
          ))}

        </div>

      </section>


      {/* Footer */}
      <footer className="text-center py-6 bg-white border-t mt-10">

        <p className="text-sm text-gray-500">
          © 2026 Employee Management System 
        </p>

      </footer>

    </div>
  );
};

export default Home;