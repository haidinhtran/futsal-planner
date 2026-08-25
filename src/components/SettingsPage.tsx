import React, { useRef } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { storageService } from '@/services/storageService';
import { dialogService } from '@/services/dialogService';
import { ProjectInfoCard } from './SettingsPage/ProjectInfoCard';

interface SettingsPageProps {
  onDataRefresh: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onDataRefresh }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    storageService.exportBackup();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await storageService.importBackup(file);
        await dialogService.alert('Nhập dữ liệu thành công!');
        onDataRefresh();
      } catch (err: any) {
        await dialogService.alert(err.message || 'Lỗi nhập dữ liệu!');
      }
      e.target.value = '';
    }
  };

  const handleReset = async () => {
    if (await dialogService.confirm('Bạn có chắc chắn muốn khôi phục dữ liệu 14 cầu thủ & đội hình về mặc định?', 'danger')) {
      storageService.resetAllData();
      onDataRefresh();
    }
  };

  return (
    <div className="layout-page-container pt-4 pb-12 md:pt-6 md:pb-8">
      <div className="layout-section mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-surface flex flex-col items-start gap-4">
            <div>
              <h2 className="text-h3 font-bold text-slate-800">Sao lưu dữ liệu</h2>
              <p className="text-body text-slate-500 mt-1">
                Xuất toàn bộ dữ liệu hiện tại (cầu thủ, đội hình, sơ đồ) thành file .json để lưu trữ.
              </p>
            </div>
            <button onClick={handleExport} className="btn-outline w-full md:w-auto mt-auto">
              <Download className="w-4 h-4" /> Xuất tệp sao lưu
            </button>
          </div>

          <div className="card-surface flex flex-col items-start gap-4">
            <div>
              <h2 className="text-h3 font-bold text-slate-800">Phục hồi dữ liệu</h2>
              <p className="text-body text-slate-500 mt-1">
                Nhập dữ liệu từ file .json đã sao lưu trước đó.
              </p>
            </div>
            <button
              onClick={handleImportClick}
              className="btn-outline w-full md:w-auto mt-auto !text-emerald-600 hover:!text-emerald-700 hover:!bg-emerald-50 !border-emerald-200"
            >
              <Upload className="w-4 h-4" /> Nhập dữ liệu
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
          </div>

          <div className="card-surface flex flex-col items-start gap-4 md:col-span-2 !border-red-200 !bg-red-50/30">
            <div>
              <h2 className="text-h3 font-bold text-red-700">Khôi phục mặc định</h2>
              <p className="text-body text-red-600/80 mt-1">
                Xóa toàn bộ dữ liệu hiện tại và khôi phục về danh sách 14 cầu thủ mặc định. Hành động này không thể hoàn tác!
              </p>
            </div>
            <button onClick={handleReset} className="btn-outline-danger w-full md:w-auto mt-auto">
              <RotateCcw className="w-4 h-4" /> Khôi phục mặc định
            </button>
          </div>

          <ProjectInfoCard />
        </div>
      </div>
    </div>
  );
};
