import type { Player, PositionTag } from '../../../types/futsal';
import { getPositionConfig } from '../../../constants/positionTags';
import { getFormattedDateCode } from '../../../utils/formatters';

const getFullPositionLabel = (positions?: PositionTag[]): string => {
  if (!positions || positions.length === 0) return 'Chưa phân vị trí';
  return positions.map((p) => getPositionConfig(p).fullLabel).join(', ');
};

export const exportPlayersToCSV = (players: Player[]) => {
  const dateCode = getFormattedDateCode();
  const filename = `danh_sach_cau_thu_${dateCode}.csv`;

  let csvContent = '\uFEFF';
  csvContent += 'Danh sách cầu thủ\n\n';
  csvContent += 'Số áo,Họ và tên cầu thủ,Vị trí\n';

  players.forEach((p) => {
    const number = p.number;
    const name = `"${(p.name || '').replace(/"/g, '""')}"`;
    const positions = `"${getFullPositionLabel(p.positions).replace(/"/g, '""')}"`;
    csvContent += `${number},${name},${positions}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportPlayersToPDF = (players: Player[]) => {
  const dateCode = getFormattedDateCode();
  const filename = `danh_sach_cau_thu_${dateCode}_pdf`;
  const nowStr = new Date().toLocaleDateString('vi-VN');

  const rowsHtml = players
    .map(
      (p) => `
    <tr>
      <td style="text-align: center; font-weight: bold; padding: 10px; border-bottom: 1px solid #e2e8f0;">${p.number}</td>
      <td style="font-weight: bold; padding: 10px; border-bottom: 1px solid #e2e8f0;">${p.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${getFullPositionLabel(p.positions)}</td>
    </tr>
  `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${filename}</title>
        <style>
          body { font-family: 'Roboto', system-ui, -apple-system, sans-serif; margin: 30px; color: #1e293b; }
          h1 { font-size: 24px; font-weight: 900; color: #2563eb; margin-bottom: 4px; }
          p.subtitle { font-size: 13px; color: #64748b; margin-bottom: 24px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
          th { background-color: #f8fafc; color: #475569; text-transform: uppercase; font-size: 12px; font-weight: 800; padding: 12px 10px; border-bottom: 2px solid #cbd5e1; text-align: left; }
          th.center { text-align: center; }
          footer { margin-top: 40px; text-align: right; font-size: 12px; color: #94a3b8; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>Danh sách cầu thủ</h1>
        <p class="subtitle">Ngày xuất: ${nowStr} • Tổng số: ${players.length} cầu thủ</p>
        <table>
          <thead>
            <tr>
              <th class="center" style="width: 80px;">Số áo</th>
              <th>Họ và tên cầu thủ</th>
              <th>Vị trí</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <footer>Hệ thống Quản Lý Đội Hình Futsal FTSP</footer>
        <script>
          window.onload = function() {
            document.title = "${filename}";
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};
