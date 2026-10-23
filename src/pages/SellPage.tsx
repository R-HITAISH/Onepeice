import { useState, useRef, useCallback } from 'react';
import { supabase, CATEGORIES, CONDITIONS, SIZES } from '@/lib/supabase';
import { getSessionId } from '@/lib/utils';
import { Check, Upload, X, Loader2 } from 'lucide-react';

type FormState = {
  submitter_name: string;
  submitter_email: string;
  submitter_phone: string;
  category: string;
  size: string;
  condition: string;
  asking_price_inr: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const MAX_PHOTOS = 10;

export function SellPage() {
  const [form, setForm] = useState<FormState>({
    submitter_name: '',
    submitter_email: '',
    submitter_phone: '',
    category: '',
    size: '',
    condition: '',
    asking_price_inr: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: File[]) => {
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = files.slice(0, remaining);
    if (files.length > remaining) {
      setError(`Maximum ${MAX_PHOTOS} photos. Only the first ${remaining} were added.`);
    } else {
      setError(null);
    }
    setPhotos([...photos, ...toAdd]);
    setPhotoPreviews([...photoPreviews, ...toAdd.map((f) => URL.createObjectURL(f))]);
  }, [photos]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    handleFiles(files);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    handleFiles(files);
  };

  const removePhoto = (idx: number) => {
    URL.revokeObjectURL(photoPreviews[idx]);
    setPhotos(photos.filter((_, i) => i !== idx));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== idx));
  };

  const validateField = (name: keyof FormState, value: string): string | undefined => {
    const v = value.trim();
    if (!v) return 'This field is required.';
    if (name === 'submitter_email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
    if (name === 'submitter_phone') {
      const digits = v.replace(/\D/g, '').replace(/^91/, '');
      if (!/^[6-9]\d{9}$/.test(digits)) return 'Enter a valid 10-digit Indian mobile number.';
    }
    if (name === 'asking_price_inr') {
      const n = parseInt(v, 10);
      if (isNaN(n) || n < 1) return 'Enter a price greater than zero.';
    }
  };

  const handleBlur = (name: keyof FormState) => {
    const msg = validateField(name, form[name]);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const setField = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const isFormValid = () => {
    const fields: (keyof FormState)[] = ['submitter_name', 'submitter_email', 'submitter_phone', 'category', 'size', 'condition', 'asking_price_inr'];
    return fields.every((f) => !validateField(f, form[f]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      const fields: (keyof FormState)[] = ['submitter_name', 'submitter_email', 'submitter_phone', 'category', 'size', 'condition', 'asking_price_inr'];
      const newErrors: FormErrors = {};
      fields.forEach((f) => { const msg = validateField(f, form[f]); if (msg) newErrors[f] = msg; });
      setErrors(newErrors);
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const sessionId = getSessionId();
      const photoUrls: string[] = [];

      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const ext = file.name.split('.').pop();
        const path = `${sessionId}/${Date.now()}-${i}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('sell-submissions').upload(path, file);
        if (uploadErr) throw new Error(`Photo upload failed: ${uploadErr.message}`);
        const { data: urlData } = supabase.storage.from('sell-submissions').getPublicUrl(path);
        photoUrls.push(urlData.publicUrl);
      }

      const { error: insertErr } = await supabase.from('sell_submissions').insert({
        submitter_name: form.submitter_name,
        submitter_email: form.submitter_email,
        submitter_phone: form.submitter_phone || null,
        category: form.category,
        size: form.size,
        condition: form.condition,
        asking_price_inr: parseInt(form.asking_price_inr, 10),
        photos: photoUrls,
      });

      if (insertErr) throw new Error(insertErr.message);

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="page text-center" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className="inline-flex items-center justify-center w-14 h-14 mb-6" style={{ background: 'var(--success)', color: 'var(--paper)' }}>
          <Check size={28} />
        </div>
        <h1 style={{ fontWeight: 400 }} className="mb-3">We've got it. We'll be in touch.</h1>
        <button
          onClick={() => {
            setSuccess(false);
            setForm({ submitter_name: '', submitter_email: '', submitter_phone: '', category: '', size: '', condition: '', asking_price_inr: '' });
            setPhotos([]);
            setPhotoPreviews([]);
          }}
          className="btn btn-secondary mt-6"
        >
          Submit another piece
        </button>
      </div>
    );
  }

  const errStyle = { borderColor: 'var(--error)' };

  return (
    <div className="page" style={{ paddingTop: 'clamp(2.5rem,5vw,5rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
      <div className="mb-10">
        <h1 style={{ fontWeight: 400 }}>Sell to us.</h1>
        <p className="mt-3 text-base" style={{ color: 'var(--ink-2)' }}>
          Send us your pieces. Tell us the size, condition and your price.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 max-w-[640px]">
        <div>
          <label className="label-field" htmlFor="sell-name">Your name</label>
          <input
            id="sell-name"
            type="text"
            required
            value={form.submitter_name}
            onChange={(e) => setField('submitter_name', e.target.value)}
            onBlur={() => handleBlur('submitter_name')}
            className="input"
            style={errors.submitter_name ? errStyle : undefined}
          />
          {errors.submitter_name && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.submitter_name}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="sell-email">Email</label>
          <input
            id="sell-email"
            type="email"
            required
            value={form.submitter_email}
            onChange={(e) => setField('submitter_email', e.target.value)}
            onBlur={() => handleBlur('submitter_email')}
            className="input"
            style={errors.submitter_email ? errStyle : undefined}
          />
          {errors.submitter_email && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.submitter_email}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label-field" htmlFor="sell-phone">Phone</label>
          <input
            id="sell-phone"
            type="tel"
            required
            inputMode="numeric"
            value={form.submitter_phone}
            onChange={(e) => setField('submitter_phone', e.target.value)}
            onBlur={() => handleBlur('submitter_phone')}
            className="input"
            style={errors.submitter_phone ? errStyle : undefined}
          />
          {errors.submitter_phone && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.submitter_phone}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="sell-cat">Category</label>
          <select
            id="sell-cat"
            required
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            className="input"
            style={errors.category ? errStyle : undefined}
          >
            <option value="">Select</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.category}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="sell-size">Size</label>
          <select
            id="sell-size"
            required
            value={form.size}
            onChange={(e) => setField('size', e.target.value)}
            onBlur={() => handleBlur('size')}
            className="input"
            style={errors.size ? errStyle : undefined}
          >
            <option value="">Select</option>
            {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.size && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.size}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label-field" htmlFor="sell-cond">Condition</label>
          <textarea
            id="sell-cond"
            required
            value={form.condition}
            onChange={(e) => setField('condition', e.target.value)}
            onBlur={() => handleBlur('condition')}
            className="input"
            style={{ minHeight: '80px', ...(errors.condition ? errStyle : {}) }}
            placeholder="Describe the condition — stains, fading, repairs, wear."
          />
          {errors.condition && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.condition}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label-field" htmlFor="sell-price">Asking price (₹)</label>
          <input
            id="sell-price"
            type="number"
            required
            min="1"
            value={form.asking_price_inr}
            onChange={(e) => setField('asking_price_inr', e.target.value)}
            onBlur={() => handleBlur('asking_price_inr')}
            className="input"
            style={errors.asking_price_inr ? errStyle : undefined}
          />
          {errors.asking_price_inr && <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>{errors.asking_price_inr}</p>}
        </div>

        {/* Photo upload */}
        <div className="md:col-span-2">
          <label className="label-field">Photos (up to {MAX_PHOTOS})</label>
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className="input cursor-pointer flex flex-col items-center justify-center py-10 text-center"
            style={{ borderStyle: 'dashed', ...(dragOver ? { borderColor: 'var(--brass)', background: 'var(--sunken)' } : {}) }}
          >
            <Upload size={22} className="mb-3" style={{ color: 'var(--ink-2)' }} />
            <p className="label">
              {photos.length > 0
                ? `${photos.length} photo${photos.length > 1 ? 's' : ''} selected`
                : 'Drag photos here or tap to upload'}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {photoPreviews.map((preview, i) => (
                <div key={i} className="relative product-media aspect-square overflow-hidden">
                  <img src={preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                    className="absolute top-1 right-1 p-1"
                    style={{ background: 'var(--ink)', color: 'var(--paper)' }}
                    aria-label="Remove photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="md:col-span-2 text-sm" style={{ color: 'var(--error)' }}>
            {error}
          </div>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting || !isFormValid()}
            className="btn btn-primary w-full"
          >
            {submitting ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : 'Send to us'}
          </button>
        </div>
      </form>
    </div>
  );
}
