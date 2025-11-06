export const createPageUrl = (pageName) => {
  const routes = {
    'Homepage': '/',
    'About': '/about',
    'Contact': '/contact',
    'BrowseTechnicians': '/browse-technicians',
    'Login': '/login',
    'Register': '/register',
    'AdminPanel': '/admin',
    'TechnicianDashboard': '/technician-dashboard',
    'CustomerDashboard': '/customer-dashboard',
    'BookAppointment': '/book-appointment',
    'TechnicianProfile': '/technician-profile'
  };
  return routes[pageName] || '/';
};
