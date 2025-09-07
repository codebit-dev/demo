import React, { useState } from 'react';
import { 
  Search, 
  User, 
  FileText, 
  BarChart3, 
  Settings, 
  Shield, 
  ArrowRight, 
  Upload, 
  CheckCircle, 
  RefreshCw,
  Heart,
  Activity,
  Users,
  Calendar,
  Eye,
  EyeOff,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const MediSync = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            MediSync
          </h1>
          <p className="text-gray-600 mt-2">Healthcare Integration Platform</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ABHA ID</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your ABHA ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-green-600 font-semibold"
          >
            Sign In Securely
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-semibold">
            OAuth Login
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-1" />
            Secured with end-to-end encryption
          </div>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 fixed left-0 top-0 h-full z-10`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <Heart className="text-white w-6 h-6" />
            </div>
            {sidebarOpen && (
              <h1 className="text-xl font-bold ml-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MediSync
              </h1>
            )}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <nav className="mt-8">
        {[
          { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
          { id: 'translator', icon: RefreshCw, label: 'Code Translator' },
          { id: 'upload', icon: Upload, label: 'Patient Records' },
          { id: 'analytics', icon: Activity, label: 'Analytics' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
              currentScreen === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg">
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Dr. Sharma</h1>
        <p className="text-gray-600">Here's what's happening with your patients today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Patients</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">1,247</p>
              <p className="text-blue-600 text-sm mt-1">+12%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Codes Translated</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">856</p>
              <p className="text-green-600 text-sm mt-1">+8%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <RefreshCw className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Records</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">432</p>
              <p className="text-purple-600 text-sm mt-1">+15%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">98.5%</p>
              <p className="text-emerald-600 text-sm mt-1">+2%</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Smart Search Assistant</h3>
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search symptoms, diagnoses, or patient records..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Translations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Jwara (Fever)</p>
                  <p className="text-sm text-gray-600">MD90 - Fever, unspecified</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">2 mins ago</p>
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto mt-1" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Kasa (Cough)</p>
                  <p className="text-sm text-gray-600">MD12 - Cough</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">15 mins ago</p>
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => setCurrentScreen('translator')} className="w-full flex items-center p-3 text-left hover:bg-blue-50 rounded-lg group">
                <RefreshCw className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600">Translate Code</span>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
              <button onClick={() => setCurrentScreen('upload')} className="w-full flex items-center p-3 text-left hover:bg-blue-50 rounded-lg group">
                <Upload className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600">Upload Records</span>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">ABHA Integration</span>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">EMR Sync</span>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CodeTranslator = () => (
    <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Code Translator</h1>
        <p className="text-gray-600">Convert NAMASTE codes to ICD-11 standards in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
            NAMASTE Terminology
          </h3>
          <textarea
            placeholder="Enter symptoms or diagnosis in NAMASTE terminology..."
            className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none"
            defaultValue="Jwara (Fever) with Kasa (Cough)"
          />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Confidence: High</span>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Translate</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            ICD-11 Equivalent
          </h3>
          <div className="h-64 p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="font-medium text-gray-800">MD90 - Fever, unspecified</p>
                <p className="text-sm text-gray-600 mt-1">Primary match for "Jwara (Fever)"</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="font-medium text-gray-800">MD12 - Cough</p>
                <p className="text-sm text-gray-600 mt-1">Primary match for "Kasa (Cough)"</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Translation Complete
            </span>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Save Translation</button>
          </div>
        </div>
      </div>
    </div>
  );

  const PatientUpload = () => (
    <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Record Upload</h1>
        <p className="text-gray-600">Import and sync patient data with EMR systems</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Patient Records</h3>
          <p className="text-gray-600 mb-6">Drag and drop CSV, Excel, or EMR files here</p>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg">Choose Files</button>
          <p className="text-sm text-gray-500 mt-4">Supported formats: CSV, XLSX, XLS, HL7, FHIR</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Uploads</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-800">patient_records_2024.csv</p>
                <p className="text-sm text-gray-600">2.4 MB • 1,247 records</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Synced</div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Analytics = () => (
    <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">Insights into AYUSH-to-ICD mapping and healthcare trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Common Diagnoses</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">Jwara (Fever)</span>
                  <span className="text-sm text-gray-600">1247 cases</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-4/5"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">Kasa (Cough)</span>
                  <span className="text-sm text-gray-600">856 cases</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full w-3/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Translation Success Rate</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">98.5%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">4,247</p>
              <p className="text-sm text-gray-600">Successful</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">65</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Settings = () => (
    <div className={`${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 p-6 bg-gray-50 min-h-screen`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your platform preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Security & Privacy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <div className="w-11 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-all"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Data Encryption</p>
                <p className="text-sm text-gray-600">End-to-end encryption enabled</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Session Timeout</p>
                <p className="text-sm text-gray-600">Auto logout after inactivity</p>
              </div>
              <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>4 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-green-500" />
            EMR Integration
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">ABHA Integration</p>
                <p className="text-sm text-gray-600">Connected to National Health ID</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Connected</div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Auto Sync</p>
                <p className="text-sm text-gray-600">Automatically sync patient records</p>
              </div>
              <div className="w-11 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-all"></div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="font-medium text-gray-800 mb-3">Sync Frequency</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input type="radio" name="sync" className="mr-2" defaultChecked />
                  <span className="text-sm">Real-time</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="sync" className="mr-2" />
                  <span className="text-sm">Hourly</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="sync" className="mr-2" />
                  <span className="text-sm">Daily</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="sync" className="mr-2" />
                  <span className="text-sm">Manual</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Translation Completed</p>
                <p className="text-sm text-gray-600">Get notified when code translation is done</p>
              </div>
              <div className="w-11 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-all"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Sync Failures</p>
                <p className="text-sm text-gray-600">Alert on EMR synchronization issues</p>
              </div>
              <div className="w-11 h-6 bg-blue-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-all"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Daily Reports</p>
                <p className="text-sm text-gray-600">Receive daily analytics summaries</p>
              </div>
              <div className="w-11 h-6 bg-gray-200 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-500" />
            Account Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <input 
                type="text" 
                defaultValue="Dr. Rajesh Sharma"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Clinic</label>
              <input 
                type="text" 
                defaultValue="AIIMS New Delhi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Internal Medicine</option>
                <option>Ayurveda</option>
                <option>Homeopathy</option>
                <option>Unani</option>
                <option>Siddha</option>
              </select>
            </div>
            <div className="pt-4">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800">Export All Data</p>
              <p className="text-sm text-red-600">Download all your platform data</p>
            </div>
            <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
              Export Data
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {currentScreen === 'login' ? (
        <LoginScreen />
      ) : (
        <>
          <Sidebar />
          {currentScreen === 'dashboard' && <Dashboard />}
          {currentScreen === 'translator' && <CodeTranslator />}
          {currentScreen === 'upload' && <PatientUpload />}
          {currentScreen === 'analytics' && <Analytics />}
        </>
      )}
    </div>
  );
};

export default MediSync;
