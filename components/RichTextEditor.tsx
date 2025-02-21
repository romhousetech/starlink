'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  List,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  headerBackground?: string; // New prop for header background
  headerTextColor?: string; // New prop for header text color
}

interface TableDimensions {
  rows: number;
  cols: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue = '',
  onChange,
  headerBackground = 'bg-gray-50', // Default value
  headerTextColor = 'text-gray-700', // Default value
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [tableDimensions, setTableDimensions] = useState<TableDimensions>({
    rows: 2,
    cols: 2,
  });

  // Initialize the editor content once on mount
  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    execCommand('fontSize', e.target.value);
  };

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    execCommand('foreColor', e.target.value);
  };

  const formatButton = (
    icon: React.ReactNode,
    command: string,
    title: string
  ) => (
    <button
      type="button"
      onClick={() => execCommand(command)}
      className={`p-2 hover:bg-gray-200 rounded-md transition-colors ${headerTextColor}`}
      title={title}
    >
      {icon}
    </button>
  );

  const createTable = () => {
    const { rows, cols } = tableDimensions;
    let tableHTML = '<table class="border-collapse w-full my-4">';

    // Create header row
    tableHTML += '<thead><tr>';
    for (let j = 0; j < cols; j++) {
      tableHTML +=
        '<th class="border border-gray-300 p-2 bg-gray-50">Header ' +
        (j + 1) +
        '</th>';
    }
    tableHTML += '</tr></thead><tbody>';

    // Create body rows
    for (let i = 0; i < rows - 1; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML +=
          '<td class="border border-gray-300 p-2">Cell ' + (j + 1) + '</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';

    // Insert table at cursor position or at the end
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const tableElement = document.createElement('div');
      tableElement.innerHTML = tableHTML;
      range.insertNode(tableElement);
    } else if (editorRef.current) {
      editorRef.current.innerHTML += tableHTML;
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleTableOperation = (operation: string) => {
    const selection = window.getSelection();
    if (!selection) return;

    const cell = selection.anchorNode?.parentElement;
    if (!cell) return;

    const row = cell.closest('tr');
    const table = cell.closest('table');

    if (!row || !table) return;

    switch (operation) {
      case 'addRow':
        const newRow = row.cloneNode(true) as HTMLTableRowElement;
        Array.from(newRow.cells).forEach((cell) => (cell.textContent = ''));
        row.after(newRow);
        break;
      case 'addColumn':
        const columnIndex = Array.from(row.cells).indexOf(
          cell as HTMLTableCellElement
        );
        Array.from(table.rows).forEach((row) => {
          const newCell = document.createElement(
            row.parentElement?.tagName === 'THEAD' ? 'th' : 'td'
          );
          newCell.className = 'border border-gray-300 p-2';
          row.cells[columnIndex].after(newCell);
        });
        break;
      case 'deleteRow':
        if (table.rows.length > 2) {
          row.remove();
        }
        break;
      case 'deleteColumn':
        if (row.cells.length > 1) {
          const columnIndex = Array.from(row.cells).indexOf(
            cell as HTMLTableCellElement
          );
          Array.from(table.rows).forEach((row) =>
            row.cells[columnIndex].remove()
          );
        }
        break;
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Handle editor input events correctly
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        isFocused ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div
        className={`border-b p-2 flex flex-wrap gap-2 items-center ${headerBackground} ${headerTextColor}`}
      >
        <select
          onChange={handleFontSize}
          className="p-1 border rounded"
          title="Font Size"
        >
          <option value="3">Normal</option>
          <option value="1">Small</option>
          <option value="4">Large</option>
          <option value="5">Extra Large</option>
        </select>

        <input
          type="color"
          onChange={handleColor}
          className="w-8 h-8 p-1 cursor-pointer"
          title="Text Color"
        />

        <div className="h-4 w-px bg-gray-300 mx-2" />

        {formatButton(<Bold size={18} />, 'bold', 'Bold')}
        {formatButton(<Italic size={18} />, 'italic', 'Italic')}

        <div className="h-4 w-px bg-gray-300 mx-2" />

        {formatButton(<AlignLeft size={18} />, 'justifyLeft', 'Align Left')}
        {formatButton(
          <AlignCenter size={18} />,
          'justifyCenter',
          'Align Center'
        )}
        {formatButton(<AlignRight size={18} />, 'justifyRight', 'Align Right')}

        <div className="h-4 w-px bg-gray-300 mx-2" />

        {formatButton(<List size={18} />, 'insertUnorderedList', 'Bullet List')}

        <div className="h-4 w-px bg-gray-300 mx-2" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Table size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Insert Table</h4>
                <div className="flex gap-2">
                  <div className="space-y-1">
                    <label className="text-sm">Rows</label>
                    <Input
                      type="number"
                      min="2"
                      value={tableDimensions.rows}
                      onChange={(e) =>
                        setTableDimensions((prev) => ({
                          ...prev,
                          rows: parseInt(e.target.value) || 2,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm">Columns</label>
                    <Input
                      type="number"
                      min="1"
                      value={tableDimensions.cols}
                      onChange={(e) =>
                        setTableDimensions((prev) => ({
                          ...prev,
                          cols: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button onClick={createTable} className="w-full">
                  Insert Table
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Table Operations</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTableOperation('addRow')}
                    className="flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Row
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTableOperation('addColumn')}
                    className="flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Column
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTableOperation('deleteRow')}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete Row
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTableOperation('deleteColumn')}
                    className="flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete Column
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
