import {
  VisaChevronDownTiny,
  VisaClearAltTiny,
  VisaDeleteTiny,
  VisaErrorTiny,
  VisaFileUploadTiny,
} from '@visa/nova-icons-react';
import {
  Button,
  Input,
  InputContainer,
  InputControl,
  Label,
  ProgressCircular,
  Select,
  Surface,
  Typography,
  Utility,
} from '@visa/nova-react';
import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GENRE_OPTIONS } from '../constants';
import { FormProps } from '../types/libraryTypes';
import { BadgeInfo } from './Badge';

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  showClear: boolean;
  error?: string;
  touched?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  ref?: React.Ref<HTMLInputElement>;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      onClear,
      onBlur,
      showClear,
      error,
      touched,
      type = 'text',
      autoComplete,
      inputMode,
      placeholder,
    },
    ref
  ) => (
    <Utility vFlex vFlexCol vGap={8}>
      <Label htmlFor={id}>{label}</Label>
      <InputContainer>
        <Input
          id={id}
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
        />
        {showClear && (
          <Button
            aria-label={`Clear ${label.toLowerCase()}`}
            buttonSize="small"
            colorScheme="tertiary"
            iconButton
            onClick={onClear}
            subtle
          >
            <VisaClearAltTiny />
          </Button>
        )}
      </InputContainer>
      {touched && error && (
        <Utility vFlex vFlexRow vAlignItems="center" id={`${id}-error`} role="alert">
          <Typography style={{ color: 'var(--v-error-color, red)', fontSize: 14 }}>
            <BadgeInfo
              label={error}
              badgeType="critical"
              icon={<VisaErrorTiny aria-label="error" />}
            />
          </Typography>
        </Utility>
      )}
    </Utility>
  )
);

InputField.displayName = 'InputField';

export const AddEditBookForm: React.FC<FormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
  loading,
}) => {
  // Combine form fields into one state object
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    author: initialData?.author || '',
    year: initialData?.year !== undefined ? String(initialData.year) : '',
    genre:
      GENRE_OPTIONS.find(
        (opt) => opt.toLowerCase() === initialData?.genre?.toLowerCase()
      ) || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [showClear, setShowClear] = useState({
    title: false,
    author: false,
    year: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [paused, setPaused] = useState(false);

  // Refs for inputs
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update showClear dynamically for all inputs
  useEffect(() => {
    setShowClear({
      title: formData.title !== '',
      author: formData.author !== '',
      year: formData.year !== '',
    });
  }, [formData.title, formData.author, formData.year]);

  useEffect(() => {
    setSelectedFile(null);
    setUploading(false);
    setPaused(false);
    setFormData((prev) => ({
      ...prev,
      imageUrl: initialData?.imageUrl || '',
    }));
  }, [initialData]);

  // Validation helper
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        break;
      case 'author':
        if (!value.trim()) return 'Author is required';
        break;
      case 'year':
        if (!value.trim()) return 'Year published is required';
        const numYear = Number(value);
        const currentYear = new Date().getFullYear();
        if (isNaN(numYear) || numYear < 1000 || numYear > currentYear + 1) {
          return `Year must be between 1000 and ${currentYear + 1}`;
        }
        break;
      case 'genre':
        if (!value.trim()) return 'Genre is required';
        break;
      default:
        return '';
    }
    return '';
  };

  // Validate on touched fields
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    Object.keys(touched).forEach((field) => {
      if (touched[field]) {
        const val = (formData as any)[field] || '';
        const validationError = validateField(field, val);
        if (validationError) newErrors[field] = validationError;
      }
    });
    setErrors(newErrors);
  }, [formData, touched]);

  // Generic blur handler
  const handleBlur =
    (field: string) =>
      (
        e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      ) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const value = e.currentTarget.value;
        const validationError = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: validationError }));
      };

  // Generic onClear handler
  const onClear = (field: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
    if (field === 'title') titleRef.current?.focus();
    else if (field === 'author') authorRef.current?.focus();
    else if (field === 'year') yearRef.current?.focus();
  };

  // Generic onChange handler for inputs
  const onChangeField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // File input change
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploading(true);
      setPaused(false);

      setFormData((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));

      setTimeout(() => {
        setUploading(false);
      }, 1500);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isFormValid =
    formData.title.trim() &&
    formData.author.trim() &&
    formData.year.trim() &&
    formData.genre.trim() &&
    Object.values(errors).every((e) => e === '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      title: true,
      author: true,
      year: true,
      genre: true,
    });

    if (!isFormValid || uploading) return;

    const newFormData = new FormData();
    // Generic form data appending
    Object.entries(formData).forEach(([key, val]) => {
      if (key !== 'imageUrl') newFormData.append(key, val);
    });
    if (selectedFile) newFormData.append('image', selectedFile);

    await onSubmit(newFormData);
  };

  return (
    <Utility
      vFlex
      vFlexCol
      vAlignItems="center"
      vJustifyContent="center"
      className="add-edit-form-wrapper"
    >
      <Surface
        elevation="medium"
        className="add-edit-form-surface"
        as="form"
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="form-title"
      >
        <Utility vFlex vFlexCol vGap={24}>
          <Typography variant="color-default" className="add-edit-form-title">
            {initialData
              ? 'Update the book details below and save your changes.'
              : 'Fill out the form below to add a new book to the library.'}
          </Typography>

          <InputField
            id="title-input"
            label="Title (required)"
            ref={titleRef}
            value={formData.title}
            onChange={(e) => onChangeField('title', e.currentTarget.value)}
            onBlur={handleBlur('title')}
            showClear={showClear.title}
            onClear={() => onClear('title')}
            error={errors.title}
            touched={touched.title}
          />

          <InputField
            id="author-input"
            label="Author (required)"
            ref={authorRef}
            value={formData.author}
            onChange={(e) => onChangeField('author', e.currentTarget.value)}
            onBlur={handleBlur('author')}
            showClear={showClear.author}
            onClear={() => onClear('author')}
            error={errors.author}
            touched={touched.author}
          />

          <InputField
            id="year-input"
            label="Year published (required)"
            ref={yearRef}
            value={formData.year}
            onChange={(e) => {
              if (e.currentTarget.value === '' || /^\d{0,4}$/.test(e.currentTarget.value)) {
                onChangeField('year', e.currentTarget.value);
              }
            }}
            onBlur={handleBlur('year')}
            showClear={showClear.year}
            onClear={() => onClear('year')}
            error={errors.year}
            touched={touched.year}
            inputMode="numeric"
            placeholder="e.g. 2023"
          />

          {/* Genre */}
          <Utility vFlex vFlexCol vGap={8}>
            <Label htmlFor="genre-select">Genre (required)</Label>
            <InputContainer>
              <Select
                id="genre-select"
                value={formData.genre}
                onChange={(e) => onChangeField('genre', e.currentTarget.value)}
                onBlur={handleBlur('genre')}
                aria-required="true"
                aria-invalid={!!errors.genre}
                aria-describedby={errors.genre ? 'genre-error' : undefined}
              >
                <option value="" hidden />
                {GENRE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
              <InputControl>
                <VisaChevronDownTiny />
              </InputControl>
            </InputContainer>
            {touched.genre && errors.genre && (
              <Utility vFlex vFlexRow vAlignItems="center" id="genre-error" role="alert">
                <Typography style={{ color: 'var(--v-error-color)', fontSize: 14 }}>
                  <BadgeInfo
                    label={errors.genre}
                    badgeType="critical"
                    icon={<VisaErrorTiny aria-label="error" />}
                  />
                </Typography>
              </Utility>
            )}
          </Utility>

          {/* Description */}
          <Utility vFlex vFlexCol vGap={8}>
            <Label htmlFor="description-textarea">Description (optional)</Label>
            <textarea
              id="description-textarea"
              value={formData.description}
              onChange={(e) => onChangeField('description', e.currentTarget.value)}
              rows={5}
              className="description-textarea"
            />
          </Utility>

          {/* Image Upload */}
          <Utility vFlex vFlexCol vGap={8}>
            <Label htmlFor="image-upload">Book Cover Image (optional)</Label>

            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Book cover preview"
                className="book-cover-image"
                draggable={false}
              />
            )}

            {uploading && (
              <ProgressCircular
                className="v-flex-grow upload-progress"
                indeterminate
                paused={paused}
                progressSize="small"
                aria-label="Uploading image"
              />
            )}

            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={onFileChange}
              id="image-upload"
            />

            <Button iconTwoColor type="button" onClick={handleUploadClick}>
              <VisaFileUploadTiny />
              Upload Image
            </Button>
          </Utility>

          {/* Actions */}
          <Utility vFlex vFlexRow vGap={16} className="form-actions">
            <Button
              type="submit"
              disabled={!isFormValid || loading || uploading}
              onClick={handleSubmit}
              aria-label={initialData ? 'Save changes' : 'Add book'}
            >
              {initialData ? 'Save changes' : 'Add book'}
            </Button>

            <Button
              type="button"
              colorScheme="secondary"
              onClick={onCancel}
              aria-label="Cancel"
              disabled={loading || uploading}
            >
              Cancel
            </Button>

            {initialData && onDelete && (
              <Button
                destructive
                colorScheme="secondary"
                onClick={onDelete}
                aria-label="Delete"
                disabled={loading || uploading}
              >
                <VisaDeleteTiny />
                Delete
              </Button>
            )}
          </Utility>
        </Utility>
      </Surface>
    </Utility>
  );
};