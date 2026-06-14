import React, { useEffect } from 'react';
import type { ScheduleRow } from '../types';

interface ScheduleTableProps {
  timeSlots: string[];
  rows: ScheduleRow[];
  onRowsChange: (rows: ScheduleRow[]) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ timeSlots, rows, onRowsChange }) => {
  useEffect(() => {
    const newRows = timeSlots.map((slot) => {
      const existingRow = rows.find(r => r.timeSlot === slot);
      if (existingRow) return existingRow;
      return { id: crypto.randomUUID(), timeSlot: slot, action: '' };
    });
    if (newRows.length !== rows.length || newRows.some((r, i) => r.timeSlot !== rows[i]?.timeSlot)) {
      onRowsChange(newRows);
    }
  }, [timeSlots, rows, onRowsChange]);

  const updateRow = (id: string, field: keyof ScheduleRow, value: string) => {
    onRowsChange(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(27,42,107,0.08)', boxShadow: '0 4px 24px rgba(27,42,107,0.06)' }}>
      <table className="schedule-table">
        <thead>
          <tr>
            <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Saat</th>
            <th style={{ width: '20%' }}>Görevli Kişi</th>
            <th>Görev / Eylem</th>
            <th style={{ width: '30%' }}>Notlar</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              style={{
                background: index % 2 === 0 ? 'white' : 'rgba(250,247,245,0.7)',
              }}
            >
              <td className="schedule-time-cell">
                {row.timeSlot}
              </td>
              <td className="schedule-table-cell">
                <input
                  type="text"
                  value={row.assignee || ''}
                  onChange={(e) => updateRow(row.id, 'assignee', e.target.value)}
                  className="schedule-input"
                  placeholder="Kişi adı..."
                />
              </td>
              <td className="schedule-table-cell">
                <input
                  type="text"
                  value={row.action}
                  onChange={(e) => updateRow(row.id, 'action', e.target.value)}
                  className="schedule-input"
                  placeholder="Görev veya aktivite girin…"
                />
              </td>
              <td className="schedule-table-cell">
                <input
                  type="text"
                  value={row.notes || ''}
                  onChange={(e) => updateRow(row.id, 'notes', e.target.value)}
                  className="schedule-input"
                  placeholder="Not ekle…"
                  style={{ color: '#6B7280', fontSize: '0.82rem' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
