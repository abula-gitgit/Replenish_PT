import React, { useState } from 'react';
import {
  Plus,
  Settings,
  Database,
  Sliders,
  ChevronDown,
  LayoutGrid,
  Calendar,
  BookOpen,
  History,
  RotateCcw,
  Bell,
  Info,
  ShieldCheck,
  FileText,
  Mail
} from 'lucide-react';
import { ViewMode } from '../types/consumable';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenMasterModal: () => void;
  notificationPermission: NotificationPermission | 'unsupported';
  onRequestNotification: () => void;
  onOpenNotificationModal?: () => void;
  urgentCount: number;
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenBackupModal,
  onOpenMasterModal,
  notificationPermission,
  onRequestNotification,
  onOpenNotificationModal,
  viewMode = 'list',
  onViewChange
}) => {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const navItems = [
    { id: 'list' as ViewMode, label: 'Artigos', icon: LayoutGrid },
    { id: 'calendar' as ViewMode, label: 'Calendário', icon: Calendar },
    { id: 'history' as ViewMode, label: 'Histórico', icon: History },
    { id: 'guide' as ViewMode, label: 'Guia', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onViewChange && onViewChange('list')}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  Replenish
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100/70 text-emerald-800 tracking-wide shrink-0">
                  Hogar
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                Gestão de Ciclos de Consumíveis
              </span>
            </div>
          </div>

          {/* Desktop View Switcher (Segmented Control) */}
          {onViewChange && (
            <div className="hidden md:inline-flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = viewMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-emerald-950 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 stroke-[2.3]' : 'text-slate-400 stroke-[1.8]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Top Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Add CTA */}
            <button
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl shadow-sm shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
              <span>Adicionar</span>
            </button>

            {/* Notification Settings */}
            <button
              onClick={() => {
                if (onOpenNotificationModal) onOpenNotificationModal();
                else onRequestNotification();
              }}
              className="p-2 sm:px-2.5 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 bg-white/80 transition-all inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium relative active:scale-95 shadow-2xs"
              title="Definições de lembretes e avisos"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline text-xs font-medium">Recordatorios</span>
              {notificationPermission !== 'granted' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Master Option Settings */}
            <button
              onClick={onOpenMasterModal}
              className="p-2 sm:px-2.5 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 bg-white/80 transition-all inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium active:scale-95 shadow-2xs"
              title="Gerir modelos e categorias"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline text-xs font-medium">Plantillas</span>
            </button>

            {/* Backup & Data Menu */}
            <div className="relative">
              <button
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className={`p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer border shadow-2xs active:scale-95 ${
                  isToolsMenuOpen
                    ? 'bg-slate-100 text-slate-900 border-slate-300'
                    : 'bg-white/80 text-slate-600 border-slate-200/70 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
                title="Gestão de dados e opções"
              >
                <Database className="w-4 h-4 text-slate-500" />
                <span className="hidden md:inline text-xs font-medium">Datos</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsToolsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-11 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl py-2 z-30 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2 text-[11px] font-bold text-slate-400 border-b border-slate-100 uppercase tracking-wider">
                      Gestão de Dados e Ferramentas
                    </div>

                    <button
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        onOpenBackupModal();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <Database className="w-4 h-4 text-emerald-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold">Cópia de segurança e importação JSON</span>
                        <span className="text-[10px] text-slate-400">Exporte ou restaure os seus dados</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        onOpenMasterModal();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-emerald-600" />
                      <div className="flex flex-col">
                        <span className="font-semibold">Catálogo de Modelos</span>
                        <span className="text-[10px] text-slate-400">Personalize modelos e categorias</span>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setIsToolsMenuOpen(false);
                        if (onOpenNotificationModal) onOpenNotificationModal();
                        else onRequestNotification();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bell className="w-4 h-4 text-emerald-600" />
                        <div className="flex flex-col">
                          <span className="font-semibold">Definições de Lembretes</span>
                          <span className="text-[10px] text-slate-400">Alertas do navegador e prazos</span>
                        </div>
                      </div>
                      {notificationPermission === 'granted' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">Ativo</span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">Desativado</span>
                      )}
                    </button>

                    <div className="border-t border-slate-100 my-1" />
                    <a
                      href="https://rp.easy-log.app/pt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="font-semibold">Replenish Portal</span>
                      <span className="text-[10px] text-emerald-600 font-medium">rp.easy-log.app/pt ↗</span>
                    </a>

                    {onViewChange && (
                      <>
                        <div className="border-t border-slate-100 my-1" />
                        <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Informações e Aspetos Legais
                        </div>
                        <button
                          onClick={() => {
                            setIsToolsMenuOpen(false);
                            onViewChange('about');
                            window.location.hash = 'about';
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Info className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">Sobre nosotros</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsToolsMenuOpen(false);
                            onViewChange('privacy');
                            window.location.hash = 'privacy';
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">Política de Privacidad</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsToolsMenuOpen(false);
                            onViewChange('terms');
                            window.location.hash = 'terms';
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">Términos de Servicio</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsToolsMenuOpen(false);
                            onViewChange('contact');
                            window.location.hash = 'contact';
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Mail className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">Contacto y Aviso Legal</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
