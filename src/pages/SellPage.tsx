import { useState, useRef } from 'react';
import { supabase, CATEGORIES, CONDITIONS, SIZES } from '@/lib/supabase';
import { getSessionId } from '@/lib/utils';
import { Check, Upload, X, AlertTriangle, Loader2 } from 'lucide-react';

export function SellPage() {
  const [form, setForm] = useState({
    submitter_name: '',
    submitter_email: '',
    submitter_phone: '',
    category: '',
    size: '',
    condition: '',
    asking_price_inr: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length + photos.length > 5) {
      setError('Max 5 photos allowed.');
      return;
    }
    setPhotos([...photos, ...files]);
    setPhotoPreviews([...photoPreviews, ...files.map((f) => URL.createObjectURL(f))]);
    setError(null);
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const sessionId = getSessionId();
      const photoUrls: string[] = [];

      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const ext = file.name.split('.').pop();
        const path = `${sessionId}/${Date.now()}-${i}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('sell-submissions')
          .upload(path, file);
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
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brass text-ivory mb-6">
          <Check size={32} />
        </div>
        <h1 className="font-display text-3xl mb-3" style={{ fontWeight: 400 }}>Submission received</h1>
        <p className="label-quiet mb-8 max-w-md mx-auto">
          We'll review your piece and get back to you within 48 hours. If it fits the drop,
          we'll send you an offer.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setForm({
              submitter_name: '',
              submitter_email: '',
              submitter_phone: '',
              category: '',
              size: '',
              condition: '',
              asking_price_inr: '',
            });
            setPhotos([]);
            setPhotoPreviews([]);
          }}
          className="btn btn-dark"
        >
          Submit another piece
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <p className="label-quiet mb-2">Got something worth reselling?</p>
        <h1 className="font-display text-4xl md:text-5xl mb-4" style={{ fontWeight: 400 }}>Sell to us</h1>
        <p className="font-body text-sm text-muted leading-relaxed max-w-md">
          Tell us what you've got. If it fits the drop, we'll make you an offer. No fluff,
          no lowballing — just fair prices for real pieces.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-quiet block mb-1.5">Your name</label>
            <input
              type="text"
              required
              value={form.submitter_name}
              onChange={(e) => setForm({ ...form, submitter_name: e.target.value })}
              className="input-field"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="label-quiet block mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.submitter_email}
              onChange={(e) => setForm({ ...form, submitter_email: e.target.value })}
              className="input-field"
              placeholder="you@email.com"
            />
          </div>
        </div>
        <div>
          <label className="label-quiet block mb-1.5">Phone (optional)</label>
          <input
            type="tel"
            value={form.submitter_phone}
            onChange={(e) => setForm({ ...form, submitter_phone: e.target.value })}
            className="input-field"
            placeholder="9876543210"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label-quiet block mb-1.5">Category</label>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-field"
            >
              <option value="">Select</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-quiet block mb-1.5">Size</label>
            <select
              required
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="input-field"
            >
              <option value="">Select</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-quiet block mb-1.5">Condition</label>
            <select
              required
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="input-field"
            >
              <option value="">Select</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label-quiet block mb-1.5">Asking price (₹)</label>
          <input
            type="number"
            required
            min="1"
            value={form.asking_price_inr}
            onChange={(e) => setForm({ ...form, asking_price_inr: e.target.value })}
            className="input-field"
            placeholder="2500"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="label-quiet block mb-2">Photos (up to 5)</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-hairline p-8 text-center cursor-pointer hover:bg-ivory-200 transition-colors"
          >
            <Upload size={22} className="mx-auto mb-3 text-muted-light" />
            <p className="label-quiet">
              {photos.length > 0
                ? `${photos.length} photo${photos.length > 1 ? 's' : ''} selected`
                : 'Click to upload photos of your item'}
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
            <div className="flex flex-wrap gap-2 mt-3">
              {photoPreviews.map((preview, i) => (
                <div key={i} className="relative w-20 h-20 overflow-hidden">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-0 right-0 bg-ink text-ivory p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 text-error font-body text-sm">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit your piece'
          )}
        </button>
      </form>
    </div>
  );
}
