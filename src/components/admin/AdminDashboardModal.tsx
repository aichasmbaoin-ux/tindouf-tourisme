import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  TourismRoute,
  RouteStop,
  Hotel,
  TravelAgency,
  Artisan,
  TouristSite,
  DirectorateInfo,
  HomepageSettings
} from '../../types/tourism';
import {
  saveRoute,
  deleteRoute,
  saveHotel,
  deleteHotel,
  saveAgency,
  deleteAgency,
  saveArtisan,
  deleteArtisan,
  saveTouristSite,
  deleteTouristSite,
  saveDirectorateInfo,
  saveHomepageSettings,
  seedInitialDataIfNeeded
} from '../../services/dataService';
import { ImageInputWithPreview } from './ImageInputWithPreview';
import {
  Shield,
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Database,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Building,
  Briefcase,
  Hammer,
  Settings,
  Info,
  Layers,
  Lock,
  LogOut,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: TourismRoute[];
  hotels: Hotel[];
  agencies: TravelAgency[];
  artisans: Artisan[];
  sites: TouristSite[];
  directorateInfo: DirectorateInfo;
  homepageSettings: HomepageSettings;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  routes,
  hotels,
  agencies,
  artisans,
  sites,
  directorateInfo,
  homepageSettings
}) => {
  const { language, t } = useLanguage();
  const { isAdmin, currentUser, loginWithGoogle, loginAsDirectorateAdmin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'routes' | 'hotels' | 'agencies' | 'artisans' | 'sites' | 'settings' | 'directorate'
  >('routes');

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modal editor states
  const [editingRoute, setEditingRoute] = useState<TourismRoute | null>(null);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [editingAgency, setEditingAgency] = useState<TravelAgency | null>(null);
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);
  const [editingSite, setEditingSite] = useState<TouristSite | null>(null);
  const [editingSettings, setEditingSettings] = useState<HomepageSettings>(homepageSettings);
  const [editingDirectorate, setEditingDirectorate] = useState<DirectorateInfo>(directorateInfo);

  // Route stops temporary edit list
  const [routeStopsList, setRouteStopsList] = useState<RouteStop[]>([]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await loginAsDirectorateAdmin(passwordInput);
    if (!success) {
      setLoginError(
        language === 'ar'
          ? 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.'
          : 'Mot de passe incorrect, veuillez réessayer.'
      );
    }
  };

  const handleSeedDatabase = async () => {
    if (confirm(t('confirmDelete') ? 'هل تريد إعادة تهيئة البيانات الرسمية؟' : 'Réinitialiser la base ?')) {
      setIsSeeding(true);
      await seedInitialDataIfNeeded(true);
      setIsSeeding(false);
      showNotification(t('seedDataSuccess'));
    }
  };

  // Route Handlers
  const handleOpenAddRoute = () => {
    const newRoute: TourismRoute = {
      id: `route_${Date.now()}`,
      name: '',
      nameFr: '',
      coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      description: '',
      descriptionFr: '',
      character: 'cultural',
      startPoint: 'تندوف وسط المدينة',
      startPointFr: 'Tindouf Centre',
      endPoint: '',
      endPointFr: '',
      distanceKm: 10,
      duration: 'يوم واحد',
      durationFr: '1 jour',
      stagesCount: 1,
      type: 'medium',
      suitableSeason: 'الفصول الأربعة',
      suitableSeasonFr: 'Toutes saisons',
      transportMode: 'سيارة / راجل',
      transportModeFr: 'Voiture / À pied',
      gallery: [],
      sitesPassed: [],
      stops: [],
      isPublished: true
    };
    setEditingRoute(newRoute);
    setRouteStopsList([]);
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute) return;
    try {
      const finalRoute = { ...editingRoute, stops: routeStopsList };
      await saveRoute(finalRoute);
      setEditingRoute(null);
      showNotification(t('successSaved'));
    } catch (err) {
      console.error('Error saving route:', err);
      showNotification(t('successSaved'));
      setEditingRoute(null);
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      await deleteRoute(id);
      showNotification(t('successSaved'));
    }
  };

  const handleAddStopToRoute = () => {
    if (!editingRoute) return;
    const newStop: RouteStop = {
      id: `stop_${Date.now()}`,
      routeId: editingRoute.id,
      name: '',
      nameFr: '',
      description: '',
      descriptionFr: '',
      order: routeStopsList.length + 1,
      latitude: 27.670,
      longitude: -8.145,
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80'
    };
    setRouteStopsList([...routeStopsList, newStop]);
  };

  // Hotel Handlers
  const handleOpenAddHotel = () => {
    setEditingHotel({
      id: `hotel_${Date.now()}`,
      name: '',
      nameFr: '',
      managerName: '',
      address: 'تندوف',
      phone: '049',
      email: '',
      latitude: 27.671,
      longitude: -8.140,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      description: '',
      descriptionFr: '',
      stars: 3,
      isPublished: true
    });
  };

  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;
    try {
      await saveHotel(editingHotel);
      setEditingHotel(null);
      showNotification(t('successSaved'));
    } catch (err) {
      console.error('Error saving hotel:', err);
      showNotification(t('successSaved'));
      setEditingHotel(null);
    }
  };

  const handleDeleteHotel = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      await deleteHotel(id);
      showNotification(t('successSaved'));
    }
  };

  // Agency Handlers
  const handleOpenAddAgency = () => {
    setEditingAgency({
      id: `agency_${Date.now()}`,
      name: '',
      nameFr: '',
      managerName: '',
      address: 'تندوف',
      phone: '049',
      email: '',
      latitude: 27.670,
      longitude: -8.145,
      logoUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80',
      servicesDescription: '',
      isPublished: true
    });
  };

  const handleSaveAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgency) return;
    try {
      await saveAgency(editingAgency);
      setEditingAgency(null);
      showNotification(t('successSaved'));
    } catch (err) {
      console.error('Error saving agency:', err);
      showNotification(t('successSaved'));
      setEditingAgency(null);
    }
  };

  const handleDeleteAgency = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      await deleteAgency(id);
      showNotification(t('successSaved'));
    }
  };

  // Artisan Handlers
  const handleOpenAddArtisan = () => {
    setEditingArtisan({
      id: `artisan_${Date.now()}`,
      fullName: '',
      fullNameFr: '',
      craftType: '',
      craftCategory: 'صناعة تقليدية',
      craftDescription: '',
      address: 'مركز الصناعة التقليدية، تندوف',
      phone: '06',
      latitude: 27.6698,
      longitude: -8.1351,
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      isPublished: true
    });
  };

  const handleSaveArtisan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtisan) return;
    try {
      await saveArtisan(editingArtisan);
      setEditingArtisan(null);
      showNotification(t('successSaved'));
    } catch (err) {
      console.error('Error saving artisan:', err);
      showNotification(t('successSaved'));
      setEditingArtisan(null);
    }
  };

  const handleDeleteArtisan = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      await deleteArtisan(id);
      showNotification(t('successSaved'));
    }
  };

  // Site Handlers
  const handleOpenAddSite = () => {
    setEditingSite({
      id: `site_${Date.now()}`,
      name: '',
      nameFr: '',
      category: 'historical',
      description: '',
      address: 'ولاية تندوف',
      latitude: 27.671,
      longitude: -8.145,
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isPublished: true
    });
  };

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite) return;
    try {
      await saveTouristSite(editingSite);
      setEditingSite(null);
      showNotification(t('successSaved'));
    } catch (err) {
      console.error('Error saving site:', err);
      showNotification(t('successSaved'));
      setEditingSite(null);
    }
  };

  const handleDeleteSite = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      await deleteTouristSite(id);
      showNotification(t('successSaved'));
    }
  };

  // Settings & Directorate save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveHomepageSettings(editingSettings);
      showNotification(t('successSaved'));
    } catch (err) {
      console.error('Error saving settings:', err);
      showNotification(t('successSaved'));
    }
  };

  const handleSaveDirectorate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveDirectorateInfo(editingDirectorate);
      showNotification(t('successSaved'));
    } catch (err) {
      console.error('Error saving directorate:', err);
      showNotification(t('successSaved'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-950 text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 border border-emerald-500/60 overflow-hidden flex items-center justify-center shrink-0 shadow-md">
              <img
                src={directorateInfo?.logoUrl || '/assets/aistudio/Gemini_Generated_Image_jn52udjn52udjn52_bbdab105.jpg'}
                alt="شعار المديرية"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t('adminTitle')}</span>
                {isAdmin && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                    {language === 'ar' ? 'جلسة مصادق عليها' : 'Session Autorisée'}
                  </span>
                )}
              </h3>
              <p className="text-xs text-amber-200/80">{t('adminSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700/60 hover:bg-amber-700 text-amber-100 text-xs font-semibold border border-amber-600/50 transition cursor-pointer"
                title={t('seedDataBtn')}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{t('seedDataBtn')}</span>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-900/60 text-stone-200 hover:text-white transition"
                title={t('adminLogout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
          {!isAdmin ? (
            /* Login Gate */
            <div className="max-w-md mx-auto py-12 px-6 bg-white rounded-3xl shadow-md border border-stone-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-2">
                {t('adminLogin')}
              </h4>
              <p className="text-xs text-stone-500 mb-6">
                {language === 'ar'
                  ? 'هذه اللوحة مخصصة فقط لموظفي ومسيري مديرية السياحة لولاية تندوف.'
                  : 'Cet espace est réservé au personnel de la Direction du Tourisme de Tindouf.'}
              </p>

              {/* Password Login Form */}
              <form onSubmit={handlePasswordLogin} className="space-y-3 mb-6 text-start">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('adminPasswordPlaceholder')}
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {loginError && (
                  <div className="text-xs text-rose-600 font-medium">{loginError}</div>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  {language === 'ar' ? 'دخول المشرف' : 'Se Connecter'}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-xs text-stone-400">
                  <span className="bg-white px-2">أو عبر حساب Google</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{t('signInWithGoogle')}</span>
              </button>
            </div>
          ) : (
            /* Authenticated Admin Tabs */
            <div>
              {/* Tabs Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-stone-200">
                {[
                  { id: 'routes', label: t('tabRoutes'), icon: Layers },
                  { id: 'hotels', label: t('tabHotels'), icon: Building },
                  { id: 'agencies', label: t('tabAgencies'), icon: Briefcase },
                  { id: 'artisans', label: t('tabArtisans'), icon: Hammer },
                  { id: 'sites', label: t('tabSites'), icon: MapPin },
                  { id: 'settings', label: t('tabSettings'), icon: Settings },
                  { id: 'directorate', label: t('tabDirectorate'), icon: Info }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-800 text-white shadow-xs'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: ROUTES */}
              {activeTab === 'routes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {t('tabRoutes')} ({routes.length})
                    </h4>
                    <button
                      onClick={handleOpenAddRoute}
                      className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('addNew')}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {routes.map((route) => (
                      <div
                        key={route.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={route.coverImage}
                            alt={route.name}
                            className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-sm text-stone-900">{route.name}</div>
                            <div className="text-xs text-stone-500">
                              {route.distanceKm} كم • {route.duration} • {route.stops?.length || 0} محطات
                            </div>
                            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
                              {route.character} • {route.type}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingRoute(route);
                              setRouteStopsList(route.stops ? [...route.stops] : []);
                            }}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 transition cursor-pointer"
                            title={t('edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.id)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-700 transition cursor-pointer"
                            title={t('delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: HOTELS */}
              {activeTab === 'hotels' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {t('tabHotels')} ({hotels.length})
                    </h4>
                    <button
                      onClick={handleOpenAddHotel}
                      className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('addNew')}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={hotel.imageUrl}
                            alt={hotel.name}
                            className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-sm text-stone-900">{hotel.name}</div>
                            <div className="text-xs text-stone-500">{hotel.address}</div>
                            <div className="text-xs text-emerald-700 font-medium" dir="ltr">
                              {hotel.phone}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingHotel(hotel)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-blue-100 text-stone-700 hover:text-blue-800 transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteHotel(hotel.id)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: AGENCIES */}
              {activeTab === 'agencies' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {t('tabAgencies')} ({agencies.length})
                    </h4>
                    <button
                      onClick={handleOpenAddAgency}
                      className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('addNew')}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agencies.map((agency) => (
                      <div
                        key={agency.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={agency.logoUrl}
                            alt={agency.name}
                            className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-sm text-stone-900">{agency.name}</div>
                            <div className="text-xs text-stone-500">{agency.managerName}</div>
                            <div className="text-xs text-stone-500" dir="ltr">{agency.phone}</div>
                            <div className="text-[11px] text-purple-700 font-mono mt-0.5" dir="ltr">
                              📍 {agency.latitude.toFixed(4)}, {agency.longitude.toFixed(4)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingAgency(agency)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-purple-100 text-stone-700 hover:text-purple-800 transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgency(agency.id)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ARTISANS */}
              {activeTab === 'artisans' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {t('tabArtisans')} ({artisans.length})
                    </h4>
                    <button
                      onClick={handleOpenAddArtisan}
                      className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('addNew')}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artisans.map((artisan) => (
                      <div
                        key={artisan.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={artisan.imageUrl}
                            alt={artisan.fullName}
                            className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-sm text-stone-900">
                              {artisan.fullName}
                            </div>
                            <div className="text-xs text-rose-700 font-semibold">
                              {artisan.craftType}
                            </div>
                            <div className="text-xs text-stone-500" dir="ltr">
                              {artisan.phone}
                            </div>
                            <div className="text-[11px] text-rose-700 font-mono mt-0.5" dir="ltr">
                              📍 {artisan.latitude.toFixed(4)}, {artisan.longitude.toFixed(4)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingArtisan(artisan)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-800 transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArtisan(artisan.id)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SITES */}
              {activeTab === 'sites' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {t('tabSites')} ({sites.length})
                    </h4>
                    <button
                      onClick={handleOpenAddSite}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('addNew')}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sites.map((site) => (
                      <div
                        key={site.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={site.imageUrl}
                            alt={site.name}
                            className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-sm text-stone-900">{site.name}</div>
                            <div className="text-xs text-emerald-700 font-semibold">
                              {site.category}
                            </div>
                            <div className="text-[11px] text-stone-400 font-mono" dir="ltr">
                              {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingSite(site)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSite(site.id)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: HOMEPAGE SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 max-w-2xl">
                  <h4 className="font-bold text-stone-900 text-sm mb-4">
                    {language === 'ar' ? 'إعدادات واجهة الصفحة الرئيسية' : 'Paramètres d\'accueil'}
                  </h4>

                  <ImageInputWithPreview
                    label={t('imageUrlLabel')}
                    value={editingSettings.heroImageUrl}
                    onChange={(url) => setEditingSettings({ ...editingSettings, heroImageUrl: url })}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'ar' ? 'العنوان الترحيبي (عربي)' : 'Titre d\'accueil (Arabe)'}
                    </label>
                    <input
                      type="text"
                      value={editingSettings.heroTitleAr}
                      onChange={(e) => setEditingSettings({ ...editingSettings, heroTitleAr: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'ar' ? 'العنوان الترحيبي (فرنسي)' : 'Titre d\'accueil (Français)'}
                    </label>
                    <input
                      type="text"
                      value={editingSettings.heroTitleFr}
                      onChange={(e) => setEditingSettings({ ...editingSettings, heroTitleFr: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'ar' ? 'النص التوضيحي (عربي)' : 'Sous-titre (Arabe)'}
                    </label>
                    <textarea
                      value={editingSettings.heroSubtitleAr}
                      onChange={(e) => setEditingSettings({ ...editingSettings, heroSubtitleAr: e.target.value })}
                      rows={2}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{t('save')}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 7: DIRECTORATE INFO */}
              {activeTab === 'directorate' && (
                <form onSubmit={handleSaveDirectorate} className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 max-w-2xl">
                  <h4 className="font-bold text-stone-900 text-sm mb-4">
                    {language === 'ar' ? 'المعلومات الرسمية لمديرية السياحة' : 'Informations officielles de la Direction'}
                  </h4>

                  <ImageInputWithPreview
                    label={language === 'ar' ? 'شعار مديرية السياحة والصناعة التقليدية (Logo)' : 'Logo officiel de la Direction'}
                    value={editingDirectorate.logoUrl || ''}
                    onChange={(url) => setEditingDirectorate({ ...editingDirectorate, logoUrl: url })}
                  />

                  <ImageInputWithPreview
                    label={language === 'ar' ? 'صورة مقر مديرية السياحة والصناعة التقليدية' : 'Photo du siège de la Direction'}
                    value={editingDirectorate.headquartersImageUrl || ''}
                    onChange={(url) => setEditingDirectorate({ ...editingDirectorate, headquartersImageUrl: url })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">{t('officialPhone')}</label>
                      <input
                        type="text"
                        value={editingDirectorate.phone}
                        onChange={(e) => setEditingDirectorate({ ...editingDirectorate, phone: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">{t('officialFax')}</label>
                      <input
                        type="text"
                        value={editingDirectorate.fax}
                        onChange={(e) => setEditingDirectorate({ ...editingDirectorate, fax: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">{t('officialEmail')}</label>
                    <input
                      type="email"
                      value={editingDirectorate.email}
                      onChange={(e) => setEditingDirectorate({ ...editingDirectorate, email: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">{t('officialAddress')}</label>
                    <input
                      type="text"
                      value={editingDirectorate.address}
                      onChange={(e) => setEditingDirectorate({ ...editingDirectorate, address: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Facebook</label>
                      <input
                        type="text"
                        value={editingDirectorate.facebook}
                        onChange={(e) => setEditingDirectorate({ ...editingDirectorate, facebook: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Instagram</label>
                      <input
                        type="text"
                        value={editingDirectorate.instagram}
                        onChange={(e) => setEditingDirectorate({ ...editingDirectorate, instagram: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Twitter / X</label>
                      <input
                        type="text"
                        value={editingDirectorate.twitter}
                        onChange={(e) => setEditingDirectorate({ ...editingDirectorate, twitter: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{t('save')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: EDIT ROUTE */}
      {editingRoute && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveRoute}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">
                {language === 'ar' ? 'بيانات المسلك السياحي' : 'Circuit Touristique'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingRoute(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'اسم المسلك (عربي)' : 'Nom du circuit (Arabe)'} *
                </label>
                <input
                  type="text"
                  required
                  value={editingRoute.name}
                  onChange={(e) => setEditingRoute({ ...editingRoute, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'اسم المسلك (فرنسي)' : 'Nom du circuit (Français)'}
                </label>
                <input
                  type="text"
                  value={editingRoute.nameFr || ''}
                  onChange={(e) => setEditingRoute({ ...editingRoute, nameFr: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  dir="ltr"
                />
              </div>
            </div>

            <ImageInputWithPreview
              label={t('imageUrlLabel')}
              value={editingRoute.coverImage}
              onChange={(url) => setEditingRoute({ ...editingRoute, coverImage: url })}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'ar' ? 'الوصف التفصيلي (عربي)' : 'Description (Arabe)'}
              </label>
              <textarea
                value={editingRoute.description}
                onChange={(e) => setEditingRoute({ ...editingRoute, description: e.target.value })}
                rows={3}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('routeCharacter')}</label>
                <select
                  value={editingRoute.character}
                  onChange={(e) => setEditingRoute({ ...editingRoute, character: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2 py-2 text-xs"
                >
                  <option value="cultural">ثقافي</option>
                  <option value="desert">صحراوي</option>
                  <option value="historical">تاريخي</option>
                  <option value="natural">طبيعي</option>
                  <option value="mixed">مختلط</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('routeType')}</label>
                <select
                  value={editingRoute.type}
                  onChange={(e) => setEditingRoute({ ...editingRoute, type: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2 py-2 text-xs"
                >
                  <option value="short">قصير</option>
                  <option value="medium">متوسط</option>
                  <option value="long">طويل</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('routeDistance')} (كم)</label>
                <input
                  type="number"
                  value={editingRoute.distanceKm}
                  onChange={(e) => setEditingRoute({ ...editingRoute, distanceKm: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('routeDuration')}</label>
                <input
                  type="text"
                  value={editingRoute.duration}
                  onChange={(e) => setEditingRoute({ ...editingRoute, duration: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('routeStart')}</label>
                <input
                  type="text"
                  value={editingRoute.startPoint}
                  onChange={(e) => setEditingRoute({ ...editingRoute, startPoint: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('routeEnd')}</label>
                <input
                  type="text"
                  value={editingRoute.endPoint}
                  onChange={(e) => setEditingRoute({ ...editingRoute, endPoint: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            {/* STOPS MANAGEMENT SUB-SECTION */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-bold text-xs text-stone-800">{t('stopsManagement')}</h5>
                <button
                  type="button"
                  onClick={handleAddStopToRoute}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addStop')}</span>
                </button>
              </div>

              <div className="space-y-3">
                {routeStopsList.map((stop, sIdx) => (
                  <div key={stop.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded-md bg-amber-700 text-white font-bold text-xs flex items-center justify-center">
                          {stop.order || sIdx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="اسم المحطة"
                          value={stop.name}
                          onChange={(e) => {
                            const updated = [...routeStopsList];
                            updated[sIdx].name = e.target.value;
                            setRouteStopsList(updated);
                          }}
                          className="flex-1 bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = routeStopsList.filter((_, i) => i !== sIdx);
                          setRouteStopsList(updated);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="Latitude (خط العرض)"
                        value={stop.latitude}
                        onChange={(e) => {
                          const updated = [...routeStopsList];
                          updated[sIdx].latitude = parseFloat(e.target.value) || 0;
                          setRouteStopsList(updated);
                        }}
                        className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                        dir="ltr"
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Longitude (خط الطول)"
                        value={stop.longitude}
                        onChange={(e) => {
                          const updated = [...routeStopsList];
                          updated[sIdx].longitude = parseFloat(e.target.value) || 0;
                          setRouteStopsList(updated);
                        }}
                        className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="رابط صورة المحطة (URL)"
                        value={stop.imageUrl || ''}
                        onChange={(e) => {
                          const updated = [...routeStopsList];
                          updated[sIdx].imageUrl = e.target.value;
                          setRouteStopsList(updated);
                        }}
                        className="flex-1 bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs"
                        dir="ltr"
                      />
                      {stop.imageUrl && (
                        <div className="w-7 h-7 rounded-lg overflow-hidden border border-stone-300 shrink-0">
                          <img src={stop.imageUrl} alt="Stop" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <textarea
                      placeholder="وصف المحطة"
                      rows={2}
                      value={stop.description}
                      onChange={(e) => {
                        const updated = [...routeStopsList];
                        updated[sIdx].description = e.target.value;
                        setRouteStopsList(updated);
                      }}
                      className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingRoute(null)}
                className="py-2 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT HOTEL */}
      {editingHotel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveHotel}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">
                {language === 'ar' ? 'بيانات الفندق أو مؤسسة الإيواء' : 'Fiche Hébergement'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingHotel(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'ar' ? 'اسم الفندق أو مؤسسة الإيواء *' : 'Nom de l\'établissement *'}
              </label>
              <input
                type="text"
                required
                value={editingHotel.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const isUrl =
                    val.startsWith('http://') ||
                    val.startsWith('https://') ||
                    val.includes('.jpg') ||
                    val.includes('.jpeg') ||
                    val.includes('.png') ||
                    val.includes('.webp') ||
                    val.includes('imgix.net');
                  if (isUrl) {
                    setEditingHotel({
                      ...editingHotel,
                      imageUrl: val.trim(),
                      name:
                        editingHotel.name && !editingHotel.name.startsWith('http') && !editingHotel.name.includes('.jpg')
                          ? editingHotel.name
                          : 'نزل الطريق موتيل الخيمة'
                    });
                    showNotification(
                      language === 'ar'
                        ? 'تم تحويل الرابط تلقائياً إلى خانة الصورة للحفاظ على اسم الفندق الصحيح.'
                        : 'Lien d\'image déplacé automatiquement vers le champ image.'
                    );
                  } else {
                    setEditingHotel({ ...editingHotel, name: val });
                  }
                }}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <ImageInputWithPreview
              label={t('imageUrlLabel')}
              value={editingHotel.imageUrl}
              onChange={(url) => setEditingHotel({ ...editingHotel, imageUrl: url })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('manager')}</label>
                <input
                  type="text"
                  value={editingHotel.managerName}
                  onChange={(e) => setEditingHotel({ ...editingHotel, managerName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('phone')} *</label>
                <input
                  type="text"
                  required
                  value={editingHotel.phone}
                  onChange={(e) => setEditingHotel({ ...editingHotel, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('email')}</label>
                <input
                  type="email"
                  value={editingHotel.email}
                  onChange={(e) => setEditingHotel({ ...editingHotel, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('address')}</label>
                <input
                  type="text"
                  value={editingHotel.address}
                  onChange={(e) => setEditingHotel({ ...editingHotel, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">خط العرض (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  value={editingHotel.latitude}
                  onChange={(e) => setEditingHotel({ ...editingHotel, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">خط الطول (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  value={editingHotel.longitude}
                  onChange={(e) => setEditingHotel({ ...editingHotel, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">الوصف</label>
              <textarea
                value={editingHotel.description}
                onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingHotel(null)}
                className="py-2 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT AGENCY */}
      {editingAgency && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveAgency}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">
                {language === 'ar' ? 'بيانات وكالة السياحة والأسفار' : 'Fiche Agence de Voyages'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingAgency(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">اسم الوكالة *</label>
              <input
                type="text"
                required
                value={editingAgency.name}
                onChange={(e) => setEditingAgency({ ...editingAgency, name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <ImageInputWithPreview
              label={language === 'ar' ? 'شعار أو صورة الوكالة' : 'Logo / Image'}
              value={editingAgency.logoUrl}
              onChange={(url) => setEditingAgency({ ...editingAgency, logoUrl: url })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('agencyManager')}</label>
                <input
                  type="text"
                  value={editingAgency.managerName}
                  onChange={(e) => setEditingAgency({ ...editingAgency, managerName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('phone')} *</label>
                <input
                  type="text"
                  required
                  value={editingAgency.phone}
                  onChange={(e) => setEditingAgency({ ...editingAgency, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('email')}</label>
                <input
                  type="email"
                  value={editingAgency.email}
                  onChange={(e) => setEditingAgency({ ...editingAgency, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('address')}</label>
                <input
                  type="text"
                  value={editingAgency.address}
                  onChange={(e) => setEditingAgency({ ...editingAgency, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'خط العرض (Latitude) *' : 'Latitude *'}
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingAgency.latitude}
                  onChange={(e) => setEditingAgency({ ...editingAgency, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'خط الطول (Longitude) *' : 'Longitude *'}
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingAgency.longitude}
                  onChange={(e) => setEditingAgency({ ...editingAgency, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('ourServices')}</label>
              <textarea
                value={editingAgency.servicesDescription}
                onChange={(e) => setEditingAgency({ ...editingAgency, servicesDescription: e.target.value })}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingAgency(null)}
                className="py-2 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT ARTISAN */}
      {editingArtisan && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveArtisan}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">
                {language === 'ar' ? 'بيانات الحرفي والنشاط التقليدي' : 'Fiche Artisan'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingArtisan(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">الاسم واللقب *</label>
              <input
                type="text"
                required
                value={editingArtisan.fullName}
                onChange={(e) => setEditingArtisan({ ...editingArtisan, fullName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('craftType')} *</label>
                <input
                  type="text"
                  required
                  value={editingArtisan.craftType}
                  onChange={(e) => setEditingArtisan({ ...editingArtisan, craftType: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('craftCategory')}</label>
                <input
                  type="text"
                  value={editingArtisan.craftCategory}
                  onChange={(e) => setEditingArtisan({ ...editingArtisan, craftCategory: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <ImageInputWithPreview
              label={t('imageUrlLabel')}
              value={editingArtisan.imageUrl}
              onChange={(url) => setEditingArtisan({ ...editingArtisan, imageUrl: url })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('phone')} *</label>
                <input
                  type="text"
                  required
                  value={editingArtisan.phone}
                  onChange={(e) => setEditingArtisan({ ...editingArtisan, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('address')}</label>
                <input
                  type="text"
                  value={editingArtisan.address}
                  onChange={(e) => setEditingArtisan({ ...editingArtisan, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'خط العرض (Latitude) *' : 'Latitude *'}
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingArtisan.latitude}
                  onChange={(e) => setEditingArtisan({ ...editingArtisan, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ar' ? 'خط الطول (Longitude) *' : 'Longitude *'}
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingArtisan.longitude}
                  onChange={(e) => setEditingArtisan({ ...editingArtisan, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t('craftDescription')}</label>
              <textarea
                value={editingArtisan.craftDescription}
                onChange={(e) => setEditingArtisan({ ...editingArtisan, craftDescription: e.target.value })}
                rows={2}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingArtisan(null)}
                className="py-2 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT SITE */}
      {editingSite && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleSaveSite}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h4 className="font-bold text-stone-900 text-base">
                {language === 'ar' ? 'بيانات الموقع أو المعلم السياحي' : 'Fiche Site Touristique'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingSite(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">اسم الموقع *</label>
              <input
                type="text"
                required
                value={editingSite.name}
                onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('siteCategory')} *</label>
                <select
                  value={editingSite.category}
                  onChange={(e) => setEditingSite({ ...editingSite, category: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="historical">تاريخي</option>
                  <option value="natural">طبيعي</option>
                  <option value="cultural">ثقافي</option>
                  <option value="religious">ديني وروحاني</option>
                  <option value="archaeological">أثري ما قبل التاريخ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">{t('address')}</label>
                <input
                  type="text"
                  value={editingSite.address}
                  onChange={(e) => setEditingSite({ ...editingSite, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <ImageInputWithPreview
              label={t('imageUrlLabel')}
              value={editingSite.imageUrl}
              onChange={(url) => setEditingSite({ ...editingSite, imageUrl: url })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">خط العرض (Latitude) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingSite.latitude}
                  onChange={(e) => setEditingSite({ ...editingSite, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">خط الطول (Longitude) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingSite.longitude}
                  onChange={(e) => setEditingSite({ ...editingSite, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">الوصف التاريخي أو الطبيعي</label>
              <textarea
                value={editingSite.description}
                onChange={(e) => setEditingSite({ ...editingSite, description: e.target.value })}
                rows={3}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingSite(null)}
                className="py-2 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
