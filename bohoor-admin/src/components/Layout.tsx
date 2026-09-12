import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, BuildingOfficeIcon, UserGroupIcon, UsersIcon, MapPinIcon, Square2StackIcon, ShieldCheckIcon, ArrowRightOnRectangleIcon, KeyIcon, FolderIcon, PhotoIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

const navigation = [
  { name: 'الرئيسية',          href: '/',           icon: HomeIcon },
  { name: 'السلايدر',          href: '/hero-slides', icon: PhotoIcon },
  { name: 'المطورين',           href: '/developers', icon: UsersIcon },
  { name: 'المشاريع',           href: '/projects',   icon: FolderIcon },
  { name: 'الوحدات والعقارات', href: '/units',       icon: BuildingOfficeIcon },
  { name: 'الطلبات والاستفسارات', href: '/leads', icon: ClipboardDocumentListIcon },
  { name: 'المناطق',            href: '/locations',  icon: MapPinIcon },
  { name: 'أنواع الوحدات',     href: '/unit-types', icon: Square2StackIcon },
  { name: 'المديرين',           href: '/admins',     icon: ShieldCheckIcon },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.auth.changePassword(passwordForm);
      toast.success('تم تغيير كلمة المرور بنجاح');
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'فشل تغيير كلمة المرور. تأكد من صحة كلمة المرور القديمة.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col">
        <div className="p-4 text-center border-b border-white/20 flex justify-center bg-white">
          <img src="/logo.png" alt="Buhoor Realty" className="h-12 object-contain" />
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
              const isActive = item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-arabic text-sm">{item.name}</span>
                  </div>
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center relative z-10">
          <h2 className="text-xl font-bold text-gray-800 font-arabic">لوحة التحكم</h2>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-4 space-x-reverse hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-600 font-arabic">إعدادات الحساب</span>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-primary" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 font-arabic">
                <button
                  onClick={() => { setShowPasswordModal(true); setShowDropdown(false); }}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center space-x-2 space-x-reverse"
                >
                  <KeyIcon className="w-4 h-4" />
                  <span>تغيير كلمة المرور</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2 space-x-reverse border-t"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 relative z-0">
          <Outlet />
        </main>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md" dir="rtl">
            <h2 className="text-xl font-bold font-arabic mb-4">تغيير كلمة المرور</h2>
            <form onSubmit={handleChangePassword} className="space-y-4 font-arabic">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الحالية</label>
                <input
                  type="password"
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none text-left"
                  dir="ltr"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none text-left"
                  dir="ltr"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <div className="flex space-x-3 space-x-reverse mt-6">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex-1"
                >
                  تغيير
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex-1"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
