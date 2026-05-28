import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['link', 'image'],
  ['clean'],
];

const FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet', 'indent',
  'link', 'image',
];

export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="rte-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{ toolbar: TOOLBAR_OPTIONS }}
        formats={FORMATS}
        placeholder="Tell your story..."
      />
    </div>
  );
}
