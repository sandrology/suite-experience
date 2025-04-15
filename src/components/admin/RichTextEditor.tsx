import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, List, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, ListOrdered, Palette,
  Type, Underline, Link, Image, FileType
} from 'lucide-react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue,
  onChange,
  placeholder = 'Enter content here...'
}) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize content only once when component mounts
  useEffect(() => {
    if (!isInitialized && editorRef.current) {
      editorRef.current.innerHTML = initialValue || '';
      setIsInitialized(true);
    }
  }, [initialValue, isInitialized]);

  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      setValue(newValue);
      onChange(newValue);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };
  
  const handleInsertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleBulletList = () => {
    execCommand('insertUnorderedList');
  };

  const handleNumberedList = () => {
    execCommand('insertOrderedList');
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const lines = text.split('\n');
    let htmlContent = '';
    
    for (const line of lines) {
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        if (!htmlContent.includes('<ul>')) {
          htmlContent += '<ul>';
        }
        htmlContent += `<li>${line.trim().substring(1).trim()}</li>`;
      } else if (line.trim().match(/^(\d+)\./) || line.trim().match(/^(\d+)\)/)) {
        if (!htmlContent.includes('<ol>')) {
          htmlContent += '<ol>';
        }
        const content = line.trim().replace(/^\d+[\.\)]/, '').trim();
        htmlContent += `<li>${content}</li>`;
      } else if (line.trim() === '' && htmlContent.includes('<ul>') && !htmlContent.includes('</ul>')) {
        htmlContent += '</ul>';
      } else if (line.trim() === '' && htmlContent.includes('<ol>') && !htmlContent.includes('</ol>')) {
        htmlContent += '</ol>';
      } else {
        if (htmlContent.includes('<ul>') && !htmlContent.includes('</ul>')) {
          htmlContent += '</ul>';
        }
        if (htmlContent.includes('<ol>') && !htmlContent.includes('</ol>')) {
          htmlContent += '</ol>';
        }
        if (line.trim() !== '') {
          htmlContent += `${line}<br/>`;
        } else {
          htmlContent += '<br/>';
        }
      }
    }
    
    if (htmlContent.includes('<ul>') && !htmlContent.includes('</ul>')) {
      htmlContent += '</ul>';
    }
    if (htmlContent.includes('<ol>') && !htmlContent.includes('</ol>')) {
      htmlContent += '</ol>';
    }
    
    document.execCommand('insertHTML', false, htmlContent);
    handleInput();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    execCommand('foreColor', color);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
      return false;
    }
  };

  const colorOptions = ["#000000", "#ff0000", "#0000ff", "#008000", "#ffa500", "#800080"];

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1 rounded hover:bg-gray-200"
          title="Bold"
        >
          <Bold className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1 rounded hover:bg-gray-200"
          title="Italic"
        >
          <Italic className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-1 rounded hover:bg-gray-200"
          title="Underline"
        >
          <Underline className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={handleBulletList}
          className="p-1 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          <List className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleNumberedList}
          className="p-1 rounded hover:bg-gray-200"
          title="Numbered List"
        >
          <ListOrdered className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h1>')}
          className="p-1 rounded hover:bg-gray-200"
          title="Heading 1"
        >
          <Heading1 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="p-1 rounded hover:bg-gray-200"
          title="Heading 2"
        >
          <Heading2 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="p-1 rounded hover:bg-gray-200"
          title="Heading 3"
        >
          <Heading3 className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-1 rounded hover:bg-gray-200"
          title="Align Left"
        >
          <AlignLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-1 rounded hover:bg-gray-200"
          title="Align Center"
        >
          <AlignCenter className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-1 rounded hover:bg-gray-200"
          title="Align Right"
        >
          <AlignRight className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={handleInsertLink}
          className="p-1 rounded hover:bg-gray-200"
          title="Insert Link"
        >
          <Link className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleInsertImage}
          className="p-1 rounded hover:bg-gray-200"
          title="Insert Image"
        >
          <Image className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 rounded hover:bg-gray-200 flex items-center"
            title="Text Color"
          >
            <Palette className="h-5 w-5" />
            <div className="ml-1 w-3 h-3 rounded-full" style={{ backgroundColor: selectedColor }}></div>
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded-md shadow-lg z-10">
              <div className="flex gap-1 mb-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      execCommand('foreColor', color);
                      setSelectedColor(color);
                      setShowColorPicker(false);
                    }}
                  ></button>
                ))}
              </div>
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="w-full cursor-pointer"
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="p-1 rounded hover:bg-gray-200 ml-1"
          title="Clear Formatting"
        >
          <Type className="h-5 w-5" />
        </button>
      </div>
      <div
        ref={editorRef}
        className="w-full p-4 min-h-[200px] focus:outline-none focus:ring-1 focus:ring-primary overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        style={{ minHeight: '200px' }}
      />
      <div className="p-2 bg-gray-50 border-t text-xs text-gray-500">
        Usa i pulsanti della barra degli strumenti per la formattazione. Puoi anche incollare contenuto con formattazione.
      </div>
    </div>
  );
};

export default RichTextEditor;