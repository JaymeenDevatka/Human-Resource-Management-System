import { Fragment } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  UsersIcon,
  DocumentCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  current: boolean;
  roles?: ('admin' | 'employee')[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar = ({ navigation }: { navigation: NavigationItem[] }) => {
  const { user } = useAuth();
  const location = useLocation();

  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href,
  }));

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-indigo-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-2xl font-bold">Dayflow HRMS</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {updatedNavigation
                .filter(item => !item.roles || (user && item.roles.includes(user.role)))
                .map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-indigo-300' : 'text-indigo-200 group-hover:text-white',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileMenuButton = ({ open }: { open: boolean }) => {
  return (
    <div className="-mr-2 flex items-center md:hidden">
      <Menu.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
        <span className="sr-only">Open main menu</span>
        {open ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </Menu.Button>
    </div>
  );
};

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src={user?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
            alt=""
          />
          <span className="ml-2 text-white text-sm font-medium">
            {user?.name || 'User'}
          </span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700 flex items-center'
                )}
              >
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Your Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center'
                )}
              >
                <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};\n
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'employee'] },
    { name: 'Profile', href: '/profile', icon: UserIcon, roles: ['admin', 'employee'] },
    { name: 'Attendance', href: '/attendance', icon: ClockIcon, roles: ['admin', 'employee'] },
    { name: 'Leave', href: '/leave', icon: CalendarIcon, roles: ['admin', 'employee'] },
    { name: 'Employees', href: '/admin/employees', icon: UsersIcon, roles: ['admin'] },
    { name: 'Leave Approvals', href: '/admin/leave-approvals', icon: DocumentCheckIcon, roles: ['admin'] },
    { name: 'Payroll', href: '/admin/payroll', icon: CurrencyDollarIcon, roles: ['admin'] },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <div className="fixed inset-0 flex z-40 md:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0">
              <div className="absolute inset-0 bg-gray-600 opacity-75" />
            </div>
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-white text-2xl font-bold">Dayflow HRMS</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation
                    .filter(item => !item.roles || item.roles.includes('employee'))
                    .map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? 'bg-indigo-800 text-white'
                            : 'text-indigo-100 hover:bg-indigo-600',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={classNames(
                            location.pathname === item.href ? 'text-indigo-300' : 'text-indigo-200 group-hover:text-white',
                            'mr-4 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <Sidebar navigation={navigation} />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="w-full flex items-center justify-between">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                  </h1>
                  <div className="flex items-center">
                    <UserMenu />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
