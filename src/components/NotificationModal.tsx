import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Smartphone
} from 'lucide-react';
import { CalculatedItem } from '../types/consumable';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification 
} from '../utils/notifications';
import { formatDateDisplay } from '../utils/dateCalc';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  urgentItems: CalculatedItem[];
  onPermissionChange?: (perm: NotificationPermission | 'unsupported') => void;
  onShowToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  urgentItems,
  onPermissionChange,
  onShowToast
}) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  );
  const [isSendingTest, setIsSendingTest] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (onPermissionChange) onPermissionChange(perm);

    if (perm === 'granted') {
      onShowToast('Notificações de lembrete ativadas.', 'success');
      await sendTestNotification();
    } else if (perm === 'denied') {
      onShowToast('As notificações estão bloqueadas no navegador. Ative-as nas definições do site.', 'error');
    }
  };

  const handleTestNotification = async () => {
    setIsSendingTest(true);
    try {
      const success = await sendTestNotification();
      if (success) {
        onShowToast('Notificação de teste enviada! Verifique as notificações do sistema.', 'success');
      } else {
        onShowToast('Erro ao enviar a notificação. Verifique as permissões do navegador.', 'error');
      }
    } catch {
      onShowToast('Ocorreu um erro ao enviar a notificação.', 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bell className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Definições de notificações e lembretes
              </h2>
              <p className="text-xs text-slate-400 font-medium">Receba avisos atempados quando os consumíveis precisarem de ser substituídos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Permission Status Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {permission === 'granted' ? (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                ) : permission === 'denied' ? (
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4 stroke-[2.5]" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    {permission === 'granted'
                      ? 'Notificações ativas'
                      : permission === 'denied'
                      ? 'Notificações bloqueadas pelo navegador'
                      : 'Notificações não configuradas'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                    {permission === 'granted'
                      ? 'Ligadas ao seu dispositivo através de Service Worker. Receberá avisos automáticos quando os consumíveis estiverem prestes a vencer.'
                      : permission === 'denied'
                      ? 'A permissão está atualmente recusada. Clique no cadeado junto à barra de endereço e permita as notificações.'
                      : 'Ative as notificações para receber lembretes discretos quando filtros, cabeças ou produtos de casa exigirem substituição.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
              {permission !== 'granted' && permission !== 'unsupported' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 rounded-xl shadow-xs shadow-emerald-600/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Ativar notificações</span>
                </button>
              )}

              {permission === 'granted' && (
                <button
                  type="button"
                  onClick={handleTestNotification}
                  disabled={isSendingTest}
                  className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 active:scale-95 border border-emerald-200/80 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingTest ? 'A enviar...' : 'Enviar notificação de teste'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Background / PWA Tips */}
          <div className="p-4 sm:p-5 rounded-2xl border border-sky-200/80 bg-sky-50/70 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-sky-950 font-bold">
              <Smartphone className="w-4 h-4 text-sky-700 stroke-[2.2]" />
              <span>Sugestão para telemóveis e instalação da PWA</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs font-medium">
              O Replenish pode ser instalado como PWA. Utilize "Adicionar ao ecrã principal" no Chrome ou Safari para desfrutar da experiência em ecrã inteiro e receber notificações fiáveis via Service Worker.
            </p>
          </div>

          {/* Current Urgent Items Preview */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center justify-between">
              <span>Artigos que requerem a sua atenção ({urgentItems.length})</span>
              <span className="text-[11px] text-slate-400 font-medium">Hoje · Em atraso · A comprar</span>
            </h3>

            {urgentItems.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 font-medium">
                Nenhum artigo em atraso ou para comprar. Tudo perfeitamente em dia!
              </div>
            ) : (
              <div className="space-y-1.5">
                {urgentItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 truncate block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Prazo: {formatDateDisplay(item.nextReplacementDate)}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                      item.status === 'overdue'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.status === 'today'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}>
                      {item.statusLabel}
                    </span>
                  </div>
                ))}
                {urgentItems.length > 5 && (
                  <p className="text-[11px] text-slate-400 text-center pt-1 font-medium">
                    + outros {urgentItems.length - 5} artigos por rever
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
